import { View } from 'react-native'
import React from 'react'
import { TaskStackScreenProps } from '../../../types/navigation'
import TaskForm from '../components/TaskForm'

type Prop = TaskStackScreenProps<'TaskCreate'>;

const TaskCreateScreen = ({ route }: Prop) => {
    const { projectId } = route.params;
    return (
        <View>
            <TaskForm isUpdate={false} projectId={projectId} />
        </View>
    )
}

export default TaskCreateScreen