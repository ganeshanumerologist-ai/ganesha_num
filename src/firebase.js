// Firebase configuration.
// Fill these values in a .env file (see .env.example) OR replace directly here.
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000",
};

const app = initializeApp(firebaseConfig);

export const isFirebaseConfigured =
  !String(firebaseConfig.apiKey || "").includes("YOUR_API_KEY") &&
  !String(firebaseConfig.projectId || "").includes("YOUR_PROJECT_ID");

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ════════════════════════════════════════════════════════════════════
//  SESSION YAAD RAKHO
//
//  User ne kaha: "sign up karne ke baad jab sign in karta hoon to
//  phir se sign up karne ko bolta hai. Ek baar register karne ke baad
//  baar baar register karne ko nahi bolna chahiye."
//
//  Firebase ka default persistence `local` hota hai — par wo TABHI
//  chalta hai jab storage allow ho. Kuch browsers me (private mode,
//  storage-blocked, ya purana SW jisne storage clear kar diya) wo
//  `session` par gir jaata hai — matlab page reload karte hi user
//  logout. Isliye ye EXPLICIT kar rahe hain.
//
//  `local` = user logout NAHI kare to app band karne par bhi login
//  rehta hai. Ye wahi hai jo user maang raha hai.
// ════════════════════════════════════════════════════════════════════
setPersistence(auth, browserLocalPersistence).catch(() => {
  // storage block hai to session par girne do — is session me to
  // chalega hi
  setPersistence(auth, browserSessionPersistence).catch(() => { /* ignore */ });
});

export default app;
