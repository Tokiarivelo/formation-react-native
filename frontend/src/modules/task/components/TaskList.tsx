import { useCallback } from "react";
import Task from "../../../database/models/Task";
import TaskListItem from "./TaskListItem";
import { FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TaskStackParamList } from "../../../types/navigation";

type Prop = {
    tasks: Task[] | [],
    projectId: string,
};

const TaskList = ({ tasks, projectId }: Prop) => {
    const navigation = useNavigation<NativeStackNavigationProp<TaskStackParamList>>();
    const renderItem = useCallback(({ item }: { item: Task }) => (
        <TaskListItem task={item}
            onTaskDetail={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            onTaskUpdate={() => navigation.navigate('TaskUpdate', { taskId: item.id, projectId: projectId })}
        />
    ), [navigation, projectId]);
    return (
        <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
        />
    )
}

const styles = StyleSheet.create({
    listContainer: {
        paddingBottom: 20,
    },
})

export default TaskList