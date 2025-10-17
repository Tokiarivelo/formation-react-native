import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

const renderAppStack = () => {
    return (
        <>
            <Stack.Screen name="home" component={HomeScreen} />
        </>
    )
}

export default renderAppStack