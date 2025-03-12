import { Animated, StyleSheet } from 'react-native';

export const getRoomListEntryStyle = (theme: ReactNavigation.Theme, fadeAnim: Animated.Value) => {
	const style = StyleSheet.create({
		container: {
			justifyContent: 'space-around',
			flexDirection: 'row',
			alignContent: 'center',
			backgroundColor: theme.colors.border,
			opacity: fadeAnim,
			borderBottomColor: theme.colors.primary,
			borderBottomWidth: 1,
		},

		icon: {
			alignSelf: 'center',
		},

		skeletonText: {
			color: 'grey',
			backgroundColor: 'grey',
			borderRadius: 10,
		},
		text: {
			color: theme.colors.text,
		},
		commonText: {
			marginBottom: 5,
		},
		title: {
			fontSize: 30,
		},
		italic: {
			fontStyle: 'italic',
		},
	});
	return style;
};
