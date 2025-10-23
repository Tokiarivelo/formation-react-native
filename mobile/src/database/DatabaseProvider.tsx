/**
 * Configuration et initialisation de WatermelonDB dans l'application
 * Intégration avec React Query et synchronisation
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { database, checkDatabaseHealth } from '../database';
import { syncManager } from '../sync/syncManager';
import { theme } from '../config/theme';

interface DatabaseProviderProps {
  children: React.ReactNode;
}

const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Vérifier la santé de la base de données
        const health = await checkDatabaseHealth();

        if (!health.healthy) {
          throw new Error(
            health.error || 'Erreur de santé de la base de données'
          );
        }

        // Démarrer le gestionnaire de synchronisation
        syncManager.startSync();

        setIsInitialized(true);
      } catch (err) {
        console.error(err);
        console.log({ err });
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    };

    initializeDatabase();

    // Cleanup au démontage
    return () => {
      syncManager.stopSync();
    };
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Erreur de base de données</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>
          Initialisation de la base de données...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.xl,
  },
  errorTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.danger,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default DatabaseProvider;
