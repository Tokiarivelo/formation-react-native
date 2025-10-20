import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { theme } from '../config/theme';
import { MainTabParamList, ProjectsStackParamList, TasksStackParamList } from '../types/models';

// Import des écrans
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Placeholder screens pour les modules à venir
const ProjectsPlaceholderScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.secondary }}>
    <Text style={{ fontSize: theme.fontSizes.xl, color: theme.colors.text.primary }}>📁 Projets</Text>
    <Text style={{ fontSize: theme.fontSizes.md, color: theme.colors.text.secondary, marginTop: theme.spacing.md }}>
      Module en cours de développement
    </Text>
  </View>
);

const TasksPlaceholderScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.secondary }}>
    <Text style={{ fontSize: theme.fontSizes.xl, color: theme.colors.text.primary }}>✅ Tâches</Text>
    <Text style={{ fontSize: theme.fontSizes.md, color: theme.colors.text.secondary, marginTop: theme.spacing.md }}>
      Module en cours de développement
    </Text>
  </View>
);

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
    <ProjectsStack.Screen 
      name="ProjectsList" 
      component={ProjectsPlaceholderScreen}
      options={{ title: 'Mes Projets' }}
    />
    <ProjectsStack.Screen 
      name="ProjectDetails" 
      component={ProjectsPlaceholderScreen}
      options={{ title: 'Détails du Projet' }}
    />
    <ProjectsStack.Screen 
      name="ProjectEdit" 
      component={ProjectsPlaceholderScreen}
      options={{ title: 'Modifier le Projet' }}
    />
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
    <TasksStack.Screen 
      name="TasksList" 
      component={TasksPlaceholderScreen}
      options={{ title: 'Mes Tâches' }}
    />
    <TasksStack.Screen 
      name="TaskDetails" 
      component={TasksPlaceholderScreen}
      options={{ title: 'Détails de la Tâche' }}
    />
    <TasksStack.Screen 
      name="TaskEdit" 
      component={TasksPlaceholderScreen}
      options={{ title: 'Modifier la Tâche' }}
    />
  </TasksStack.Navigator>
);

// Composant pour les icônes des tabs
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
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
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 2 }}>
        {getIconText()}
      </Text>
      <Text style={{ 
        fontSize: 10, 
        color: focused ? theme.colors.primary : theme.colors.gray[500],
        fontWeight: focused ? theme.fontWeights.semibold : theme.fontWeights.normal
      }}>
        {name}
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
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
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
