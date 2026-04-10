import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTKZaMpeKB2MOOS-qdknJ9PEYGx7ZG7-o",
  authDomain: "woosh-web-35806.firebaseapp.com",
  projectId: "woosh-web-35806",
  storageBucket: "woosh-web-35806.firebasestorage.app",
  messagingSenderId: "1002336564800",
  appId: "1:1002336564800:web:a5034bf59e587b223ad1a5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);