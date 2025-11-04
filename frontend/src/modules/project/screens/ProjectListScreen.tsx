import { View, FlatList, StyleSheet } from 'react-native'
import React, { useCallback } from 'react'
import AppText from '../../../components/ui/AppText';
import AppTouchableOpacity from '../../../components/ui/AppTouchableOpacity';
import { ProjectStackScreenProps } from '../../../types/navigation';
import Project from '../../../database/models/Project';
import ProjectListItem from '../components/ProjectListItem';
import { withObservables } from '@nozbe/watermelondb/react'
import { projectsApi_local } from '../localApi';


type Props = ProjectStackScreenProps<'ProjectList'> & {
    projects: Project[];
};

const enhance = withObservables([], () => ({
    projects: projectsApi_local.getAll(),
}))

const ProjectListScreen = ({ navigation, projects }: Props) => {

    const renderItem = useCallback(({ item }: { item: Project }) => (
        <ProjectListItem project={item}
            onProjectDetail={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
            onProjectUpdate={() => navigation.navigate('ProjectUpdate', { projectId: item.id })}
        />
    ), [navigation]);

    return (
        <View style={styles.container}>
            {/* CREATE PROJECT BUTTON */}
            <AppTouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('ProjectCreate')}
            >
                <AppText style={styles.createButtonText}>+ Create New Project</AppText>
            </AppTouchableOpacity>


            {/* DISPLAY PROJECT LIST WITH FLATLIST */}
            {projects.length === 0 ? (
                <AppText style={styles.emptyText}>No projects yet. Create one above!</AppText>
            ) : (
                <FlatList
                    data={projects}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}


            {/* GO TO TASK LIST BUTTON */}
            <AppTouchableOpacity
                style={styles.tasksButton}
                onPress={() => navigation.navigate('Tasks', { screen: 'TaskList' })}
            >
                <AppText style={styles.tasksButtonText}>Go to all Tasks</AppText>
            </AppTouchableOpacity>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
        paddingBottom: 80, // space for bottom tabs
    },
    createButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    listContainer: {
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
        marginTop: 20,
    },
    tasksButton: {
        backgroundColor: '#2196f3',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    tasksButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})

export default enhance(ProjectListScreen)
