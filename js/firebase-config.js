// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDGE68fmPbl5XlM8PaJZvyxBj3UkbhqMIg",
    authDomain: "practiceflowv1.firebaseapp.com",
    projectId: "practiceflowv1",
    storageBucket: "practiceflowv1.firebasestorage.app",
    messagingSenderId: "628577125458",
    appId: "1:628577125458:web:7f0503ef318886f5508b8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Authentication
const auth = getAuth(app);

// Export for use in other JavaScript files
export { db, storage, auth };