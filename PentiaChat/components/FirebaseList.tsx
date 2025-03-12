import { ReactNativeFirebase } from '@react-native-firebase/app';
import { FirebaseFirestoreTypes, getDocs, onSnapshot } from '@react-native-firebase/firestore';
import { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { getFirebaseListStyle } from './style';
import { useTheme } from '@react-navigation/native';

export type FirebaseListProps<T extends object> = {
	query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>;
	renderItem: ListRenderItem<T> | null | undefined;
	skeletonData: T[];
	setSkeleton: React.Dispatch<React.SetStateAction<boolean>>;
	inverted: boolean;
	includeMetadata: boolean;
};

const isNativeFirebaseError = (error: any): error is ReactNativeFirebase.NativeFirebaseError => {
	return error instanceof Error && ('namespace') in error;
};

// Generic component to display our Firestore data
const FirebaseList = <T extends object, >(props: FirebaseListProps<T>) => {
	const theme = useTheme();
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<T[]>(props.skeletonData);

	const [lastFetchedMessage, setLastFetchedMessage] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>();

	const style = getFirebaseListStyle(theme);

	// Listen for real time data updates
	useEffect(() => {
		const subscriber = onSnapshot(props.query, (querySnapshot) => {
			const dataData: T[] = [];

			if (querySnapshot === null) {
				console.log('[FirebaseList#realTimeDataEffect]: Data was null', querySnapshot);
				return () => subscriber();
			}
			querySnapshot.forEach(documentSnapshot => {
				dataData.push({
				...documentSnapshot.data(),
				key: documentSnapshot.id,
				} as any); // We know they are the correct data, but Typescript cannot infer that from the callback
			});

			// This is to enable 'pagination'. When we scroll to the end, we fetch the next 'page' from Firebase
			setLastFetchedMessage(querySnapshot.docs[querySnapshot.docs.length - 1]);

			if (props.inverted) {
				dataData.reverse();
			}
			setData(dataData);
			setLoading(false);
			props.setSkeleton(false);
		}, handleError);

		// Unsubscribe from events when no longer in use
		return () => subscriber();
	}, [props]);

	const handleError = (error: Error) => {
		if (isNativeFirebaseError(error)) {
			switch (error.code) {
				case 'firestore/permission-denied':
					Alert.alert('Permission Error', 'Permission Denied trying to access this data');
					break;
				// Ideally we'd define more specific error cases and send those to the user
				// Full list of codes is here https://firebase.google.com/docs/reference/js/firestore_.md#firestoreerrorcode
				default:
					Alert.alert('Firebase error', error.code);
					break;
			}
		} else {
			Alert.alert('Connection Error', 'Something went wrong trying to fetch data');
		}

		console.error(error);
	};

	const onRefresh = async () => {
		setLoading(true);
		props.setSkeleton(true);
		const timeout = setTimeout(() => {
			setData([]);
			setLoading(false);
			Alert.alert('Connection Error', 'Timed out trying to fetch data from the server');
			return;
		}, 5000);

		const dataData: T[] = [];

		try {
			const querySnapshot = await getDocs(props.query);
			clearTimeout(timeout); // If we did manage to fetch data, don't timeout

			querySnapshot.forEach(documentSnapshot => {
				dataData.push({
				...documentSnapshot.data(),
				key: documentSnapshot.id,
				} as any); // We know they are the correct data, but Typescript cannot infer that from the callback
			});

			// This is to enable 'pagination'. When we scroll to the end, we fetch the next 'page' from Firebase
			setLastFetchedMessage(querySnapshot.docs[querySnapshot.docs.length - 1]);
		} catch(error) {
			handleError(error as Error);
			clearTimeout(timeout);
		}

		if (props.inverted) {
			dataData.reverse();
		}
		setData(dataData);
		setLoading(false);
		props.setSkeleton(false);
	};

	// Function that gets called when we scroll close to the end of our current list
	const fetchMore = async () => {
		if (lastFetchedMessage === undefined) {
			return;
		}

		const fetchMoreQuery = props.query.startAfter(lastFetchedMessage);
		const dataData: T[] = [];

		try {
			const querySnapshot = await getDocs(fetchMoreQuery);

			querySnapshot.forEach(documentSnapshot => {
				dataData.push({
				...documentSnapshot.data(),
				key: documentSnapshot.id,
				} as any); // We know they are the correct data, but Typescript cannot infer that from the callback
			});
			setLastFetchedMessage(querySnapshot.docs[querySnapshot.docs.length - 1]);

			if (props.inverted) {
				dataData.reverse();
				setData([...dataData, ...data]);
			} else {
				setData([...data, ...dataData]);
			}
		} catch(error) {
			handleError(error as Error);
		}
	};

	return (
		<>
			{loading ? <ActivityIndicator size="large" style={style.floating}/> : <></>}
			<FlatList style={[style.container, loading ? style.containerMask : {}]}
				data={data}
				inverted={props.inverted}
				onEndReached={fetchMore}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={onRefresh}
					/>
				}
				renderItem={props.renderItem}
			/>
		</>
	);
};

export default FirebaseList;
