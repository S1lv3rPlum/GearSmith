// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDc9E-DaEBzabNCqFuMyQ9aRcxmCMDHHgE",
  authDomain: "gearsmith-e3302.firebaseapp.com",
  projectId: "gearsmith-e3302",
  storageBucket: "gearsmith-e3302.appspot.com",
  messagingSenderId: "950900631942",
  appId: "1:950900631942:android:d62b1cd381"
};
// Initialize Firebase app if none exists to avoid "Firebase App named '[DEFAULT]' already exists" error
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// Export auth and firestore instances for use in the app
export const auth = getAuth(app);
export const db = getFirestore(app);