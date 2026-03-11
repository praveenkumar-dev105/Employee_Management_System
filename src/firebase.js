import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBHngwe8JfsFpRvPnIdg-lnnMAae8TI6v8",
    authDomain: "employee-management-syst-6fe4a.firebaseapp.com",
    projectId: "employee-management-syst-6fe4a",
    storageBucket: "employee-management-syst-6fe4a.firebasestorage.app",
    messagingSenderId: "416142959933",
    appId: "1:416142959933:web:604c82764bb4b1e9ca9154",
    measurementId: "G-W9C8ZPGVVX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
