import { View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TaskStackParamList } from '../../../types/navigation'
import TaskForm from '../components/TaskForm'

const TaskCreateScreen = ({ route }: NativeStackScreenProps<TaskStackParamList, 'TaskCreate'>) => {
    const { projectId } = route.params;
    return (
        <View>
            <TaskForm isUpdate={false} projectId={projectId} />
        </View>
    )
}

export default TaskCreateScreen