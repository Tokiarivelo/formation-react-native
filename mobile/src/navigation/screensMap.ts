// Mapping des écrans pour la navigation
export const SCREEN_NAMES = {
  // Auth Stack
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // Main Tabs
  HOME: 'Home',
  PROJECTS: 'Projects',
  TASKS: 'Tasks',
  PROFILE: 'Profile',
  
  // Projects Stack
  PROJECTS_LIST: 'ProjectsList',
  PROJECT_DETAILS: 'ProjectDetails',
  PROJECT_EDIT: 'ProjectEdit',
  
  // Tasks Stack
  TASKS_LIST: 'TasksList',
  TASK_DETAILS: 'TaskDetails',
  TASK_EDIT: 'TaskEdit',
} as const;

// Configuration des options de navigation par écran
export const SCREEN_OPTIONS = {
  // Auth screens
  [SCREEN_NAMES.LOGIN]: {
    title: 'Connexion',
    headerShown: false,
  },
  [SCREEN_NAMES.SIGNUP]: {
    title: 'Inscription',
    headerShown: false,
  },
  [SCREEN_NAMES.FORGOT_PASSWORD]: {
    title: 'Mot de passe oublié',
    headerShown: false,
  },
  
  // Main screens
  [SCREEN_NAMES.HOME]: {
    title: 'Accueil',
    headerShown: false,
  },
  [SCREEN_NAMES.PROFILE]: {
    title: 'Profil',
    headerShown: false,
  },
  
  // Projects screens
  [SCREEN_NAMES.PROJECTS_LIST]: {
    title: 'Mes Projets',
  },
  [SCREEN_NAMES.PROJECT_DETAILS]: {
    title: 'Détails du Projet',
  },
  [SCREEN_NAMES.PROJECT_EDIT]: {
    title: 'Modifier le Projet',
  },
  
  // Tasks screens
  [SCREEN_NAMES.TASKS_LIST]: {
    title: 'Mes Tâches',
  },
  [SCREEN_NAMES.TASK_DETAILS]: {
    title: 'Détails de la Tâche',
  },
  [SCREEN_NAMES.TASK_EDIT]: {
    title: 'Modifier la Tâche',
  },
} as const;
