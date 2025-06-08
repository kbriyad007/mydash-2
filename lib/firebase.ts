// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // ✅ import auth

const firebaseConfig = {
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBj6QysY8iakOIolvgxdVIQFISrkWKLSls",
  authDomain: "user-data-ff2ef.firebaseapp.com",
  projectId: "user-data-ff2ef",
  storageBucket: "user-data-ff2ef.firebasestorage.app",
  messagingSenderId: "256585563027",
  appId: "1:256585563027:web:002cbebe818faf9ebec666",
  measurementId: "G-V3BQPCTJGG"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app); // ✅ initialize auth

// ✅ export both
export { db, auth };
