import { getApp, ReactNativeFirebase } from '@react-native-firebase/app';
import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '../../models/User.model';
import { collection, doc, getFirestore, onSnapshot, query, setDoc } from '@react-native-firebase/firestore';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { getMessaging, AuthorizationStatus } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FirebaseContextProps = {
	children: ReactNode
}

export type FirebaseContextType = {
	app: ReactNativeFirebase.FirebaseApp | undefined;
	auth: FirebaseAuthTypes.Module | undefined;
	user: FirebaseAuthTypes.User | null,
	initialising: boolean,
	userCache: Map<string, User>;
	subscribeToTopic: (topic: string) => Promise<void>;
	unsubscribeFromTopic: (topic: string) => Promise<void>;
}

export const FirebaseContext = createContext<FirebaseContextType>({
	app: undefined,
	auth: undefined,
	user: null,
	initialising: false,
	userCache: new Map<string, User>(),
	subscribeToTopic: async (_topic: string) => {},
	unsubscribeFromTopic: async (_topic) => {},
});

export const FirebaseContextProvider = (props: FirebaseContextProps) => {
	const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
	const [initialising, setInitialising] = useState<boolean>(true);
	const [userCache, setUserCache] = useState<Map<string, User>>(new Map());

	const app = getApp();
	const auth = getAuth(app);
	const firestore = getFirestore();
	const messaging = getMessaging();

	const subscribeToTopic = async (topic: string) => {
		let granted = false;

		// Check if we have already have asked the user before
		const savedInfo = await AsyncStorage.getItem(`notifications-${topic}`);
		if (savedInfo !== null) {
			// If the user told us to never ask again, ignore the subscription request.
			// I don't know if this is managed by the system itself, but it's better to be extra safe
			if (savedInfo === 'never_ask_again') {
				return;
			} else {
				granted = savedInfo === 'granted';
			}
		}
		if (granted) {
			return messaging.subscribeToTopic(topic);
		}

		// Request permissions for notifications
		if (Platform.OS === 'android') {
			granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
			if (!granted) {
				const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
				granted = status === 'granted';
				await AsyncStorage.setItem(`notifications-${topic}`, status);
			}
		} else if (Platform.OS === 'ios') {
			const status = await messaging.requestPermission();
			granted =	status === AuthorizationStatus.AUTHORIZED ||
						status === AuthorizationStatus.PROVISIONAL;
			if (granted) {
				await AsyncStorage.setItem(`notifications-${topic}`, 'granted');
			} else if (status === AuthorizationStatus.DENIED) {
				await AsyncStorage.setItem(`notifications-${topic}`, 'denied');
			}
		}
		if (granted) {
			return messaging.subscribeToTopic(topic);
		}
	};

	// Handle user state changes
	const authStateChanged = (_user: FirebaseAuthTypes.User | null) => {
		setUser(_user);
		if (initialising) {
			setInitialising(false);
		}
		if (_user !== null) {
			// Add user to database if not exists yet, or update if it does
			const newUserRef = doc(firestore, 'Users', _user.uid);

			setDoc(newUserRef, {
				uid: _user.uid,
				avatarURL: _user.photoURL,
				name: _user.displayName,
			}).catch((error) => {
				// We don't want to inform the user if this failed
				// but we'd obviously log this to our development logs service somewhere
				console.error(error);
			});
		}
	};

	useEffect(() => {
		const subscriber = onAuthStateChanged(auth, authStateChanged);
		return subscriber; // unsubscribe on unmount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Effect to get a live cache of all users in our system for quick lookup of user info like profile pictures
	// I don't know if fetching all users and caching those is more effective than fetching a user whenever we need
	useEffect(() => {
		if (user === null) {
			return () => {};
		}

		const q = query(collection(firestore, 'Users'));
		const subscriber = onSnapshot(q, (querySnapshot) => {
			const tempUserCache = new Map<string, User>();

			if (querySnapshot === null) {
				Alert.alert('Permissions Error', 'Something went wrong with the permissions. Could not fetch data');
				return () => subscriber();
			}
			querySnapshot?.forEach(documentSnapshot => {
				const userData: User = {
					...documentSnapshot.data(),
					key: documentSnapshot.id,
				} as any; // We know it is the correct data, but Typescript cannot infer that from the callback
				tempUserCache.set(userData.key, userData);
			});

			setUserCache(tempUserCache);
		});

		// Unsubscribe from events when no longer in use
		return () => subscriber();
	}, [user, firestore]);

	return (
		<>
			<FirebaseContext.Provider value={{app, auth, user, initialising, userCache, subscribeToTopic, unsubscribeFromTopic: messaging.unsubscribeFromTopic}}>
				{props.children}
			</FirebaseContext.Provider>
		</>
	);
};
