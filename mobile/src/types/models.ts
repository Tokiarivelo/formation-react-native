// Navigation Types
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Projects: NavigatorScreenParams<ProjectsStackParamList>;
  Tasks: NavigatorScreenParams<TasksStackParamList>;
  Profile: undefined;
};

export type ProjectsStackParamList = {
  ProjectsList: undefined;
  ProjectDetails: { projectId: string };
  ProjectEdit: { projectId?: string };
};

export type TasksStackParamList = {
  TasksList: undefined;
  TaskDetails: { taskId: string };
  TaskEdit: { taskId?: string };
};

// Import NavigatorScreenParams from React Navigation
import { NavigatorScreenParams } from '@react-navigation/native';

// Auth State Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// UI State Types
export interface UIState {
  theme: 'light' | 'dark';
  language: 'en' | 'fr';
  isLoading: boolean;
}

// Sync State Types
export interface SyncState {
  isOnline: boolean;
  pendingMutations: number;
  lastSyncTime: Date | null;
}

// Import User type from api.d.ts
import { User } from './api';
