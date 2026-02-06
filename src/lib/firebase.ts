import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBonLDyZbxVuRA0nSqw7aQKA0hae8Z34Ug",
    authDomain: "nama-language.firebaseapp.com",
    databaseURL: "https://nama-language-default-rtdb.firebaseio.com",
    projectId: "nama-language",
    storageBucket: "nama-language.firebasestorage.app",
    messagingSenderId: "409379522175",
    appId: "1:409379522175:web:246fd2e7dce3298f22214a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app, "nama-language");
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
