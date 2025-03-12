require('dotenv').config()
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');

const app = initializeApp({
	credential: applicationDefault()
});

const messaging = getMessaging(app);

messaging.send({
	notification: {
		title: `Room Test has a new message!`,
		body: `This notification is actually just a test notification`,
	},
	topic: `room-L1PHJnC6mS7Sl1av2w6R`,
	data: {
		"room": JSON.stringify({
			key: "L1PHJnC6mS7Sl1av2w6R",
			name: "Test",
		}),
	},
});