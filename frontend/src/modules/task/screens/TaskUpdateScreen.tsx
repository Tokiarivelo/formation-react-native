import { View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TaskStackParamList } from '../../../types/navigation'
import TaskForm from '../components/TaskForm'

const TaskUpdateScreen = ({ route }: NativeStackScreenProps<TaskStackParamList, 'TaskUpdate'>) => {
    const { task, projectId } = route.params;
    return (
        <View>
            <TaskForm isUpdate={true} task={task} projectId={projectId} />
        </View>
    )
}

export default TaskUpdateScreen