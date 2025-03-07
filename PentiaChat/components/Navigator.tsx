import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoomsListScreen from '../screens/rooms-list/RoomsList.screen';
import SplashScreen from '../screens/splash/Splash.screen';
import { ReactNode, useContext } from 'react';
import { FirebaseContext } from './providers/FirebaseContextProvider';
import LoginScreen from '../screens/login/Login.screen';
import { Button } from 'react-native';

const Stack = createNativeStackNavigator();

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
