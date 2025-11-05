import NetInfo from '@react-native-community/netinfo';
import { projectsApi } from '../modules/project/api';
import { tasksApi } from '../modules/task/api';
import { database } from '../database';
import Project from '../database/models/Project';
import Task from '../database/models/Task';
import User, { UserRole } from '../database/models/User';
import { usersApi } from '../modules/user/api';


import { synchronize } from '@nozbe/watermelondb/sync'
import { mapProjectFromServer, mapTaskFromServer } from '../utils/syncHelpers';
import { useEffect, useState } from 'react';
import { projectsApi_local } from '../modules/project/localApi';
import { tasksApi_local } from '../modules/task/localApi';
import { Q } from '@nozbe/watermelondb';

export async function mySync() {
    await synchronize({
        database,
        pullChanges: async ({ lastPulledAt }) => {
            const projects = await projectsApi.getAll();
            const tasks = await tasksApi.getAll();
            const localProjects = await database.get<Project>('projects').query(Q.where('_status', Q.notEq('created'))).fetch();
            const localTasks = await database.get<Task>('tasks').query(Q.where('_status', Q.notEq('created'))).fetch();
            const lastPull = lastPulledAt || 0;

            //map server project to have same column names as local database
            const mappedProjects = projects.map(mapProjectFromServer);
            const mappedTasks = tasks.map(mapTaskFromServer);

            const serverProjectIds = new Set(projects.map(p => p.id));
            const deletedProjectIds = localProjects
                .filter(p => {
                    return !serverProjectIds.has(p.id) && (p._raw._status === "synced")
                })
                .map(p => p.id);

            const serverTaskIds = new Set(tasks.map(p => p.id));
            const deletedTaskIds = localTasks
                .filter(t => {
                    return !serverTaskIds.has(t.id) && (t._raw._status === "synced")
                })
                .map(t => t.id);

            // Filter for changes since last sync
            const changedProjects = mappedProjects.filter(
                (p) => new Date(p.updated_at).getTime() > lastPull
            )
            const changedTasks = mappedTasks.filter(
                (t) => new Date(t.updated_at).getTime() > lastPull
            );

            // WatermelonDB expects this format:
            return {
                changes: {
                    projects: {
                        created: changedProjects.filter(p => (new Date(p.created_at).getTime() > lastPull + 1500)), // 1500 threshold created_at server
                        updated: changedProjects.filter(p => new Date(p.created_at).getTime() <= lastPull),
                        deleted: deletedProjectIds
                    },
                    tasks: {
                        created: changedTasks.filter(t => new Date(t.created_at).getTime() > lastPull + 1500), //1500 threshold created_at server
                        updated: changedTasks.filter(t => new Date(t.created_at).getTime() <= lastPull),
                        deleted: deletedTaskIds
                    }
                },
                timestamp: Date.now()
            };
        },
        pushChanges: async ({ changes }) => {
            // Push local changes to server
            for (const project of changes.projects.created) {
                const projectParams = {
                    name: project.name,
                    description: project.description,
                    status: project.status,
                    startDate: new Date(project.start_date).toISOString(),
                    endDate: new Date(project.end_date).toISOString(),
                }
                const remoteProject = await projectsApi.create(projectParams);
                const projectModel = await database.get<Project>('projects').find(project.id);
                projectModel.deleteAndCreate(remoteProject);
            }
            for (const project of changes.projects.updated) {
                const projectParams = {
                    name: project.name,
                    description: project.description,
                    status: project.status,
                    startDate: new Date(project.start_date).toISOString(),
                    endDate: new Date(project.end_date).toISOString(),
                }
                await projectsApi.update({ id: project.id, projectParams });
            }
            for (const projectId of changes.projects.deleted) {
                try {
                    await projectsApi.delete(projectId);
                }
                catch {

                }
                finally {
                    await projectsApi_local.delete(projectId, true);
                }
            }

            // Same for tasks
            for (const task of changes.tasks.created) {
                const taskParams = {
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    dueDate: new Date(task.due_date).toISOString(),
                    projectId: task.project_id
                }
                const remoteTask = await tasksApi.create(taskParams);
                const taskModel = await database.get<Task>('tasks').find(task.id);
                taskModel.deleteAndCreate(remoteTask);
            }
            for (const task of changes.tasks.updated) {
                const taskParams = {
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    dueDate: new Date(task.due_date).toISOString(),
                    projectId: task.project_id
                }
                await tasksApi.update({ id: task.id, taskParams });
            }
            for (const taskId of changes.tasks.deleted) {
                try {
                    await tasksApi.delete(taskId);
                }
                catch {

                }
                finally {
                    await tasksApi_local.delete(taskId, true);
                }
            }
        },
    })
}

export async function upsertAuthUser(): Promise<void> {
    const user = await usersApi.getMe();
    const userCollection = database.get<User>('users');
    await database.write(async () => {
        const serverId = String(user.id);
        let existing: User | null = null;
        try {
            existing = await userCollection.find(serverId);
        }
        catch {
            existing = null;
        }
        if (existing) {
            return await existing.update((rec: User) => {
                rec.username = user.username;
                rec.email = user.email;
                rec.firstName = user.firstName;
                rec.lastName = user.lastName;
                rec.isActive = user.isActive;
                rec.role = user.role as UserRole;
                rec.updatedAt = new Date(user.updatedAt);

            });
        }
        else {
            return await userCollection.create((rec: User) => {
                rec._raw.id = user.id;
                rec.username = user.username;
                rec.email = user.email;
                rec.firstName = user.firstName;
                rec.lastName = user.lastName;
                rec.isActive = user.isActive;
                rec.role = user.role as UserRole;
                rec.updatedAt = new Date(user.updatedAt);
                rec.createdAt = new Date(user.createdAt);
            })
        }
    })
}

export function useNetworkStatus() {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected ?? false);
        });

        return () => unsubscribe();
    }, []);

    return isConnected;
}