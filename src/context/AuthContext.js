import React, { createContext, useState } from 'react';
// Placeholder auth context: replace with real Firebase Auth integration later
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const login = () => {
    // Add actual login logic here
    setUser({ email: 'user@example.com' });
  };
  const logout = () => {
    // Add actual logout logic here
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};