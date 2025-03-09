import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

import { FirebaseContextProvider } from './components/providers/FirebaseContextProvider';
import Navigator from './components/Navigator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

const App = () => {
	const isDarkMode = useColorScheme() === 'dark';
	const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

	const style = StyleSheet.create({
		container: {
			backgroundColor: theme.colors.background,
			color: theme.colors.text,
			height: '100%',
			width: '100%',
		},
	});

	return (
		<SafeAreaProvider>
			<SafeAreaView>
				<FirebaseContextProvider>
					<View style={style.container}>
						<StatusBar
						barStyle={isDarkMode ? 'light-content' : 'dark-content'}
						backgroundColor={style.container.backgroundColor}
						/>
						<Navigator />
					</View>
				</FirebaseContextProvider>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default App;
