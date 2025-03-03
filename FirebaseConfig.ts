// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBODvK5kLeK_L8rlbNa4_NGaxomRafteCg",
  authDomain: "artha-ca68e.firebaseapp.com",
  projectId: "artha-ca68e",
  storageBucket: "artha-ca68e.firebasestorage.app",
  messagingSenderId: "784642341165",
  appId: "1:784642341165:web:1b0bf6bced15761b36fba4",
  measurementId: "G-FDN1SQMDLK",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
