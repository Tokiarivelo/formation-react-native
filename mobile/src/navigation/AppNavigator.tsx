import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { theme } from '../config/theme';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { RootStackParamList } from '../types/models';
import { useAuth, queryClient } from '../store';
import { secureTokenStorage } from '../libs/storage/secureStore';
import DatabaseProvider from '../database/DatabaseProvider';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, setLoading } = useAuth();

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        
        // Vérifier si des tokens existent
        const hasTokens = await secureTokenStorage.hasTokens();
        
        if (hasTokens) {
          // Optionnel: vérifier la validité du token avec l'API
          // const isValid = await authApi.verifyToken();
          // if (!isValid) {
          //   await secureTokenStorage.clearTokens();
          // }
        }
      } catch (error) {
        // Log en mode debug uniquement
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.error('Erreur lors de la vérification de l\'authentification:', error);
        }
        // En cas d'erreur, déconnecter l'utilisateur
        await secureTokenStorage.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [setLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DatabaseProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: theme.colors.background.secondary },
            }}
          >
            {isAuthenticated ? (
              <Stack.Screen name="Main" component={MainTabNavigator} />
            ) : (
              <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </DatabaseProvider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    flex: 1,
    justifyContent: 'center',
  },
});

export default AppNavigator;
