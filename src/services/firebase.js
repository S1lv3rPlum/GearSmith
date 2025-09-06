import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDc9E-DaEBzabNCqFuMyQ9aRcxmCMDHHgE",
  authDomain: "gearsmith-e3302.firebaseapp.com",
  projectId: gearsmith-e3302,
  storageBucket: gearsmith-e3302.firebasestorage.app,
  messagingSenderId: "950900631942",
  appId: "1:950900631942:android:d62b1cd381"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
