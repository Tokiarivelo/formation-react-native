/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Button, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import LoginScreen from './src/modules/auth/screens/LoginScreen';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { refreshAccessToken } from './src/modules/auth/api';

// Create a client
const queryClient = new QueryClient();


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <LoginScreen />
      </QueryClientProvider>
      <Button onPress={async () => await refreshAccessToken()} title="refresh access token" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
