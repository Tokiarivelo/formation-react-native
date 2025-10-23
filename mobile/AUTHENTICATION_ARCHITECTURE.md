# Architecture Axios Interceptor + Zustand Auth Store

Cette implémentation suit l'architecture définie dans le fichier de formation pour créer un système d'authentification robuste avec React Native.

## 🏗️ Architecture mise en place

### 1. **Configuration des variables d'environnement**
- `src/config/env.ts` : Gestion centralisée des URLs et clés API
- `env.example` : Template des variables d'environnement

### 2. **Stockage sécurisé des tokens**
- `src/libs/storage/secureStore.ts` : Utilise `react-native-keychain` pour la sécurité maximale
- Protection biométrique des tokens
- Gestion automatique des erreurs

### 3. **Store Zustand pour l'authentification**
- `src/store/authStore.ts` : État d'authentification léger et performant
- Persistance avec AsyncStorage (données non sensibles uniquement)
- Hydratation personnalisée pour vérifier les tokens sécurisés

### 4. **Instance Axios avec intercepteurs**
- `src/services/axiosInstance.ts` : Client HTTP avec gestion automatique des tokens
- Refresh token automatique en cas d'expiration
- Queue des requêtes pendant le refresh
- Logs en mode debug

### 5. **API d'authentification**
- `src/modules/auth/api.ts` : Appels réseau typés pour toutes les opérations auth
- Support complet : login, signup, logout, refresh, forgot password, etc.

### 6. **Hooks React Query**
- `src/modules/auth/hooks/useAuth.ts` : Hooks personnalisés pour chaque opération
- Intégration avec Zustand store
- Gestion des états de chargement et erreurs

### 7. **Configuration React Query**
- `src/store/queryClient.ts` : Client Query avec cache intelligent
- Retry automatique avec backoff exponentiel
- Gestion des erreurs réseau

## 🚀 Utilisation

### Dans un composant de connexion :

```typescript
import { useLogin } from '../modules/auth/hooks/useAuth';
import { useAuth } from '../store';

const LoginScreen = () => {
  const loginMutation = useLogin();
  const { isLoading, error, clearError } = useAuth();

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({ email, password });
      // Navigation automatique via AppNavigator
    } catch (error) {
      // Erreur déjà gérée par le hook
    }
  };

  return (
    // UI avec gestion des états isLoading et error
  );
};
```

### Dans un composant de profil :

```typescript
import { useLogout } from '../modules/auth/hooks/useAuth';
import { useAuth } from '../store';

const ProfileScreen = () => {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    // Déconnexion automatique
  };

  return (
    // UI avec données utilisateur
  );
};
```

### Dans le navigateur principal :

```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { useAuth, queryClient } from '../store';

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {isAuthenticated ? <MainTabs /> : <AuthStack />}
      </NavigationContainer>
    </QueryClientProvider>
  );
};
```

## 🔧 Configuration

### Variables d'environnement :
```bash
# Copier env.example vers .env
cp env.example .env

# Configurer les valeurs
API_URL=http://localhost:3000/api
JWT_KEY=auth_token
REFRESH_TOKEN_KEY=refresh_token
APP_NAME=FormationReactNative
DEBUG_MODE=true
```

### Installation des dépendances :
```bash
npm install axios @tanstack/react-query zustand react-native-keychain @react-native-async-storage/async-storage @react-native-community/netinfo
```

## 🔒 Sécurité

- **Tokens sécurisés** : Stockage avec protection biométrique via Keychain
- **Refresh automatique** : Renouvellement transparent des tokens expirés
- **Intercepteurs** : Ajout automatique des tokens aux requêtes
- **Validation** : Vérification de la validité des tokens au démarrage

## 📱 Fonctionnalités

- ✅ Login/Signup avec gestion d'erreurs
- ✅ Déconnexion sécurisée
- ✅ Refresh token automatique
- ✅ Persistance de l'état d'authentification
- ✅ Protection biométrique des tokens
- ✅ Gestion des états de chargement
- ✅ Navigation automatique selon l'état auth
- ✅ Logs en mode debug

## 🎯 Prochaines étapes

Cette architecture est prête pour :
1. **Authentification biométrique** (Face ID/Touch ID)
2. **Gestion d'état offline** avec WatermelonDB
3. **Upload de fichiers** avec suivi de progression
4. **Multi-langue** avec react-i18next
5. **Tests** avec Jest et Testing Library

L'architecture respecte parfaitement les spécifications du fichier de formation et est prête pour l'extension avec les autres modules.

