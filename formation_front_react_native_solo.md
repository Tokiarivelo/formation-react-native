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

- **React Native expo** — Framework recommandé.
- **TypeScript** — typage strict pour une meilleure maintenabilité et autocomplétion.

### 2. **Gestion d’état et API**

- **Zustand** + **React Query** :
  - Zustand offre une gestion d'état simple et performante avec moins de boilerplate.
- React Query gère les appels API, le cache, la synchronisation et les états de chargement automatiquement.

### 3. **Réseau et sécurité**

- **Axios** : client HTTP fiable avec intercepteurs.
- **SecureStore (expo-secure-store)** ou **react-native-keychain** : stockage sécurisé des tokens.
- **.env** : gestion des variables d’environnement (API_URL, JWT_KEY).

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

### **Scaffold & navigation**

- ✅ Repo initial TypeScript configuré.
- ✅ Navigation Stack + Tabs fonctionnelle.
- ✅ ESLint, Prettier, Husky opérationnels.

**Techno clé :** React Native CLI, React Navigation.
**Pourquoi :** base structurelle solide pour organiser les modules.

---

### **Authentification (JWT + refresh)**

- ✅ LoginScreen et SignUpScreen.
- ✅ Appel API NestJS (`/auth/login`, `/auth/refresh`) via React Query.
- ✅ Token stocké dans SecureStore.
- ✅ Axios interceptor + Zustand auth store.

**Techno clé :** React Query + Zustand + SecureStore.
**Pourquoi :** Architecture plus légère, cache automatique, moins de boilerplate.

---

### ** Gestion d’état & Offline Sync**

- ✅ WatermelonDB setup avec modèles (User, Project, Task).
- ✅ Zustand store léger pour UI state.
- ✅ React Query offline mutations avec delta sync.
- ✅ Test performance + mode offline → online sync.

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

### **Tests & CI**

- ✅ Tests unitaires sur hooks & stores Zustand.
- ✅ Tests WatermelonDB avec base test.
- ✅ Snapshot tests UI avec observables.
- ✅ GitHub Actions workflow pour lint + test.

**Techno clé :** Jest + Testing Library + GitHub Actions.
**Pourquoi :** garantir la fiabilité du code et tester la performance.

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

# Arborescence complète — Front React Native (TypeScript, React Query, WatermelonDB, Zustand)

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
│  ├─ database
│  │  ├─ schema.ts                    # WatermelonDB schema
│  │  ├─ index.ts                     # Database initialization
│  │  └─ models
│  │     ├─ User.ts
│  │     ├─ Project.ts
│  │     ├─ Task.ts
│  │     └─ Attachment.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ components
│  │  │  │  └─ AuthForm.tsx
│  │  │  ├─ screens
│  │  │  │  ├─ LoginScreen.tsx
│  │  │  │  ├─ SignupScreen.tsx
│  │  │  │  └─ ForgotPasswordScreen.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useAuth.ts             # React Query auth hooks
│  │  │  └─ api.ts                    # Auth API calls
│  │  ├─ user
│  │  │  ├─ hooks
│  │  │  │  └─ useUsers.ts
│  │  │  └─ api.ts
│  │  ├─ projects
│  │  │  ├─ components
│  │  │  │  └─ ProjectCard.tsx
│  │  │  ├─ screens
│  │  │  │  ├─ ProjectsListScreen.tsx
│  │  │  │  └─ ProjectDetailsScreen.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useProjects.ts         # WatermelonDB + React Query
│  │  │  └─ api.ts
│  │  ├─ tasks
│  │  │  ├─ components
│  │  │  │  └─ TaskItem.tsx
│  │  │  ├─ screens
│  │  │  │  ├─ TaskDetailsScreen.tsx
│  │  │  │  └─ TaskEditScreen.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useTasks.ts
│  │  │  └─ api.ts
│  │  └─ attachments
│  │     ├─ components
│  │     │  └─ AttachmentPicker.tsx
│  │     ├─ hooks
│  │     │  └─ useAttachments.ts      # Upload + WatermelonDB sync
│  │     ├─ api.ts
│  │     └─ uploadUtils.ts
│  ├─ services
│  │  └─ axiosInstance.ts              # axios instance + interceptor (attach token, refresh)
│  ├─ store
│  │  ├─ index.ts                     # Zustand stores
│  │  ├─ authStore.ts                 # Auth state (lightweight)
│  │  ├─ uiStore.ts                   # UI state (theme, modals)
│  │  └─ queryClient.ts               # React Query configuration
│  ├─ sync
│  │  ├─ syncManager.ts               # Intelligent sync orchestrator
│  │  ├─ conflictResolver.ts          # Last-write-wins + custom rules
│  │  └─ deltaSync.ts                 # Incremental sync with timestamps
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

### **src/database/ (WatermelonDB)**

Base SQLite performante avec modèles observables :

- `models/` : Entités avec relations et méthodes business
- `schema.ts` : Structure de la base avec migrations
- Observables automatiques pour réactivité UI

### **src/modules/ (Domain-Driven)**

Séparation par domaine avec hooks React Query :

- `hooks/` : Custom hooks combinant WatermelonDB + React Query
- `api.ts` : Appels réseau avec cache intelligent
- Auto-sync entre base locale et serveur

### **React Query + WatermelonDB**

Architecture hybride optimale :

- `useProjects()`, `useCreateTask()` etc. avec cache multi-niveau
- WatermelonDB = source de vérité locale
- React Query = cache réseau + synchronisation

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

## 💡 Exemple Complet - Module Tasks

### **1. Modèle WatermelonDB** (`src/database/models/Task.ts`)

```typescript
import { Model, Q } from '@nozbe/watermelondb';
import { field, date, relation, writer } from '@nozbe/watermelondb/decorators';
import Project from './Project';

export default class Task extends Model {
  static table = 'tasks';
  static associations = {
    projects: { type: 'belongs_to', key: 'project_id' },
  };

  @field('title') title!: string;
  @field('description') description!: string;
  @field('completed') completed!: boolean;
  @field('priority') priority!: 'low' | 'medium' | 'high' | 'urgent';
  @field('project_id') projectId!: string;
  @field('user_id') userId!: string;
  @field('is_dirty') isDirty!: boolean;
  @date('due_date') dueDate?: Date;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @relation('projects', 'project_id') project!: Project;

  @writer async toggleComplete() {
    await this.update((task) => {
      task.completed = !task.completed;
      task.isDirty = true;
    });
  }

  @writer async updatePriority(priority: string) {
    await this.update((task) => {
      task.priority = priority;
      task.isDirty = true;
    });
  }
}
```

### **2. Hook React Query + WatermelonDB** (`src/modules/tasks/hooks/useTasks.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { database } from '../../../database';
import { tasksApi } from '../api';
import Task from '../../../database/models/Task';
import { useAuthStore } from '../../../store/authStore';

export const useTasks = (projectId?: string) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['tasks', projectId, user?.id],
    queryFn: async () => {
      const query = database.collections.get<Task>('tasks').query();

      if (projectId) {
        query.where('project_id', projectId);
      }

      return await query.fetch();
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (taskData: {
      title: string;
      description?: string;
      projectId: string;
      priority?: string;
    }) => {
      // Optimistic create dans WatermelonDB
      const task = await database.write(async () => {
        return await database.collections.get('tasks').create((task) => {
          task.title = taskData.title;
          task.description = taskData.description || '';
          task.projectId = taskData.projectId;
          task.priority = taskData.priority || 'medium';
          task.userId = user!.id;
          task.completed = false;
          task.isDirty = true;
        });
      });

      // Sync avec serveur en arrière-plan
      try {
        const remoteTask = await tasksApi.create(taskData);
        await database.write(async () => {
          await task.update((t) => {
            t._raw.id = remoteTask.id;
            t.isDirty = false;
          });
        });
      } catch (error) {
        console.warn('Task sync failed, keeping local', error);
      }

      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useToggleTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const task = await database.collections.get<Task>('tasks').find(taskId);
      await task.toggleComplete();
      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
```

### **3. API Layer** (`src/modules/tasks/api.ts`)

```typescript
import { axiosInstance } from '../../services/axiosInstance';

interface CreateTaskRequest {
  title: string;
  description?: string;
  projectId: string;
  priority?: string;
}

interface TaskResponse {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export const tasksApi = {
  async getAll(projectId?: string): Promise<TaskResponse[]> {
    const params = projectId ? { projectId } : {};
    const { data } = await axiosInstance.get('/tasks', { params });
    return data;
  },

  async create(taskData: CreateTaskRequest): Promise<TaskResponse> {
    const { data } = await axiosInstance.post('/tasks', taskData);
    return data;
  },

  async update(
    id: string,
    updates: Partial<TaskResponse>
  ): Promise<TaskResponse> {
    const { data } = await axiosInstance.put(`/tasks/${id}`, updates);
    return data;
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/tasks/${id}`);
  },

  async toggleComplete(id: string): Promise<TaskResponse> {
    const { data } = await axiosInstance.patch(`/tasks/${id}/toggle`);
    return data;
  },
};
```

### **4. Composant UI** (`src/modules/tasks/components/TaskItem.tsx`)

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Task from '../../../database/models/Task';
import { useToggleTask } from '../hooks/useTasks';

interface TaskItemProps {
  task: Task;
  onPress?: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onPress }) => {
  const toggleMutation = useToggleTask();

  const handleToggle = () => {
    toggleMutation.mutate(task.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#EF4444';
      case 'high':
        return '#F97316';
      case 'medium':
        return '#3B82F6';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, task.completed && styles.completed]}
      onPress={onPress}
    >
      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
        onPress={handleToggle}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>
          {task.title}
        </Text>

        {task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        <View style={styles.meta}>
          <View
            style={[
              styles.priority,
              { backgroundColor: getPriorityColor(task.priority) },
            ]}
          >
            <Text style={styles.priorityText}>
              {task.priority.toUpperCase()}
            </Text>
          </View>

          {task.dueDate && (
            <Text style={styles.dueDate}>
              {format(task.dueDate, 'dd MMM', { locale: fr })}
            </Text>
          )}

          {task.isDirty && (
            <View style={styles.syncIndicator}>
              <Text style={styles.syncText}>⟳</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  completed: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priority: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginRight: 8,
  },
  syncIndicator: {
    marginLeft: 'auto',
  },
  syncText: {
    color: '#F59E0B',
    fontSize: 14,
  },
});
```

### **5. Screen avec observables** (`src/modules/tasks/screens/TaskDetailsScreen.tsx`)

```typescript
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { withObservables } from '@nozbe/with-observables';
import { RouteProp } from '@react-navigation/native';
import Task from '../../../database/models/Task';
import { database } from '../../../database';
import { TaskItem } from '../components/TaskItem';

interface TaskDetailsScreenProps {
  route: RouteProp<{ params: { taskId: string } }, 'params'>;
  task: Task;
}

const TaskDetailsScreen: React.FC<TaskDetailsScreenProps> = ({ task }) => {
  if (!task) {
    return (
      <View style={styles.centerContainer}>
        <Text>Tâche introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TaskItem task={task} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {task.description || 'Aucune description'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détails</Text>
        <Text style={styles.detail}>Priorité: {task.priority}</Text>
        <Text style={styles.detail}>
          Créée le: {task.createdAt.toLocaleDateString('fr-FR')}
        </Text>
        {task.dueDate && (
          <Text style={styles.detail}>
            Échéance: {task.dueDate.toLocaleDateString('fr-FR')}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

// HOC WatermelonDB pour observables automatiques
const enhance = withObservables(['route'], ({ route }) => ({
  task: database.collections
    .get<Task>('tasks')
    .findAndObserve(route.params.taskId),
}));

export default enhance(TaskDetailsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  detail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
});
```

Cette architecture montre la **puissance de la stack performance** :

- **WatermelonDB** : Modèles avec méthodes business
- **React Query** : Cache intelligent + sync automatique
- **Observables** : UI réactive en temps réel
- **Optimistic Updates** : UX fluide même offline

### **tests/**

- Tests unitaires : **Jest** (stores Zustand, hooks React Query, modèles WatermelonDB).
- Tests E2E : validation du flux offline → online avec delta sync.
- Tests performance : benchmarks WatermelonDB vs AsyncStorage.

---

📦 **Repo cible :** [formation-react-native.git](https://github.com/Tokiarivelo/formation-react-native.git)
