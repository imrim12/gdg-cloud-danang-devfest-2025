import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ------------------------------------------------------------------
// Firebase Configuration for GDG Cloud Da Nang Devfest 2025
// Client ID: 489981062500-7874cbsu7j3196c2u1tk17efi1s7ujb0.apps.googleusercontent.com
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyC47EIDZBaZ668JmFODw7j_FOBtFMrTjko",
  authDomain: "gdg-cloud-danang-devfest-2025.firebaseapp.com",
  projectId: "gdg-cloud-danang-devfest-2025",
  storageBucket: "gdg-cloud-danang-devfest-2025.firebasestorage.app",
  messagingSenderId: "489981062500",
  appId: "1:489981062500:web:0f1cec8ecc30d805a8de71"
};

// Initialize Firebase
// Use getApps() to avoid re-initialization in development (Hot Module Replacement)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Forces account selection to allow switching accounts
});
// Scopes for profile and email are included by default