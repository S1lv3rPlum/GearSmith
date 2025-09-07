import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDc9E-DaEBzabNCqFuMyQ9aRcxmCMDHHgE",
  authDomain: "gearsmith-e3302.firebaseapp.com",
  projectId: "gearsmith-e3302",
  storageBucket: "gearsmith-e3302.firebasestorage.app",  // corrected domain here
  messagingSenderId: "950900631942",
  appId: "1:950900631942:android:d62b1cd3819b03026e2407" // Make sure this matches Firebase Console exactly
};
// Initialize Firebase app only if none exists
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// Export Authentication and Firestore instances for usage across the app
export const auth = getAuth(app);
export const db = getFirestore(app);
// Optional export of raw app instance
export { app };