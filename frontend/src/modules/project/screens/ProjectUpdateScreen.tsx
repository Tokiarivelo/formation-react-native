import { View } from 'react-native'
import React from 'react'
import ProjectForm from '../components/ProjectForm'
import { ProjectStackParamList } from '../../../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const ProjectUpdateScreen = ({ route }: NativeStackScreenProps<ProjectStackParamList, 'ProjectUpdate'>) => {
    const { project } = route.params;
    return (
        <View>
            <ProjectForm isUpdate={true} project={project} />
        </View>
    )
}

export default ProjectUpdateScreen