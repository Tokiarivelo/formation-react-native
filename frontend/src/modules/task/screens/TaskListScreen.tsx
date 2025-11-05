import { View } from 'react-native'
import React, { useCallback } from 'react'
import AppText from '../../../components/ui/AppText';
import { TaskStackScreenProps } from '../../../types/navigation';
import Task from '../../../database/models/Task';
import TaskListItem from '../components/TaskListItem';

type Prop = TaskStackScreenProps<'TaskList'> & {
    tasks: Task[],
    projectId: string,
};

const TaskListScreen = ({ navigation, tasks, projectId }: Prop) => {
    const renderItem = useCallback(({ item }: { item: Task }) => (
        <TaskListItem task={item}
            onTaskDetail={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            onTaskUpdate={() => navigation.navigate('TaskUpdate', { taskId: item.id, projectId: projectId })}
        />
    ), [navigation, projectId]);
    return (
        <View>
            <AppText>Task List: </AppText>
        </View>
    )
}

export default TaskListScreen