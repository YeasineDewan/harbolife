import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/features/splash/screens/SplashScreen';
import LoginScreen from './src/features/auth/screens/LoginScreen';
import SignupScreen from './src/features/auth/screens/SignupScreen';
import HomeScreen from './src/features/home/screens/HomeScreen';
import { useAuthStore } from './src/features/auth/store/useAuthStore';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const [currentScreen, setCurrentScreen] = useState('login');

  // Handle automatic routing when authentication state changes in Zustand
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentScreen('home');
    } else {
      setCurrentScreen('login');
    }
  }, [isAuthenticated]);

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </SafeAreaProvider>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onNavigateToSignup={() => setCurrentScreen('signup')}
            onLoginSuccess={() => setCurrentScreen('home')}
          />
        );
      case 'signup':
        return (
          <SignupScreen
            onNavigateToLogin={() => setCurrentScreen('login')}
            onSignupSuccess={() => setCurrentScreen('home')}
          />
        );
      case 'home':
        return <HomeScreen onLogout={() => setCurrentScreen('login')} />;
      default:
        return (
          <LoginScreen
            onNavigateToSignup={() => setCurrentScreen('signup')}
            onLoginSuccess={() => setCurrentScreen('home')}
          />
        );
    }
  };

  return <SafeAreaProvider>{renderScreen()}</SafeAreaProvider>;
}
