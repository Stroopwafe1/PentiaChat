import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native';

const style = StyleSheet.create({
	container: {
		flex: 1,
		flexGrow: 1,
		height: '100%',
	},
	text: {
		alignSelf: 'center',
		color: '#fefefe',
		fontSize: 30,
	},
});

const SplashScreen = () => {
	const imageSrc = {uri: 'https://legacy.reactjs.org/logo-og.png'};

	// TODO(lilith): Make this look nicer with like an <ImageBackground> or something
	return (
		<View style={style.container}>
			<ImageBackground style={style.container} source={imageSrc} resizeMode="cover">
				<Text style={style.text}>Initialising the app...</Text>
				<ActivityIndicator size="large" />
			</ImageBackground>
		</View>

	);
};

export default SplashScreen;
