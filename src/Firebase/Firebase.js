import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD-FFX4qeci7tbyiTeF-qt_nkZLZ0VVUTU",
  authDomain: "hotel-management-d3272.firebaseapp.com",
  projectId: "hotel-management-d3272",
  storageBucket: "hotel-management-d3272.firebasestorage.app",
  messagingSenderId: "901503878634",
  appId: "1:901503878634:web:94f0c87809d1f0c6b01e93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
export const auth=getAuth(app)