// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBolRAgthBi8P57mJEFOi0NqYJDc-CMbxM",
  authDomain: "food-df4c0.firebaseapp.com",
  projectId: "food-df4c0",
  storageBucket: "food-df4c0.appspot.com",
  messagingSenderId: "562506082318",
  appId: "1:562506082318:web:842a5a9506b609c421345f",
  measurementId: "G-B3MSGK6BCN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };