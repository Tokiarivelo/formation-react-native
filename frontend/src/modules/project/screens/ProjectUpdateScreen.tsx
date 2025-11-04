import { View } from 'react-native'
import React from 'react'
import ProjectForm from '../components/ProjectForm'
import { ProjectStackScreenProps } from '../../../types/navigation';
import { withObservables } from '@nozbe/watermelondb/react';
import { projectsApi_local } from '../localApi';
import Project from '../../../database/models/Project';

type Prop = ProjectStackScreenProps<'ProjectUpdate'> & {
    project: Project,
};

const enhance = withObservables(['route'], ({ route }: ProjectStackScreenProps<'ProjectUpdate'>) => ({
    project: projectsApi_local.get(route.params.projectId),
}))

const ProjectUpdateScreen = ({ project }: Prop) => {
    return (
        <View>
            <ProjectForm isUpdate={true} project={project} />
        </View>
    )
}

export default enhance(ProjectUpdateScreen)