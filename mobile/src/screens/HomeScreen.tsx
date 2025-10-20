import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../config/theme';

const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Formation React Native</Text>
        <Text style={styles.subtitle}>Navigation Stack + Tabs fonctionnelle</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏗️ Architecture</Text>
          <Text style={styles.cardDescription}>
            Structure modulaire avec React Navigation v7, TypeScript strict, et architecture domain-driven.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚡ Stack & Tabs</Text>
          <Text style={styles.cardDescription}>
            Navigation Stack pour l'authentification et Bottom Tabs pour l'application principale.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Prochaines étapes</Text>
          <Text style={styles.cardDescription}>
            Authentification JWT, WatermelonDB, React Query, et synchronisation offline.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.white,
    opacity: 0.9,
  },
  content: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  cardTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  cardDescription: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
});

export default HomeScreen;
