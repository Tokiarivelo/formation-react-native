/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { ActivityIndicator, Platform, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { NetInfoProvider } from './src/context/NetInfoProvider';
import { mySync } from './src/services/syncService';
import { useAuthStore } from './src/store/authStore';
import { useNetInfo } from '@react-native-community/netinfo';

const linking = {
  prefixes: [
    'example://',
    'https://example.com'
  ],
  config: {
    screens: {
      App: {
        screens: {
          Profile: 'profile',
        }
      }
    }
  },
};

const queryClient = new QueryClient();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const { isConnected } = useNetInfo();
  useEffect(() => {
    const check = async () => {
      await checkAuthStatus();
    }
    if (isConnected) {
      check();
      if (isLoggedIn) {
        const delay = Platform.OS === 'android' ? 500 : 200;
        setTimeout(() => {
          mySync();
        }, delay);
      }
    }
  }, [checkAuthStatus, isConnected, isLoggedIn]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NetInfoProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <NavigationContainer linking={linking as any}>
            <RootNavigator isLoggedIn={isLoggedIn} />
          </NavigationContainer>
        </NetInfoProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});


export default App;
