import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoomsListScreen from '../screens/rooms-list/RoomsList.screen';
import SplashScreen from '../screens/splash/Splash.screen';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { FirebaseContext } from './providers/FirebaseContextProvider';
import LoginScreen from '../screens/login/Login.screen';
import { ActivityIndicator, Button, Linking, Pressable, Text, useColorScheme, View } from 'react-native';
import RoomScreen from '../screens/room/Room.screen';
import { Screens } from '../screens/NavigatorScreens';
import { getMessaging } from '@react-native-firebase/messaging';
import { Room } from '../models/Room.model';

const Stack = createNativeStackNavigator<Screens>();

function buildDeepLinkFromNotificationData(data: any): string | null {
	if ('roomID' in data) {
		const roomID = data?.roomID;
		if (typeof roomID === 'string') {
			return `pentiachat://room/${roomID}`;
		}
		console.warn('Missing roomID');
	}
	return null;
}

const linking = {
	prefixes: ['pentiachat://'],
	config: {
		screens: {
			Room: 'room/:id/:name',
		},
	},
	async getInitialURL() {
		const url = await Linking.getInitialURL();
		if (typeof url === 'string') {
			return url;
		}

		//getInitialNotification: When the application is opened from a quit state.

		const message = await getMessaging().getInitialNotification();
		const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
		if (typeof deeplinkURL === 'string') {
			return deeplinkURL;
		}
	},
	subscribe(listener: (url: string) => void) {
		//onNotificationOpenedApp: When the application is running, but in the background.
		const unsubscribe = getMessaging().onNotificationOpenedApp(remoteMessage => {
			const url = buildDeepLinkFromNotificationData(remoteMessage.data);
			if (typeof url === 'string') {
				listener(url);
			}
		});

		return () => {
			unsubscribe();
		};
	},
};

const Navigator = () => {
	const firebaseContext = useContext(FirebaseContext);
	const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

	const [notificationText, setNotificationText] = useState('');
	const [notificationRoom, setNotificationRoom] = useState<Room|null>(null);

	let screensAvailable: ReactNode | undefined;

	if (firebaseContext.initialising) {
		screensAvailable = <Stack.Screen name="Splash" options={{headerShown: false}} component={SplashScreen} />;
	} else if (firebaseContext.user === null) {
		screensAvailable = (
			<>
			<Stack.Screen name="Login" component={LoginScreen} />
			</>
		);
	} else {
		screensAvailable = (
			<Stack.Group screenOptions={{
				// eslint-disable-next-line react/no-unstable-nested-components
				headerRight: () => (
					<Button title="Logout" onPress={() => firebaseContext.auth?.signOut().then(() => console.log('Successfully signed out'))} />
				),
			}}>
				<Stack.Screen name="Rooms" component={RoomsListScreen} />
				<Stack.Screen name="Room" component={RoomScreen} initialParams={{ id: '', name: '' }} />
			</Stack.Group>
		);
	}

	useEffect(() => {
		const subscriber = getMessaging().onMessage(async message => {
			if (message.notification) {
				if (message.data) {
					setNotificationRoom(message.data?.room as Room || null);
				}
				setNotificationText(message.notification.body || '');
			}
		});

		return subscriber;
	}, []);

	return (
		<>
		<Pressable onPress={() => {
			Linking.openURL(`pentiachat://room/${notificationRoom?.key}/${notificationRoom?.name}`);
		}}>
			<View>
				<Text>{notificationText}</Text>
			</View>
		</Pressable>
		<NavigationContainer linking={linking} theme={theme} fallback={<ActivityIndicator animating />}>
			<Stack.Navigator>
				{screensAvailable}
			</Stack.Navigator>
		</NavigationContainer>
		</>
	);
};

export default Navigator;
