import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDc9E-DaEBzabNCqFuMyQ9aRcxmCMDHHgE",
  authDomain: "gearsmith-e3302.firebaseapp.com",
  projectId: "gearsmith-e3302",
  storageBucket: "gearsmith-e3302.appspot.com",
  messagingSenderId: "950900631942",
  appId: "1:950900631942:android:d62b1cd381" // Verify this is complete/correct from Firebase Console
};
// Initialize Firebase app only if none exists to prevent multiple app instances error
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// Export Firebase Authentication and Firestore instances for app usage
export const auth = getAuth(app);
export const db = getFirestore(app);
// Optional export if you need the raw Firebase app
export { app };