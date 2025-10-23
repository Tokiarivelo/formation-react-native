import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import ProjectScreen from '../screens/ProjectScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Project" component={ProjectScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Settings" component={SettingScreen} />
        </Tab.Navigator>
    )
}
const renderAppStack = () => {
    return (
        <>
            <Stack.Screen name="App" component={AppTabs} />
        </>
    )
}

export default renderAppStack