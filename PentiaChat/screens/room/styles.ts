import { StyleSheet } from 'react-native';

export const getChatStyles = (theme: ReactNavigation.Theme) => {
	const style = StyleSheet.create({
		container: {
			flexDirection: 'row',
			marginTop: 3,
			marginBottom: 3,
			flex: 0,
		},

		messageHeader: {
			flexDirection: 'column',
			padding: 10,
			flex: 1,
		},

		messageInfo: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			flex: 1,
		},

		username: {
			fontSize: 18,
			flex: 1,
		},

		avatar: {
			borderRadius: 50,
			width: 50,
			height: 50,
			flex: 0,
			alignSelf: 'flex-start',
		},

		text: {
			color: theme.colors.text,
			margin: 5,
			flex: 0,
		},

		bodyText: {
			backgroundColor: theme.colors.card,
			borderRadius: 10,
			alignSelf: 'flex-start',
			flex: 1,
			padding: 10,
		},

		timestamp: {
			alignSelf: 'flex-end',
			fontSize: 12,
		},
	});

	return style;
};

export const getRoomStyles = (theme: ReactNavigation.Theme) => {
	const style = StyleSheet.create({
		messageSendContainer: {
			flexDirection: 'row',
			backgroundColor: theme.colors.card,
			justifyContent: 'space-between',
			alignItems: 'center',
		},

		textInput: {
			flex: 1,
			color: theme.colors.text,
		},

		iconButton: {
			width: 30,
			height: 30,
			backgroundColor: theme.colors.primary,
			borderRadius: 50,
			justifyContent: 'center',
			alignContent: 'center',
			alignItems: 'center',
		},

		disabledIconButton: {
			backgroundColor: 'grey',
		},

		icon: {
			flex: 0,
			color: theme.colors.text,
		},

		fullscreenModal: {
			width: '100%',
			height: '100%',
			alignItems: 'center',
			justifyContent: 'center',
		},
	});

	return style;
};

