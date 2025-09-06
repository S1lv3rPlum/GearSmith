import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDc9E-DaEBzabNCqFuMyQ9aRcxmCMDHHgE",
  authDomain: "gearsmith-e3302.firebaseapp.com",
  projectId: "gearsmith-e3302",
  storageBucket: "gearsmith-e3302.appspot.com",
  messagingSenderId: "950900631942",
  appId: "1:950900631942:android:d62b1cd381"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
export const db = firebase.firestore();
