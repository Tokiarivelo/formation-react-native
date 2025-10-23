import { View } from 'react-native'
import React from 'react'
import { useProjectById } from '../hooks/useProjects';
import AppText from '../../../components/ui/AppText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProjectStackParamList } from '../../../types/navigation';

const ProjectDetailScreen = ({ route }: NativeStackScreenProps<ProjectStackParamList, 'ProjectDetail'>) => {
    const { projectId } = route.params;
    const { data: project } = useProjectById(projectId);
    return (
        <View>
            <AppText>project id: {project?.id}</AppText>
            <AppText>project name: {project?.name}</AppText>
            <AppText>project description: {project?.description}</AppText>
            <AppText>project status: {project?.status}</AppText>
            <AppText>project startDate: {project?.startDate}</AppText>
            <AppText>project endDate: {project?.endDate}</AppText>
            <AppText>project createdAt: {project?.createdAt}</AppText>
            <AppText>project updatedAt: {project?.updatedAt}</AppText>
            <AppText>project userId: {project?.userId}</AppText>
            <AppText>project user email: {project?.user.email}</AppText>
            <AppText>project user name: {project?.user.username}</AppText>
        </View>
    )
}

export default ProjectDetailScreen