// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Your Firebase config (reuse from firestoreService.js or import it)
const firebaseConfig = {
  apiKey: "AIzaSyCMWgiDQWkT6SqrYnthrM96GXAl3zrl0uo",
  authDomain: "saasbay.firebaseapp.com",
  projectId: "saasbay",
  storageBucket: "saasbay.firebasestorage.app",
  messagingSenderId: "43607687238",
  appId: "1:43607687238:web:2fc8f7feb9e2d8896e8a47",
  measurementId: "G-1W3KLFSWTY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Admin User',
          role: 'admin'
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Login with Firebase Auth
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout with Firebase Auth
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
