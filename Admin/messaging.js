require('dotenv').config()
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getMessaging } = require('firebase-admin/messaging');

const app = initializeApp({
	credential: applicationDefault()
});

const messaging = getMessaging(app);

// Yes, these values are hardcoded to serve my very specific test case
messaging.send({
	notification: {
		title: "Testing a push notification from script",
		body: "This was called from the Firebase Admin SDK",
	},
	topic: "room-L1PHJnC6mS7Sl1av2w6R",
	data: {
		"room": JSON.stringify({
			key: 'L1PHJnC6mS7Sl1av2w6R',
			name: 'Test',
		}),
	},
});
