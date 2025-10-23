import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProjectListScreen from '../modules/project/screens/ProjectListScreen';
import ProjectDetailScreen from '../modules/project/screens/ProjectDetailScreen';
import ProjectCreateScreen from '../modules/project/screens/ProjectCreateScreen';
import ProjectUpdateScreen from '../modules/project/screens/ProjectUpdateScreen';
import { ProjectStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<ProjectStackParamList>();

const ProjectScreen = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProjectList" component={ProjectListScreen} />
            <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
            <Stack.Screen name="ProjectCreate" component={ProjectCreateScreen} />
            <Stack.Screen name="ProjectUpdate" component={ProjectUpdateScreen} />
        </Stack.Navigator>
    )
}

export default ProjectScreen