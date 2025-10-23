import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../config/theme';
import { useAuth } from '../store';
import { useLogout } from '../modules/auth/hooks/useAuth';

const ProfileScreen: React.FC = () => {
  const { user, isLoading } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutMutation.mutateAsync();
              // La navigation sera gérée automatiquement par AppNavigator
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
              Alert.alert('Erreur', 'Impossible de se déconnecter');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.charAt(0) || '👤'}
          </Text>
        </View>
        <Text style={styles.userName}>
          {user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}
        </Text>
        <Text style={styles.userEmail}>
          {user?.email || 'demo@formation.com'}
        </Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>📝 Modifier le profil</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>🔒 Sécurité</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>🌙 Thème</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>🌍 Langue</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>❓ Aide</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.signOutButton, logoutMutation.isPending && styles.buttonDisabled]}
          onPress={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <Text style={styles.signOutText}>
            {logoutMutation.isPending ? '🚪 Déconnexion...' : '🚪 Se déconnecter'}
          </Text>
        </TouchableOpacity>
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
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  avatarText: {
    fontSize: 32,
  },
  userName: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.white,
    opacity: 0.9,
  },
  content: {
    padding: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  menuItemText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text.primary,
  },
  menuItemArrow: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.gray[500],
  },
  signOutButton: {
    backgroundColor: theme.colors.danger,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  signOutText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
  loadingText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text.secondary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default ProfileScreen;
