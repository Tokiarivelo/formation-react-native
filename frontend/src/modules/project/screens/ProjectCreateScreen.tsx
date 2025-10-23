import { View } from 'react-native'
import React from 'react'
import ProjectForm from '../components/ProjectForm'

const ProjectCreateScreen = () => {
    return (
        <View>
            <ProjectForm isUpdate={false} />
        </View>
    )
}

export default ProjectCreateScreen