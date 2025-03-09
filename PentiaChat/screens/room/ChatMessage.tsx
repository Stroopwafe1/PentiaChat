import { Timestamp } from '@react-native-firebase/firestore';
import { useTheme } from '@react-navigation/native';
import { Image, Pressable, Text, View } from 'react-native';
import { getChatStyles } from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';

export type ChatMessageProps = {
	id: string;
	authorImageURL: string;
	authorName: string;
	content: string;
	createdAt: Timestamp|null;  // It is null in the case that the serverTimestamp() has not completed yet
	imageURL: string|null|undefined;
	skeleton: boolean;
	showImageFn: (imageURI: string) => void;
}

const ChatMessage = (props: ChatMessageProps) => {
	const theme = useTheme();
	const style = getChatStyles(theme);

	return (
		<View style={style.container}>
			{
				props.authorImageURL && props.authorImageURL.length > 0
				?
					<Image style={style.avatar} source={{uri: props.authorImageURL}} alt={props.authorName + '\'s profile picture'} />
				:
					<Icon style={style.avatar} name="user" />
			}
			<View style={style.messageHeader}>
				<View style={style.messageInfo}>
					<Text style={[style.text, style.username]}>{props.authorName}</Text>
					<Text style={[style.text, style.timestamp]}>{props.createdAt?.toDate().toLocaleString(undefined, {dateStyle: 'short', timeStyle: 'short'})}</Text>
				</View>
				<Text style={[style.text, style.bodyText]}>{props.content}</Text>
				{
					props.imageURL && props.imageURL.length !== 0 ?
							<Pressable onPress={() => props.showImageFn(props.imageURL!)}>
								<Image width={150} height={300} source={{uri: props.imageURL}}/>
							</Pressable>
						: <></>
				}
			</View>
		</View>
	);
};

export default ChatMessage;
