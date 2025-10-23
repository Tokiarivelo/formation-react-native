import { View, FlatList } from 'react-native'
import React, { useCallback } from 'react'
import { TaskResponseCount } from '../../../types/api'
import AppPressable from '../../../components/ui/AppPressable';
import AppText from '../../../components/ui/AppText';
import { useDeleteTaskById } from '../hooks/useTasks';
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TaskStackParamList } from '../../../types/navigation';

type TaskFlatListProps = {
    data: TaskResponseCount[] | undefined;
    navigation: NativeStackNavigationProp<TaskStackParamList>;
}

const TaskFlatList = ({ data, navigation }: TaskFlatListProps) => {
    const { mutate: remove } = useDeleteTaskById();
    const renderItem = useCallback(({ item }: { item: TaskResponseCount }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
                <AppPressable onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}>
                    <AppText>
                        {item.title}
                    </AppText>
                </AppPressable>
                <AppTouchableOpacity onPress={() => navigation.navigate('TaskUpdate', { task: item, projectId: item.projectId })} >
                    <AppText>Update</AppText>
                </AppTouchableOpacity>
                <AppTouchableOpacity style={{ backgroundColor: "red" }} onPress={() => remove(item.id)} >
                    <AppText>Delete</AppText>
                </AppTouchableOpacity>
            </View>
        )
    }, [navigation, remove]);
    return (
        <FlatList data={data} renderItem={renderItem} />
    )
}

export default TaskFlatList