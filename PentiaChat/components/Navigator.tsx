import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoomsListScreen from '../screens/rooms-list/RoomsList.screen';
import SplashScreen from '../screens/splash/Splash.screen';
import { ReactNode, useContext } from 'react';
import { FirebaseContext } from './providers/FirebaseContextProvider';
import LoginScreen from '../screens/login/Login.screen';
import { ActivityIndicator, Button, Linking, useColorScheme } from 'react-native';
import RoomScreen from '../screens/room/Room.screen';
import { Screens } from '../screens/NavigatorScreens';
import { FirebaseMessagingTypes, getMessaging } from '@react-native-firebase/messaging';
import Notification from './Notification';

const Stack = createNativeStackNavigator<Screens>();

function buildDeepLinkFromNotificationData(message: FirebaseMessagingTypes.RemoteMessage | null): string | null {
	if (message === null) {
		return null;
	}

	if (message.notification === undefined) {
		return null;
	}

	if (message.data === undefined) {
		return null;
	}

	if (!('room' in message.data)) {
		return null;
	}

	if (typeof (message.data.room) !== 'string') {
		return null;
	}

	const roomInfo = JSON.parse(message.data.room);
	const roomID = roomInfo.key;
	const roomName = roomInfo.name;
	return `pentiachat://room/${roomID}/${roomName}`;
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
		const deeplinkURL = buildDeepLinkFromNotificationData(message);
		if (typeof deeplinkURL === 'string') {
			return deeplinkURL;
		}
	},
	subscribe(listener: (url: string) => void) {
		const onReceiveURL = ({url}: {url: string}) => listener(url);

		// Listen to incoming links from deep linking
		const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

		//onNotificationOpenedApp: When the application is running, but in the background.
		const unsubscribe = getMessaging().onNotificationOpenedApp(remoteMessage => {
			const url = buildDeepLinkFromNotificationData(remoteMessage);
			if (typeof url === 'string') {
				listener(url);
			}
		});

		return () => {
			linkingSubscription.remove();
			unsubscribe();
		};
	},
};

const Navigator = () => {
	const firebaseContext = useContext(FirebaseContext);
	const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

	let screensAvailable: ReactNode | undefined;

	if (firebaseContext.initialising || firebaseContext.app === undefined) {
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

	return (
		<>
		<Notification />
		<NavigationContainer linking={linking} theme={theme} fallback={<ActivityIndicator animating />}>
			<Stack.Navigator>
				{screensAvailable}
			</Stack.Navigator>
		</NavigationContainer>
		</>
	);
};

export default Navigator;
