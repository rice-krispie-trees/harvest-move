const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

// const createProfile = (userRecord, context) => {
//   const { email, uid } = userRecord;

//   return db
//     .collection("Users")
//     .doc(uid)
//     .set({
//       email,
//       uid,
//       name,
//       plots,
//       seeds: { corn: 3, potato: 3, cabbage: 3, strawberry: 3, wheat: 3 },
//       crops: { corn: 0, potato: 0, cabbage: 0, strawberry: 0, wheat: 0 },
//       hoe: { level: 1 },
//       wateringCan: { level: 1 },
//       kolions: 100
//     })
//     .catch(console.error);
// };

// module.exports = {
//   authOnCreate: functions.auth.user().onCreate(createProfile)
// };

exports.addUserToFirestore = functions.auth.user().onCreate(async user => {
  const userRef = db.collection("users").doc(user.uid);
  return await userRef.set({
    email: user.email,
    id: user.uid,
    seeds: {
      corn: 3,
      potato: 3,
      cabbage: 3,
      strawberry: 3,
      wheat: 3
    },
    crops: {
      corn: 0,
      potato: 0,
      cabbage: 0,
      strawberry: 0,
      wheat: 0
    },
    hoe: { level: 1 },
    wateringCan: { level: 1 },
    kolions: 100
  });
});
