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
	setUser: Dispatch<SetStateAction<FirebaseAuthTypes.User | null>>,
	initialising: boolean,
}

export const FirebaseContext = createContext<FirebaseContextType>({
	app: undefined,
	auth: undefined,
	user: null,
	setUser: () => {},
	initialising: false,
});

export const FirebaseContextProvider = (props: FirebaseContextProps) => {
	const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
	const [initialising, setInitialising] = useState<boolean>(true);

	// Handle user state changes
	const authStateChanged = (_user: FirebaseAuthTypes.User | null) => {
		setUser(_user);
		if (initialising) {
			setInitialising(false);
		}
	};

	const app = getApp();
	const auth = getAuth(app);

	useEffect(() => {
		const subscriber = onAuthStateChanged(auth, authStateChanged);
		return subscriber; // unsubscribe on unmount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<FirebaseContext.Provider value={{app, auth, user, setUser, initialising}}>
			{props.children}
		</FirebaseContext.Provider>
	);
};
