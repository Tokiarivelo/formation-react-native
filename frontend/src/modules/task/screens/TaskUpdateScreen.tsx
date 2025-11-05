import { View } from 'react-native'
import React from 'react'
import { TaskStackScreenProps } from '../../../types/navigation'
import TaskForm from '../components/TaskForm'
import Task from '../../../database/models/Task';
import { withObservables } from '@nozbe/watermelondb/react';
import { tasksApi_local } from '../localApi';

type Props = TaskStackScreenProps<'TaskUpdate'> & {
    task: Task
};

const enhance = withObservables(['route'], ({ route }: TaskStackScreenProps<'TaskUpdate'>) => ({
    task: tasksApi_local.get(route.params.taskId)
}))

const TaskUpdateScreen = ({ task, route }: Props) => {
    const { projectId } = route.params;
    return (
        <View>
            <TaskForm isUpdate={true} task={task} projectId={projectId} />
        </View>
    )
}

export default enhance(TaskUpdateScreen)