import { collection, getFirestore, orderBy, query, Timestamp } from '@react-native-firebase/firestore';
import { Room } from '../../models/Room.model';
import RoomListEntry from './RoomListEntry';
import FirebaseList from '../../components/FirebaseList';
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
		<>
		<FirebaseList<Room>
			setSkeleton={setSkeleton}
			query={q}
			inverted={false}
			includeMetadata={true}
			renderItem={({ item }) => (
				<RoomListEntry skeleton={isSkeleton} id={item.key} key={item.key} name={item.name} description={item.description} lastUpdated={item.lastUpdated}/>
			)}
			skeletonData={shadowRooms}
			/>
		</>
	);
};

export default RoomsListScreen;
