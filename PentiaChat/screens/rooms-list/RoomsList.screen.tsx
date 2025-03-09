import { collection, getFirestore, orderBy, query, Timestamp } from '@react-native-firebase/firestore';
import { Room } from '../../models/Room.model';
import RoomListEntry from './RoomListEntry';
import { useState } from 'react';

const RoomsListScreen = () => {
	const [isSkeleton, setSkeleton] = useState(false);
	const shadowRooms: Room[] = [];
	for (let i = 0; i < 6; i++) {
		shadowRooms.push({
			key: i.toString(),
			name: '',
			description: '',
			lastUpdated: Timestamp.fromDate(new Date()),
		});
	}

	const firestore = getFirestore();
	const q = query(collection(firestore, 'Rooms'), orderBy('lastUpdated'));

	return (
		<View>
			<Text>You are in Rooms overview!</Text>
		</View>
	);
};

export default RoomsListScreen;
