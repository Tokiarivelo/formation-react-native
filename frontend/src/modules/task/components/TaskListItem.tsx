import { View, StyleSheet } from 'react-native'
import React from 'react'
import AppText from '../../../components/ui/AppText'
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity'
import { useDeleteTask } from '../hooks/useTasks'
import Task from '../../../database/models/Task'

type TaskListItemProp = {
    task: Task,
    onTaskDetail: () => void,
    onTaskUpdate: () => void,
}

const TaskListItem = ({ task, onTaskDetail, onTaskUpdate }: TaskListItemProp) => {
    const { mutate: remove } = useDeleteTask();

    return (
        <View style={styles.container}>

            {/* PROJECT NAME */}
            <AppTouchableOpacity
                onPress={onTaskDetail}
                style={styles.nameContainer}
            >
                <AppText style={styles.projectName}>{task.title}</AppText>
            </AppTouchableOpacity>

            {/* PROJECT UPDATE AND REMOVE CONTAINER */}
            <View style={styles.actionsContainer}>

                {/* PROJECT UPDATE BUTTON */}
                <AppTouchableOpacity
                    onPress={onTaskUpdate}
                    style={[styles.actionButton, styles.updateButton]}
                >
                    <AppText style={styles.actionText}>Update</AppText>
                </AppTouchableOpacity>


                {/* PROJECT REMOVE BUTTON */}
                <AppTouchableOpacity
                    onPress={() => remove(task.id)}
                    style={[styles.actionButton, styles.deleteButton]}
                >
                    <AppText style={styles.actionText}>Delete</AppText>
                </AppTouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 6,
        marginHorizontal: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    nameContainer: {
        marginBottom: 10,
        backgroundColor: "transparent"
    },
    projectName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10, // for spacing between buttons
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    updateButton: {
        backgroundColor: '#4caf50',
    },
    deleteButton: {
        backgroundColor: '#f44336',
    },
    actionText: {
        color: '#fff',
        fontWeight: '500',
    },
})

export default TaskListItem
