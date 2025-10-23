/**
 * Formation React Native App
 * Navigation Stack + Tabs fonctionnelle
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
// import { validateEnv } from './src/config/env';

// // Valider les variables d'environnement
// validateEnv();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={isDarkMode ? '#000' : '#fff'}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
