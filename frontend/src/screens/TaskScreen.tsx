import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../modules/task/screens/TaskListScreen';
import { TaskStackParamList } from '../types/navigation';
import TaskDetailScreen from '../modules/task/screens/TaskDetailScreen';
import TaskUpdateScreen from '../modules/task/screens/TaskUpdateScreen';
import TaskCreateScreen from '../modules/task/screens/TaskCreateScreen';

const Stack = createNativeStackNavigator<TaskStackParamList>();

const TaskScreen = () => {
    return (
        <Stack.Navigator >
            <Stack.Screen name="TaskList" component={TaskListScreen} />
            <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
            <Stack.Screen name="TaskCreate" component={TaskCreateScreen} />
            <Stack.Screen name="TaskUpdate" component={TaskUpdateScreen} />
        </Stack.Navigator >
    )
}

export default TaskScreen