import { StyleSheet } from 'react-native';

export const getFirebaseListStyle = (_theme: ReactNavigation.Theme) => {
	const style = StyleSheet.create({
		container: {
			flex: 1,
			flexGrow: 1,
		},
		containerMask: {
			opacity: 0.5,
		},
		floating: {
			position: 'absolute',
			left: 0,
			right: 0,
			//backgroundColor: theme.colors.background.replace('rgb', 'rgba').replace(')', ', 0.7)'),
			zIndex: 10,
		},
	});
	return style;
};

export const getNotificationStyle = (theme: ReactNavigation.Theme) => {
	const style = StyleSheet.create({
		container: {
			backgroundColor: theme.colors.card,
			position: 'absolute',
			top: 0,
			zIndex: 10,
			padding: 3,
			alignSelf: 'center',
			borderColor: theme.colors.border,
			shadowColor: theme.colors.background,
			shadowRadius: 10,
			shadowOpacity: 0.5,
		},
		visible: {
			display: 'flex',
		},
		hidden: {
			display: 'none',
		},
		text: {
			color: theme.colors.text,
		},
		title: {
			color: theme.colors.text,
			fontSize: 24,
		},
		timerBar: {
			color: theme.colors.primary,
			backgroundColor: theme.colors.primary,
			width: '100%',
			height: 5,
		},
	});

	return style;
};
