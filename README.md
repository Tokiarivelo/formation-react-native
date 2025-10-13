# Front React Native

## 🧩 Auth & Navigation

### Issue 1 — Auth/Login & Secure Storage

**Checklist:**

- [ ] Créer LoginScreen (email, password)
- [ ] Implémenter appel /auth/login via RTK Query
- [ ] Stocker access/refresh tokens via SecureStore
- [ ] Ajouter axios interceptor
- [ ] Afficher erreurs backend
- [ ] Tests unitaires useAuth()

### Issue 2 — Auth/Refresh & Protected Routes

**Checklist:**

- [ ] Implémenter /auth/refresh via RTK Query
- [ ] Rediriger vers Login si token expiré
- [ ] Gérer refresh automatique (interceptor)
- [ ] Test e2e login+refresh

### Issue 3 — Navigation Setup

**Checklist:**

- [ ] Configurer react-navigation (Stack + BottomTabs)
- [ ] Créer routes: AuthStack, AppStack
- [ ] Ajouter Screens: Home, Tasks, Profile, Settings

---

## 🔄 RTK Query & Offline Sync

### Issue 4 — Setup RTK & Base API

**Checklist:**

- [ ] Configurer store + baseApi (axios baseQuery)
- [ ] Ajouter endpoints users/projects/tasks
- [ ] Intégrer provider Redux dans App
- [ ] Test simple fetchProjects()

### Issue 5 — Offline Storage & Hydration

**Checklist:**

- [ ] Sauvegarder cache dans AsyncStorage
- [ ] Restaurer au startup
- [ ] Ajouter middleware hydrateStore()
- [ ] Vérifier rehydratation après redémarrage

### Issue 6 — Outbox & Sync Queue (outbox)

**Checklist:**

- [ ] Créer file d’attente pour mutations offline
- [ ] Gérer relecture après reconnexion
- [ ] Marquer tâches dirty
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

- [ ] Créer mutation multipart/form-data vers /attachments
- [ ] Ajouter barre de progression
- [ ] Gérer erreurs & retry
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
