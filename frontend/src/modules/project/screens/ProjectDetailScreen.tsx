import { View, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import AppText from '../../../components/ui/AppText';
import AppPressable from '../../../components/ui/AppPressable';
import { ProjectStackScreenProps } from '../../../types/navigation';
import { withObservables } from '@nozbe/watermelondb/react';
import { projectsApi_local } from '../localApi';
import { of, switchMap } from '@nozbe/watermelondb/utils/rx';
import User from '../../../database/models/User';
import Project from '../../../database/models/Project';
import Task from '../../../database/models/Task';
import TaskListItem from '../../task/components/TaskListItem';

type Props = ProjectStackScreenProps<'ProjectDetail'> & {
    project: Project,
    user: User | null,
    tasks: Task[] | [],
};

const enhance = withObservables(['route'], ({ route }: ProjectStackScreenProps<'ProjectDetail'>) => {
    const project$ = projectsApi_local.get(route.params.projectId);
    const tasks$ = project$.pipe(
        switchMap(
            (project) => {
                return project ? project.tasks.observe() : of([]);
            }
        )
    )
    const user$ = project$.pipe(
        switchMap(
            (project) => {
                return project ? project.user.observe() : of(null);
            }
        )
    )
    return {
        project: project$,
        user: user$,
        tasks: tasks$
    }
})

const ProjectDetailScreen = ({ navigation, project, user, tasks }: Props) => {
    if (!project) return null;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* PROJECT DETAIL CARD */}
            <View style={styles.card}>
                <AppText style={styles.label}>Project Name</AppText>
                <AppText style={styles.value}>{project.name}</AppText>

                {project.description && (
                    <>
                        <AppText style={styles.label}>Description</AppText>
                        <AppText style={styles.value}>{project.description}</AppText>
                    </>
                )}

                <AppText style={styles.label}>Status</AppText>
                <AppText style={styles.value}>{project.status}</AppText>

                <AppText style={styles.label}>Start Date</AppText>
                <AppText style={styles.value}>
                    {project.startDate?.toLocaleString()}
                </AppText>

                <AppText style={styles.label}>End Date</AppText>
                <AppText style={styles.value}>
                    {project.endDate?.toLocaleString()}
                </AppText>

                <AppText style={styles.label}>Created At</AppText>
                <AppText style={styles.value}>
                    {project.createdAt?.toLocaleString()}
                </AppText>

                <AppText style={styles.label}>Updated At</AppText>
                <AppText style={styles.value}>
                    {project.updatedAt?.toLocaleString()}
                </AppText>

                <AppText style={styles.label}>User</AppText>
                <AppText style={styles.value}>
                    {user?.username} ({user?.email})
                </AppText>
            </View>

            {/* TASK CREATE BUTTON */}
            <AppPressable
                style={styles.button}
                onPress={() =>
                    navigation.navigate('Tasks', {
                        screen: 'TaskCreate',
                        params: { projectId: project.id },
                    })
                }
            >
                <AppText style={styles.buttonText}>Create Task</AppText>
            </AppPressable>

            {/* TASK LIST */}
            {(tasks ?? []).length === 0 ? (
                <AppText>No tasks yet</AppText>
            ) : (
                (tasks ?? []).map(task => (
                    <TaskListItem key={task.id} task={task}
                        onTaskDetail={() => navigation.navigate('Tasks', { screen: 'TaskDetail', params: { taskId: task.id } })}
                        onTaskUpdate={() => navigation.navigate('Tasks', { screen: 'TaskUpdate', params: { taskId: task.id, projectId: project.id } })}
                    />
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f2f2f2',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    label: {
        fontWeight: '600',
        color: '#555',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        color: '#222',
        marginTop: 2,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default enhance(ProjectDetailScreen);
