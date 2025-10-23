import { View, FlatList } from 'react-native'
import React, { useCallback } from 'react'
import { useDeleteProjectById, useProjects } from '../hooks/useProjects';
import { ProjectResponseCount } from '../../../types/api';
import AppPressable from '../../../components/ui/AppPressable';
import AppText from '../../../components/ui/AppText';
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProjectStackParamList } from '../../../types/navigation';


const ProjectListScreen = ({ navigation }: NativeStackScreenProps<ProjectStackParamList, 'ProjectList'>) => {
    const { data: projects = [] } = useProjects();
    const { mutate: remove } = useDeleteProjectById();
    const renderItem = useCallback(({ item }: { item: ProjectResponseCount }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
                <AppPressable onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}>
                    <AppText>
                        {item.name}
                    </AppText>
                </AppPressable>
                <AppTouchableOpacity onPress={() => navigation.navigate('ProjectUpdate', { project: item })} >
                    <AppText>Update</AppText>
                </AppTouchableOpacity>
                <AppTouchableOpacity style={{ backgroundColor: "red" }} onPress={() => remove(item.id)} >
                    <AppText>Delete</AppText>
                </AppTouchableOpacity>
            </View>
        )
    }, [navigation, remove]);

    return (
        <View>
            <AppTouchableOpacity onPress={() => navigation.navigate('ProjectCreate')} >
                <AppText>Create New Project</AppText>
            </AppTouchableOpacity>
            <AppText>Project List: </AppText>
            <FlatList data={projects} renderItem={renderItem} />
        </View>
    )
}

export default ProjectListScreen