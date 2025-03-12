import { getMessaging } from '@react-native-firebase/messaging';
import { useState, useEffect } from 'react';
import { useAnimatedValue, Linking, Animated, Easing, Pressable, View, Text, useColorScheme } from 'react-native';
import { NotificationData } from '../models/NotificationData.model';
import { RoomLink } from '../models/Room.model';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { getNotificationStyle } from './style';

const Notification = () => {
	const [notification, setNotification] = useState<NotificationData>({title: '', body: ''});
	const [notificationRoom, setNotificationRoom] = useState<RoomLink>({key: '', name: ''});
	const notificationTimer = useAnimatedValue(0);
	const [notificationVisible, setNotificationVisible] = useState(false);

	const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
	const style = getNotificationStyle(theme);
	let animation: Animated.CompositeAnimation =
		Animated.timing(notificationTimer, {
			toValue: 100,
			duration: 5000,
			easing: Easing.linear,
			useNativeDriver: false,
		});

	const linkToRoom = () => {
		animation.stop();
		console.log(`Opening pentiachat://room/${notificationRoom.key}/${notificationRoom.name}`);
		Linking.openURL(`pentiachat://room/${notificationRoom.key}/${notificationRoom.name}`);
	};

	const animateTimer = () => {
		animation.start(() => {
			setNotificationVisible(false);
			notificationTimer.setValue(0);
		});
	};

	useEffect(() => {
		const subscriber = getMessaging().onMessage(async message => {
			if (message.notification === undefined) {
				return;
			}
			if (message.data === undefined) {
				return;
			}
			if (!('room' in message.data)) {
				return;
			}
			if (typeof (message.data.room) !== 'string') {
				return;
			}

			const roomInfo: RoomLink = JSON.parse(message.data.room);
			setNotificationRoom(roomInfo);
			setNotification({title: message.notification.title || '', body: message.notification.body || ''});
			setNotificationVisible(true);
			animateTimer();
		});

		return subscriber;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Pressable onPress={linkToRoom} style={[style.container, notificationVisible ? style.visible : style.hidden]}>
			<View>
				<Text style={style.title}>{notification.title}</Text>
				<Text style={style.text}>{notification.body}</Text>
				<Animated.View style={[style.timerBar, {width: notificationTimer.interpolate(
						{
							inputRange: [0, 100],
							outputRange: ['100%', '0%'],
						}),
					}]}
				/>
			</View>
		</Pressable>
	);
};

export default Notification;
