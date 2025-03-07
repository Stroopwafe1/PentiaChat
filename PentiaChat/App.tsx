import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

import { FirebaseContextProvider } from './components/providers/FirebaseContextProvider';
import Navigator from './components/Navigator';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
	const isDarkMode = useColorScheme() === 'dark';
	const style = StyleSheet.create({
		container: {
			backgroundColor: isDarkMode ? '#2e2e2e' : '#efefef',
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
						barStyle={!isDarkMode ? 'light-content' : 'dark-content'}
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
