import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to process auth errors
  const handleAuthError = (err: any) => {
    console.error("Authentication error:", err);
    
    let errorMessage = "Failed to sign in with Google.";

    if (err.code === 'auth/popup-closed-by-user') {
      errorMessage = "Sign-in cancelled.";
    } else if (err.code === 'auth/unauthorized-domain') {
      const currentDomain = window.location.hostname;
      errorMessage = `Domain Unauthorized: Go to Firebase Console > Auth > Settings > Authorized Domains and add: "${currentDomain}"`;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
  };

  // Function to handle login using Popup
  const login = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      handleAuthError(err);
    }
  };

  // Function to handle logout
  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
    setError(null);
  };

  const clearError = () => setError(null);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "User logged out", user?.uid);
      
      // Clean up previous snapshot listener if exists
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      setCurrentUser(user);
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        
        try {
          // Check if user profile exists first
          const docSnap = await getDoc(userRef);
          
          if (!docSnap.exists()) {
            // Create new user profile if it doesn't exist
            const newProfile: UserProfile = {
              uid: user.uid,
              displayName: user.displayName || 'Anonymous Coder',
              photoURL: user.photoURL || '',
              votesRemaining: 5,
              votedSubmissionIds: []
            };
            await setDoc(userRef, newProfile);
          }

          // Listen to realtime changes of the user profile
          unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data() as UserProfile);
            }
            setLoading(false);
          }, (err) => {
            console.error("Error fetching user profile:", err);
            setLoading(false);
          });
        } catch (err: any) {
          console.error("Error setting up user profile:", err);
          if (err.message && err.message.includes("offline")) {
            setError("Network Error: Could not connect to database. Please check your internet connection.");
          } else {
            setError("Failed to load user profile.");
          }
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
