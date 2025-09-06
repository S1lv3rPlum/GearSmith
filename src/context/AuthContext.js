import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase'; // make sure path is correct
// Inside your auth context or functions:
// Sign up new user
auth.createUserWithEmailAndPassword(email, password)
  .then(userCredential => { // success: userCredential.user
  })
  .catch(error => { // handle error
  }); // Sign in existing user
auth.signInWithEmailAndPassword(email, password)
  .then(userCredential => { // signed in
  })
  .catch(error => { // handle error
  }); // Sign out
auth.signOut()
  .then(() => { // signed out
  });m// Listen to auth state changes
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => { // handle user state change
  });
  return () => unsubscribe();
}, []);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Automatically updates user when Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe; // clean up listener on unmount
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const signup = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
