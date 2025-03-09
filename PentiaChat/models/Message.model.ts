import { Timestamp } from '@react-native-firebase/firestore';

export type Message = MessageDTO & {
	key: string;
};

export type MessageDTO = {
	authorID: string;
	content: string;
	createdAt: Timestamp|null; // It is null in the case that the serverTimestamp() has not completed yet
	imageURL: string|null|undefined;
};
