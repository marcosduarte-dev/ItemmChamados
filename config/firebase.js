// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy5jtsUDDw0mmfh2fW9cMDp4e9mA5cDpU",
  authDomain: "itemmchamados.firebaseapp.com",
  databaseURL: "https://itemmchamados-default-rtdb.firebaseio.com",
  projectId: "itemmchamados",
  storageBucket: "itemmchamados.appspot.com",
  messagingSenderId: "290217382500",
  appId: "1:290217382500:web:c718904f3e2a119007c571",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);
