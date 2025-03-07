import auth from '@react-native-firebase/auth';
import { Alert, View } from 'react-native';
import { GoogleSignin, GoogleSigninButton, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { FirebaseContext, FirebaseContextType } from '../../components/providers/FirebaseContextProvider';
import { useContext } from 'react';

GoogleSignin.configure({
	webClientId: '552207291998-di4vuhtdj6j6gf1teoetl7ul7375g8l0.apps.googleusercontent.com',
});

const googleLoginHandler = async (firebase: FirebaseContextType) => {
	await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
	const signInResult = await GoogleSignin.signIn();
	if (!isSuccessResponse(signInResult)) {
		Alert.alert('Authentication Error', 'Something went wrong during the sign-in process, please try again');
		return;
	}

	let idToken = signInResult.data?.idToken;
	if (!idToken) {
		Alert.alert('Authentication Error', 'Something went wrong during the sign-in process, please try again');
		return;
	}

	// Create a Google credential with the token
	const googleCredential = auth?.GoogleAuthProvider.credential(idToken);

	// Sign-in the user with the credential
	firebase.auth?.signInWithCredential(googleCredential)
	.then((result) => {
		console.log('Successfully signed in with google', result);
	}).catch((error) => {
		console.error(error);
		if(isErrorWithCode(error)) {
			switch (error.code) {
				case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
					Alert.alert('Authentication Error', 'Google Play Services are not available, please try again later');
					break;
				case statusCodes.SIGN_IN_CANCELLED:
					Alert.alert('Authentication Error', 'You need to sign in to use the app');
					break;
				default:
					Alert.alert('Authentication Error', 'Unknown authentication error. Sorry for the inconvenience');
					break;
			}
		}
	});
};

const LoginScreen = () => {
	const firebaseContext = useContext(FirebaseContext);

	return (
		<View>
			<GoogleSigninButton onPress={() => googleLoginHandler(firebaseContext)} />
		</View>
	);
};

export default LoginScreen;
