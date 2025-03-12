require('dotenv').config()
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

const app = initializeApp({
	credential: applicationDefault()
});

const messaging = getMessaging(app);
const firestore = getFirestore(app);

firestore.collection('Rooms').onSnapshot((snapshot) => {
	snapshot.docChanges().forEach(change => {
		if (change.type === 'added') {
			const room = change.doc.data();
			const roomRef = firestore.collection('Rooms').doc(change.doc.id);
			roomRef.collection('Messages').onSnapshot((messageSnap) => {
				let latestMessage = null;
				messageSnap.docChanges().forEach((msgChange) => {
					if (change.type !== 'added') return;

					const msg = msgChange.doc.data();
					if (msg.createdAt < room.lastUpdated) return;

					if (latestMessage === null) latestMessage = msg;
					else if (latestMessage.createdAt < msg.createdAt) latestMessage = msg;

					messaging.send({
						notification: {
							title: `Room ${room.name} has a new message!`,
							body: `${msg.content}`,
						},
						topic: `room-${change.doc.id}`,
						data: {
							"room": JSON.stringify({
								key: change.doc.id,
								name: room.name,
							}),
						},
					});

				});
				if (latestMessage !== null) {
					roomRef.update({
						lastUpdated: latestMessage.createdAt,
					});
				}
			});
			console.log('New room: ', change.doc.data());
		}
		if (change.type === 'modified') {
			console.log('Modified room: ', change.doc.data());
		}
		if (change.type === 'removed') {
			console.log('Removed room: ', change.doc.data());
		}
	});
});

