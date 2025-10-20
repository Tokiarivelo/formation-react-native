import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '../config/theme';
import { AuthStackParamList } from '../types/models';
import LoginScreen from '../modules/auth/screens/LoginScreen';
import SignupScreen from '../modules/auth/screens/SignupScreen';
import ForgotPasswordScreen from '../modules/auth/screens/ForgotPasswordScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background.secondary },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
