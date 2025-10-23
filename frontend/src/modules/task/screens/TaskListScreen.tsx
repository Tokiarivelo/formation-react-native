import { View } from 'react-native'
import React from 'react'
import { useTasks } from '../hooks/useTasks'
import AppText from '../../../components/ui/AppText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TaskStackParamList } from '../../../types/navigation';
import TaskFlatList from '../components/TaskFlatList';

const TaskListScreen = ({ navigation }: NativeStackScreenProps<TaskStackParamList>) => {
    const { data: tasks } = useTasks();

    return (
        <View>
            <AppText>Task List: </AppText>
            <TaskFlatList data={tasks} navigation={navigation} />
        </View>
    )
}

export default TaskListScreen