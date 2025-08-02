const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin with your service account
admin.initializeApp({
  credential: admin.credential.cert(
    path.resolve(__dirname, "serviceAccountKey.json")
  ),
});

const db = admin.firestore();

async function backfillPhotoURLs() {
  let nextPageToken;
  do {
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    for (const userRecord of listUsersResult.users) {
      const { uid, photoURL } = userRecord;
      if (photoURL) {
        await db.collection("users").doc(uid).set({ photoURL }, { merge: true });
        console.log(`Updated ${uid} with photoURL`);
      }
    }
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);
  console.log("Done!");
}

backfillPhotoURLs().catch(console.error); 