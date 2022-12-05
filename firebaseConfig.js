// Import the functions you need from the SDKs you need
import { initializeFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkf6uMaT3Gz2quF7zhxwp6sKGJ-8qNMpY",
  authDomain: "todoappdb-2ac85.firebaseapp.com",
  projectId: "todoappdb-2ac85",
  storageBucket: "todoappdb-2ac85.appspot.com",
  messagingSenderId: "1075219798045",
  appId: "1:1075219798045:web:2e27c98dc0d6426c54cef4",
  measurementId: "G-FHFVCSGLC6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export {db}