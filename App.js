import React from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { CarProvider } from './src/context/CarContext'; // import CarProvider
import AppNavigator from './src/navigation/AppNavigator';
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CarProvider>   {/* Add CarProvider here */}
          <AppNavigator />
        </CarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}