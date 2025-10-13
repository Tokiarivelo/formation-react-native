# Formation Front React Native

## 🎯 Objectif global

Créer un prototype complet d’application mobile en **React Native (TypeScript)**:

- Authentification sécurisée (JWT + refresh token) via backend NestJS.
- Gestion d’état et synchronisation offline.
- Upload de fichiers locaux (images) avec suivi de progression.
- Support multi-langue (i18n) pour UI et contenus.
- Tests et intégration continue (CI) via GitHub Actions.

Le but : former le développeur à maîtriser la structure modulaire, les bonnes pratiques TypeScript, et l’intégration avec une API NestJS.

Durée : **2 semaines (10 jours ouvrés)**.

---

## ⚙️ Stack / Contraintes à respecter

### 1. **Langage et framework**

- **React Native CLI** — permet un contrôle total sur les dépendances et la configuration native.
- **TypeScript** — typage strict pour une meilleure maintenabilité et autocomplétion.

### 2. **Gestion d’état et API**

- **Redux Toolkit (RTK)** + **RTK Query** :
  - RTK structure les reducers et actions de façon standardisée.
  - RTK Query simplifie les appels API, la gestion du cache et la synchronisation offline.

### 3. **Réseau et sécurité**

- **Axios** : client HTTP fiable avec intercepteurs.
- **SecureStore (expo-secure-store)** ou **react-native-keychain** : stockage sécurisé des tokens.
- **.env** : gestion des variables d’environnement (API_URL, JWT_KEY).

### 4. **Offline et persistance**

- **AsyncStorage** : pour la persistance locale (cache + mode offline).
- **Middleware custom “outbox”** : file d’attente locale pour rejouer les requêtes quand la connexion revient.
- Justification : permet d’assurer une expérience fluide même sans réseau.

### 5. **Upload et fichiers natifs**

- **react-native-image-picker** : accès à la galerie / caméra.
- **FormData + Axios** : pour upload multipart vers le backend.
- Justification : solution simple et stable pour gérer les fichiers sans dépendances lourdes.

### 6. **Multi-langue (i18n)**

- **react-i18next** (ou i18next) : gestion des traductions, détection langue système, chargement lazy des namespaces.
- Stocker les traductions en JSON dans `src/i18n/` et fournir un hook `useTranslation()` pour composants.
- Justification : i18next est robuste, bien supporté et permet switch runtime et fallback.

### 7. **Navigation & UI**

- **React Navigation (v7)** : Stack + Bottom Tabs.
- **UI components custom** : Button, Card, Input, Modal, pour un design cohérent.

### 8. **Qualité et automatisation**

- **ESLint + Prettier + Husky + lint-staged** : normalisation du code.
- **Jest + @testing-library/react-native** : tests unitaires et snapshots.
- **GitHub Actions CI** : pipeline automatisé (lint, test, build).

---

## 📦 Livrables intermédiaires & critères de validation

### **Jour 1–2 : Scaffold & navigation**

- ✅ Repo initial TypeScript configuré.
- ✅ Navigation Stack + Tabs fonctionnelle.
- ✅ ESLint, Prettier, Husky opérationnels.

**Techno clé :** React Native CLI, React Navigation.
**Pourquoi :** base structurelle solide pour organiser les modules.

---

### **Jour 3–4 : Authentification (JWT + refresh)**

- ✅ LoginScreen et SignUpScreen.
- ✅ Appel API NestJS (`/v1/auth/login`, `/v1/auth/refresh`).
- ✅ Token stocké dans SecureStore.
- ✅ Axios interceptor gérant le refresh auto.

**Techno clé :** Axios + SecureStore + RTK Query.
**Pourquoi :** combinaison sécurisée et performante pour gérer les sessions utilisateur.

---

### **Jour 5–6 : Gestion d’état & Offline Sync**

- ✅ RTK store avec slices pour user, project, task.
- ✅ Persistance locale avec AsyncStorage.
- ✅ Middleware outbox pour les mutations offline.
- ✅ Test du mode offline → online sync.

**Techno clé :** Redux Toolkit + AsyncStorage.
**Pourquoi :** architecture prédictive et performante pour les apps offline-first.

---

### **Jour 7–8 : Upload & fichiers natifs**

- ✅ Sélection d’images depuis galerie/caméra.
- ✅ Preview avant upload.
- ✅ Upload multipart via RTK Query mutation.
- ✅ Gestion des erreurs et du retry.

**Techno clé :** react-native-image-picker + FormData + Axios.
**Pourquoi :** standard pour interagir avec les fichiers sur mobile.

---

### **Jour 9 : Tests & CI**

- ✅ Tests unitaires sur reducers & hooks.
- ✅ Snapshot tests UI.
- ✅ GitHub Actions workflow pour lint + test.

**Techno clé :** Jest + GitHub Actions.
**Pourquoi :** garantir la fiabilité du code et automatiser la qualité.

---

### **Jour 10 : Documentation & Livraison**

- ✅ README complet (installation, run, API endpoints).
- ✅ .env.example.
- ✅ APK debug généré.
- ✅ Présentation du workflow (auth → offline → upload).
- ✅ Le projet sera poussé dans le repo : https://github.com/Tokiarivelo/formation-react-native.git

**Critères de validation globaux :**

1. L’application fonctionne offline et se resynchronise.
2. L’auth est stable (login/logout/refresh).
3. Upload d’image fonctionnel.
4. Code propre (ESLint, tests, CI vert).

---

# Arborescence complète — Front React Native (TypeScript, RTK Query, offline, i18n)

```psql
/formation-react-native
├─ .github
│  └─ workflows
│     └─ ci.yml
├─ android/
├─ ios/
├─ scripts/
│  ├─ start-android.sh
│  ├─ start-ios.sh
│  └─ gen-types.sh
├─ .env.example
├─ .eslintrc.js
├─ .prettierrc
├─ .gitattributes
├─ .gitignore
├─ app.json
├─ babel.config.js
├─ jest.config.js
├─ metro.config.js
├─ package.json
├─ README.md
├─ tsconfig.json
├─ tsconfig.paths.json
├─ postman_collection.json
├─ src
│  ├─ assets
│  │  ├─ fonts/
│  │  └─ images/
│  │     └─ placeholders/
│  ├─ components
│  │  ├─ ui
│  │  │  ├─ Button.tsx
│  │  │  ├─ Card.tsx
│  │  │  ├─ Input.tsx
│  │  │  └─ Modal.tsx
│  │  └─ common
│  │     ├─ Loading.tsx
│  │     └─ EmptyState.tsx
│  ├─ config
│  │  ├─ api.ts
│  │  ├─ env.ts
│  │  └─ theme.ts
│  ├─ constants
│  │  └─ index.ts
│  ├─ i18n
│  │  ├─ index.ts
│  │  ├─ en.json
│  │  └─ fr.json
│  ├─ navigation
│  │  ├─ AppNavigator.tsx
│  │  ├─ AuthNavigator.tsx
│  │  └─ screensMap.ts
│  ├─ hooks
│  │  ├─ useAuth.ts
│  │  ├─ useImagePicker.ts
│  │  └─ useOfflineSync.ts
│  ├─ libs
│  │  ├─ storage
│  │  │  ├─ secureStore.ts           # Secure token storage
│  │  │  └─ asyncStorage.ts
│  │  └─ network
│  │     └─ netInfo.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ components
│  │  │  │  └─ AuthForm.tsx
│  │  │  ├─ screens
│  │  │  │  ├─ LoginScreen.tsx
│  │  │  │  ├─ SignupScreen.tsx
│  │  │  │  └─ ForgotPasswordScreen.tsx
│  │  │  ├─ authSlice.ts
│  │  │  └─ auth.api.ts                # RTK Query endpoints for auth
│  │  ├─ user
│  │  │  ├─ userSlice.ts
│  │  │  └─ user.api.ts
│  │  ├─ projects
│  │  │  ├─ components
│  │  │  │  └─ ProjectCard.tsx
│  │  │  ├─ screens
│  │  │  │  ├─ ProjectsListScreen.tsx
│  │  │  │  └─ ProjectDetailsScreen.tsx
│  │  │  ├─ projectsSlice.ts
│  │  │  └─ projects.api.ts
│  │  ├─ tasks
│  │  │  ├─ components
│  │  │  │  └─ TaskItem.tsx
│  │  │  ├─ screens
│  │  │  │  ├─ TaskDetailsScreen.tsx
│  │  │  │  └─ TaskEditScreen.tsx
│  │  │  ├─ tasksSlice.ts
│  │  │  └─ tasks.api.ts
│  │  └─ attachments
│  │     ├─ components
│  │     │  └─ AttachmentPicker.tsx
│  │     ├─ attachments.api.ts         # multipart/form-data mutation
│  │     └─ uploadUtils.ts
│  ├─ services
│  │  └─ axiosInstance.ts              # axios instance + interceptor (attach token, refresh)
│  ├─ store
│  │  ├─ index.ts
│  │  ├─ rootReducer.ts
│  │  └─ persist
│  │     ├─ hydrateStore.ts           # hydrate from AsyncStorage
│  │     ├─ persistMiddleware.ts
│  │     └─ outbox.ts                 # outbox queue management
│  ├─ types
│  │  ├─ api.d.ts
│  │  └─ models.ts
│  ├─ utils
│  │  ├─ date.ts
│  │  ├─ logger.ts
│  │  └─ validators.ts
│  └─ screens
│     ├─ HomeScreen.tsx
│     ├─ ProfileScreen.tsx
│     └─ SettingsScreen.tsx
├─ tests
│  ├─ unit
│  │  ├─ auth.reducer.test.ts
│  │  └─ outbox.test.ts
│  └─ e2e
│     └─ offline-sync.e2e.ts
└─ tools
   └─ generate-icons.js
```

# Notes rapides — Structure du projet front React Native

## 📁 Détails par dossier / technologie

### **src/modules/**

Séparation par domaine (auth, projects, tasks). Facilite la maintenance, le découplage et les tests unitaires. Chaque module contient :

- `screens/` pour les pages.
- `components/` pour les éléments UI spécifiques.
- `*.api.ts` pour les endpoints RTK Query.

### **RTK Query**

Fichiers `*.api.ts` contiennent les endpoints et hooks auto-générés :

- `useGetProjectsQuery`, `useCreateTaskMutation`, etc.
- Gère cache, invalidations et états (loading, error) nativement.

### **store/persist/**

- `hydrateStore.ts` : restaure le cache et le store Redux depuis AsyncStorage.
- `outbox.ts` : stocke les mutations offline et les rejoue automatiquement (backoff + retry) lorsque la connexion revient.
- Intégré avec `@react-native-community/netinfo` pour détecter l’état réseau.

### **secureStore.ts**

Utilise **react-native-keychain** ou **expo-secure-store** pour sauvegarder les tokens JWT et refresh token.

> ⚠️ Ne jamais stocker de tokens sensibles dans AsyncStorage.

### **i18n/**

Basé sur **react-i18next** :

- Fichiers de traductions JSON (`en.json`, `fr.json`).
- Hook `useTranslation()` pour traduire dynamiquement les textes.
- Détection automatique de la langue du système + possibilité de switcher.

### **attachments.api.ts**

- Upload d’images ou fichiers via `FormData` (multipart/form-data).
- Axios instance gère les headers (`Authorization`) et le refresh token via interceptor.
- Backend NestJS reçoit et stocke les fichiers localement (pas de S3).

### **tests/**

- Tests unitaires : **Jest** (reducers, hooks, services).
- Tests E2E légers : validation du flux offline → online (ex. replay de l’outbox).

### **.github/workflows/ci.yml**

Pipeline CI :

- Lint + format check.
- Tests unitaires Jest.
- Build debug (Android/iOS).
- Ajout d’un badge CI dans le README du repo.

---

📦 **Repo cible :** [formation-react-native.git](https://github.com/Tokiarivelo/formation-react-native.git)
