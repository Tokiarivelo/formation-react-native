import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';
import { theme } from '../config/theme';
import { MainTabParamList, ProjectsStackParamList, TasksStackParamList } from '../types/models';

// Import des écrans
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Projects screens
import ProjectDetailsScreen from '../modules/projects/screens/ProjectDetailsScreen';
import ProjectEditScreen from '../modules/projects/screens/ProjectEditScreen';
import ProjectsListScreen from '../modules/projects/screens/ProjectsListScreen';

import TasksListScreen from '../modules/tasks/screens/TasksListScreen';
import TaskDetailsScreen from '../modules/tasks/screens/TaskDetailsScreen';
import TaskEditScreen from '../modules/tasks/screens/TaskEditScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const ProjectsStack = createStackNavigator<ProjectsStackParamList>();
const TasksStack = createStackNavigator<TasksStackParamList>();

// Stack pour les projets
const ProjectsStackNavigator = () => (
  <ProjectsStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: theme.colors.primary },
      headerTintColor: theme.colors.white,
      headerTitleStyle: { fontWeight: theme.fontWeights.semibold },
    }}
  >
    <ProjectsStack.Screen name="ProjectsList" component={ProjectsListScreen} options={{ title: 'Mes Projets' }} />
    <ProjectsStack.Screen name="ProjectDetails" component={ProjectDetailsScreen} options={{ title: 'Détails du Projet' }} />
    <ProjectsStack.Screen name="ProjectEdit" component={ProjectEditScreen} options={{ title: 'Projet' }} />
  </ProjectsStack.Navigator>
);

// Stack pour les tâches
const TasksStackNavigator = () => (
  <TasksStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: theme.colors.primary },
      headerTintColor: theme.colors.white,
      headerTitleStyle: { fontWeight: theme.fontWeights.semibold },
    }}
  >
    <TasksStack.Screen name="TasksList" component={TasksListScreen} options={{ title: 'Mes Tâches' }} />
    <TasksStack.Screen name="TaskDetails" component={TaskDetailsScreen} options={{ title: 'Détails de la Tâche' }} />
    <TasksStack.Screen name="TaskEdit" component={TaskEditScreen} options={{ title: 'Tâche' }} />
  </TasksStack.Navigator>
);

// Composant pour les icônes des tabs
const TabIcon = ({ name }: { name: string; focused: boolean }) => {
  const getIconText = () => {
    switch (name) {
      case 'Home':
        return '🏠';
      case 'Projects':
        return '📁';
      case 'Tasks':
        return '✅';
      case 'Profile':
        return '👤';
      default:
        return '📱';
    }
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, lineHeight: 26 }}>
        {getIconText()}
      </Text>
    </View>
  );
};

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray[500],
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.light,
          height: 64,
          paddingVertical: 8,
          ...theme.shadows.small,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: theme.fontWeights.medium,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
        }}
      />
      <Tab.Screen 
        name="Projects" 
        component={ProjectsStackNavigator}
        options={{
          tabBarLabel: 'Projets',
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksStackNavigator}
        options={{
          tabBarLabel: 'Tâches',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
