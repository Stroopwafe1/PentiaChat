import React, { useContext, useEffect, useState } from 'react';
import { Message } from '../../models/Message.model';
import { getFirestore, query, collection, orderBy, limit, Timestamp, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import FirebaseList from '../../components/FirebaseList';
import ChatMessage from './ChatMessage';
import { FirebaseContext } from '../../components/providers/FirebaseContextProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screens } from '../NavigatorScreens';
import { GestureResponderEvent, Image, Modal, Pressable, TextInput, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getRoomStyles } from './styles';
import { useTheme } from '@react-navigation/native';
import { launchImageLibrary, ImagePickerResponse, launchCamera } from 'react-native-image-picker';

type Props = NativeStackScreenProps<Screens, 'Room'>;

const RoomScreen = ({navigation, route}: Props) => {
	const [isSkeleton, setSkeleton] = useState(true);
	const firebaseContext = useContext(FirebaseContext);
	const [messageText, setMessageText] = useState('');
	const [isSending, setIsSending] = useState(false);

	const [isModalShowing, setModalShowing] = useState(false);
	const [imageURI, setImageURI] = useState('');

	const style = getRoomStyles(useTheme());

	useEffect(() => {
		navigation.setOptions({headerTitle: route.params.name});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const shadowMessages: Message[] = [];
	for (let i = 0; i < 6; i++) {
		shadowMessages.push({
			key: i.toString(),
			authorID: '',
			content: '',
			createdAt: Timestamp.fromDate(new Date()),
			imageURL: undefined,
		});
	}

	const firestore = getFirestore();
	const q = query(collection(firestore, 'Rooms', route.params.id, 'Messages'), orderBy('createdAt', 'desc'), limit(50));

	const sendMessage = async (_e: GestureResponderEvent) => {
		// Don't allow the user to send an empty message
		if (messageText.length === 0) {
			return;
		}
		setIsSending(true);

		// This does not need to be awaited because it's not necessary to have the message show up.
		// It's just for setting up notifications after the message is sent
		firebaseContext.subscribeToTopic(`room-${route.params.id}`);

		await addDoc(collection(firestore, 'Rooms', route.params.id, 'Messages'), {
			authorID: firebaseContext.user!.uid,
			content: messageText,
			createdAt: serverTimestamp(),
		});

		setMessageText('');
		setIsSending(false);
	};

	const handleMediaCallback = (mediaResponse: ImagePickerResponse) => {
		if (mediaResponse.didCancel) {
			return;
		}

		if (!mediaResponse.assets || mediaResponse.assets.length === 0) {
			return;
		}

		mediaResponse.assets.forEach(async asset => {
			await addDoc(collection(firestore, 'Rooms', route.params.id, 'Messages'), {
				authorID: firebaseContext.user!.uid,
				content: asset.fileName,
				createdAt: serverTimestamp(),
				imageURL: `data:${asset.type};base64, ${asset.base64!}`,
			});
		});
	};

	const openImage = (uri: string) => {
		setImageURI(uri);
		setModalShowing(true);
	};

	return (
		<>
			<Modal
				visible={isModalShowing}
				onRequestClose={() => setModalShowing(false)}
				backdropColor="rgba(0, 0, 0, 0.3)"
				animationType="fade"
			>
				<Pressable style={style.fullscreenModal} onPress={(e: GestureResponderEvent) => {setModalShowing(false); e.stopPropagation(); e.preventDefault();}}>
					<Image source={{uri: imageURI}} width={300} height={600} />
				</Pressable>
			</Modal>
			<FirebaseList<Message>
				setSkeleton={setSkeleton}
				inverted={true}
				includeMetadata={false}
				query={q}
				renderItem={({ item }) => (
					<ChatMessage
						skeleton={isSkeleton}
						id={item.key}
						key={item.key}
						authorName={firebaseContext.userCache.get(item.authorID)?.name || 'Unknown'}
						authorImageURL={firebaseContext.userCache.get(item.authorID)?.avatarURL || ''}
						content={item.content}
						createdAt={item.createdAt}
						imageURL={item.imageURL}
						showImageFn={openImage}
					/>
				)}
				skeletonData={shadowMessages}
				/>
			<View style={style.messageSendContainer}>
				<TouchableHighlight
					style={style.iconButton}
					onPress={_e => launchImageLibrary({
							mediaType: 'photo',
							includeBase64: true,
							maxWidth: 300,
							maxHeight: 600,
						}, handleMediaCallback)
					}>
					<Icon style={style.icon} name="upload" size={15} />
				</TouchableHighlight>
				<TouchableHighlight
					style={style.iconButton}
					onPress={_e => launchCamera({
						mediaType: 'photo',
						includeBase64: true,
						maxWidth: 300,
						maxHeight: 600,
					}, handleMediaCallback)
				}>
						<Icon style={style.icon} name="camera" size={15} />
				</TouchableHighlight>
				<TextInput
					returnKeyType="next"
					clearButtonMode="always"
					style={style.textInput}
					onChangeText={setMessageText}
					placeholder="Message..."
					multiline={true}
					value={messageText}
				/>
				<TouchableHighlight style={[style.iconButton, isSending || messageText.length === 0 ? style.disabledIconButton : {}]} onPress={sendMessage} disabled={isSending || messageText.length === 0}>
					<Icon style={style.icon} name="send" size={15} />
				</TouchableHighlight>
			</View>
		</>
	);
};

export default RoomScreen;
