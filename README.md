# Front React Native - Performance Stack

## 🚀 Stack Optimisé

### **Performance Gains**

- **Bundle Size**: -60% vs Redux Toolkit (-180KB → -120KB)
- **Memory Usage**: -50% (80MB → 40MB)
- **Query Performance**: 15x plus rapide (800ms → 50ms pour 1000+ items)
- **Startup Time**: 3x plus rapide (3s → 1s)

### **Technologies**

- **State**: Zustand + Immer (3x plus léger que Redux)
- **Cache/API**: React Query v5 (cache intelligent + offline)
- **Database**: WatermelonDB (SQLite avec observables)
- **Sync**: Delta sync intelligent avec conflict resolution

### **Architecture Hybride**

```
UI ←→ React Query ←→ API Server
 ↓         ↓
Zustand  WatermelonDB (Local SQLite)
```

## 🧩 Auth & Navigation

### Issue 1 — Auth/Login & Secure Storage

**Checklist:**

- [ ] Créer LoginScreen (email, password)
- [ ] Implémenter appel /auth/login via React Query
- [ ] Stocker access/refresh tokens via SecureStore
- [ ] Ajouter axios interceptor
- [ ] Afficher erreurs backend
- [ ] Tests unitaires useAuth()

### Issue 2 — Auth/Refresh & Protected Routes

**Checklist:**

- [ ] Implémenter /auth/refresh via React Query
- [ ] Rediriger vers Login si token expiré
- [ ] Gérer refresh automatique (interceptor)
- [ ] Test e2e login+refresh

### Issue 2.5 — Biometric Authentication (Face ID / Touch ID)

**Checklist:**

- [ ] Installer react-native-biometrics
- [ ] Vérifier disponibilité biométrie (Face ID/Touch ID/Fingerprint)
- [ ] Implémenter login biométrique après premier auth
- [ ] Stocker tokens avec protection biométrique
- [ ] Ajouter toggle dans Settings pour activer/désactiver
- [ ] Gérer fallback vers email/password
- [ ] Tests sur simulateur + device physique
- [ ] Support Android (Fingerprint) + iOS (Face ID/Touch ID)

### Issue 3 — Navigation Setup

**Checklist:**

- [ ] Configurer react-navigation (Stack + BottomTabs)
- [ ] Créer routes: AuthStack, AppStack
- [ ] Ajouter Screens: Home, Tasks, Profile, Settings

---

## 🔄 React Query & WatermelonDB Sync

### Issue 4 — Setup React Query & Zustand Store

**Checklist:**

- [ ] Configurer QueryClient + Zustand store
- [ ] Installer WatermelonDB + modèles (User, Project, Task)
- [ ] Intégrer QueryProvider + Zustand dans App
- [ ] Test simple query avec WatermelonDB

### Issue 5 — WatermelonDB Setup & Performance

**Checklist:**

- [ ] Créer schéma database (users, projects, tasks, attachments)
- [ ] Configurer models avec relations
- [ ] Setup database initialization
- [ ] Implémenter observables pour UI reactivity
- [ ] Benchmarker performance vs AsyncStorage

### Issue 6 — Intelligent Sync & Offline Queue

**Checklist:**

- [ ] Configurer React Query offline mutations
- [ ] Implémenter delta sync avec WatermelonDB
- [ ] Gérer conflict resolution (last-write-wins)
- [ ] Background sync avec optimistic updates
- [ ] Test e2e offline → online sync

---

## 📱 Native & Upload

### Issue 7 — Image Picker + Permissions

**Checklist:**

- [ ] Intégrer react-native-image-picker
- [ ] Gérer permissions Android/iOS
- [ ] Composant preview image
- [ ] Test composant snapshot

### Issue 8 — Upload Attachment Mutation

**Checklist:**

- [ ] Créer mutation React Query multipart/form-data vers /attachments
- [ ] Intégrer avec WatermelonDB pour persistence locale
- [ ] Ajouter barre de progression
- [ ] Gérer erreurs & retry avec exponential backoff
- [ ] Test upload mocké

### Issue 9 — UI Components Library

**Checklist:**

- [ ] Créer Button, Card, Input, Modal
- [ ] Standardiser thème (colors, spacing)
- [ ] Ajouter Storybook ou exemples

---

## 🌍 Internationalization (i18n)

### Issue 11 — Setup i18n & Multiple Languages

**Checklist:**

- [ ] Installer react-i18next + react-native-localize
- [ ] Configurer i18n (fr, en par défaut)
- [ ] Créer fichiers traductions (locales/fr.json, locales/en.json)
- [ ] Intégrer provider I18nextProvider dans App
- [ ] Détecter langue système automatiquement
- [ ] Ajouter sélecteur de langue dans Settings
- [ ] Persister choix langue dans AsyncStorage
- [ ] Traduire tous les textes statiques (auth, navigation, erreurs)
- [ ] Gérer pluriels et interpolations
- [ ] Tester changement langue à la volée

---

### Issue 10 — Husky & Precommit Hooks

**Checklist:**

- [ ] Installer husky + lint-staged
- [ ] Hook pre-commit : lint + test rapide
- [ ] Documenter dans README
