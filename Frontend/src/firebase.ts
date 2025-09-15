// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDShuK3fBgPF6CGJdBHkZMekJxzrFw4Vjs",
    authDomain: "hackathon-lj.firebaseapp.com",
    projectId: "hackathon-lj",
    storageBucket: "hackathon-lj.firebasestorage.app",
    messagingSenderId: "775105817309",
    appId: "1:775105817309:web:32f7bb6231869ede020934",
    measurementId: "G-LY7G3MWKQH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
    auth,
    googleProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
};
