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

const Navigator = () => {
	const firebaseContext = useContext(FirebaseContext);

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

	return (
		<>
		<NavigationContainer>
			<Stack.Navigator>
				{screensAvailable}
			</Stack.Navigator>
		</NavigationContainer>
		</>
	);
};

export default Navigator;
