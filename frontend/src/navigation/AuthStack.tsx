import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../modules/auth/screens/LoginScreen';
import SignUpScreen from '../modules/auth/screens/SignUpScreen';

const Stack = createNativeStackNavigator();

const renderAuthStack = () => {
    return (
        <>
            <Stack.Screen component={LoginScreen} name="Login" />
            <Stack.Screen component={SignUpScreen} name="SignUp" />
        </>
    )
}

export default renderAuthStack