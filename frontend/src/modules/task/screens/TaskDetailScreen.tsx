import { View } from 'react-native'
import React from 'react'
import AppText from '../../../components/ui/AppText'
import { TaskStackParamList } from '../../../types/navigation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useTaskById } from '../hooks/useTasks'

const TaskDetailScreen = ({ route }: NativeStackScreenProps<TaskStackParamList, 'TaskDetail'>) => {
    const { taskId } = route.params;
    const { data: task } = useTaskById(taskId);
    return (
        <View>
            <AppText>task id: {task?.id}</AppText>
            <AppText>task title: {task?.title}</AppText>
            <AppText>task description: {task?.description}</AppText>
            <AppText>task status: {task?.status}</AppText>
            <AppText>task priority: {task?.priority}</AppText>
            <AppText>task dueDate: {task?.dueDate}</AppText>
            <AppText>task createdAt: {task?.createdAt}</AppText>
            <AppText>task updatedAt: {task?.updatedAt}</AppText>
            <AppText>task userId: {task?.userId}</AppText>
            <AppText>task projectId: {task?.projectId}</AppText>
        </View>
    )
}

export default TaskDetailScreen