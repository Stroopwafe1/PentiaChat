import { Timestamp } from '@react-native-firebase/firestore';

export type Room = RoomDTO & {
	key: string;
};

export type RoomDTO = {
	name: string;
	description: string;
	lastUpdated: Timestamp;
};
