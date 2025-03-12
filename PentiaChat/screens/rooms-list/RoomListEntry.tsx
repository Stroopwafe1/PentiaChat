import { useNavigation, useTheme } from '@react-navigation/native';
import { useEffect } from 'react';
import { Animated, Text, TouchableHighlight, useAnimatedValue, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Screens } from '../../screens/NavigatorScreens';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Timestamp } from '@react-native-firebase/firestore';
import { getRoomListEntryStyle } from './style';

export type RoomListEntryProps = {
	name: string;
	description: string;
	id: string;
	skeleton: boolean;
	lastUpdated: Timestamp|null;  // It is null in the case that the serverTimestamp() has not completed yet
}

const RoomListEntry = (props: RoomListEntryProps) => {
	const theme = useTheme();
	const fadeAnim = useAnimatedValue(1, {useNativeDriver: true});
	const navigation = useNavigation<NativeStackNavigationProp<Screens>>();

	const style = getRoomListEntryStyle(theme, fadeAnim);

	const runAnimation = () => {
		if (!props.skeleton) {
			return;
		}
		Animated.timing(fadeAnim, {
			toValue: 0.2,
			duration: 1400,
			useNativeDriver: true,
		}).start(() => {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1400,
				useNativeDriver: true,
			}).start(() => runAnimation());
		});
	};

	useEffect(() => {
		runAnimation();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const enterRoom = () => {
		navigation.navigate('Room', { id: props.id, name: props.name });
	};

	return (
		<TouchableHighlight onPress={enterRoom}>
			<Animated.View style={style.container}>
				<View>
					<Text style={[style.commonText, style.title, props.skeleton ? style.skeletonText : style.text]}>
						{props.skeleton ? '' : props.name}
					</Text>
					<Text style={[style.commonText, props.skeleton ? style.skeletonText : style.text]}>
						{props.skeleton ? '' : props.description}
					</Text>
					<Text style={[style.commonText, style.italic, props.skeleton ? style.skeletonText : style.text]}>
						{props.skeleton ? '' : `Last update: ${props.lastUpdated?.toDate().toLocaleString(undefined, {dateStyle: 'short', timeStyle: 'short'})}`}
					</Text>
				</View>
				<Icon color={theme.colors.text} style={style.icon} name="chevron-right" />
			</Animated.View>
		</TouchableHighlight>
	);
};

export default RoomListEntry;
