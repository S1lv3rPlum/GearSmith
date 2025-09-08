import React, { createContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '../services/firebase';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;  // Let UI handle showing error message
    }
  };
  const signup = async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;  // Let UI handle showing error message
    }
  };
  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };
  return (
    <AuthContext.Provider value={{ user, authError, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
