// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  
// import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAC_6CZcn61_i0DZ4fFKWMkOPRqItvNswQ",
  authDomain: "sustainify-67c1e.firebaseapp.com",
  databaseURL: "https://sustainify-67c1e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sustainify-67c1e",
  storageBucket: "sustainify-67c1e.appspot.com",
  messagingSenderId: "673118394696",
  appId: "1:673118394696:web:4ce9922d360167fe8a7b7d",
  measurementId: "G-FFMBQER2WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const rldb = getDatabase(app);
const frdb = getFirestore(app);
const strg = getStorage(app);
// const messaging = getMessaging(app);

export {rldb, frdb, strg};