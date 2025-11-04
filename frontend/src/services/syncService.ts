import NetInfo from '@react-native-community/netinfo';
//import { Q } from '@nozbe/watermelondb';
import { projectsApi } from '../modules/project/api';
import { tasksApi } from '../modules/task/api';
//import { attachmentsApi } from '../modules/attachment/api';
import { Platform } from 'react-native';
import { database } from '../database';
import { ProjectResponseCount, TaskResponseCount, User as UserReponse } from '../types/api';
import Project from '../database/models/Project';
import Task from '../database/models/Task';
import User, { UserRole } from '../database/models/User';
import { usersApi } from '../modules/user/api';

/**
 * Sync strategy (no remote_id column):
 * - When fetching from server, create local records using server id as WatermelonDB id:
 *     rec._raw.id = serverId
 * - When pushing local changes:
 *   - Try update by local id (assumes record.id is server id). If update 404 -> create on server
 *     and replace local temp record with server-id record.
 * - Tables have is_dirty/is_deleted flags so local offline changes are preserved.
 */

let unsubscribeNetInfo: (() => void) | null = null;

// function isoToTimestamp(iso?: string | number | Date): number | undefined {
//     if (!iso) return undefined;
//     const d = new Date(iso);
//     return isNaN(d.getTime()) ? undefined : d.getTime();
// }

async function upsertProjects(serverProjects: ProjectResponseCount[]) {
    const projectsCollection = database.get<Project>('projects');
    await database.write(async () => {
        for (const p of serverProjects) {
            const serverId = p.id;
            let existing: Project | null = null;
            try {
                existing = await projectsCollection.find(serverId);
            } catch {
                existing = null;
            }

            if (existing) {
                await existing.update((rec: Project) => {
                    rec.name = p.name;
                    rec.description = p.description;
                    rec.status = p.status;
                    rec.startDate = new Date(p.startDate);
                    rec.endDate = new Date(p.endDate);
                    rec.userId = p.userId;
                    rec.updatedAt = new Date(p.updatedAt);
                });
            } else {
                await projectsCollection.create((rec: Project) => {
                    // use server id as local id
                    rec._raw.id = serverId;
                    rec.name = p.name;
                    rec.description = p.description;
                    rec.status = p.status;
                    rec.userId = p.userId;
                    rec.startDate = new Date(p.startDate);
                    rec.endDate = new Date(p.endDate);
                    rec.createdAt = new Date(p.createdAt);
                    rec.updatedAt = new Date(p.updatedAt);
                });
            }
        }
    });
}

async function upsertTasks(serverTasks: TaskResponseCount[]) {
    const tasksCollection = database.get<Task>('tasks');
    await database.write(async () => {
        for (const t of serverTasks) {
            const serverId = String(t.id);
            let existing: Task | null = null;
            try {
                existing = await tasksCollection.find(serverId);
            } catch {
                existing = null;
            }

            if (existing) {
                await existing.update((rec: Task) => {
                    rec.title = t.title;
                    rec.description = t.description ?? null;
                    rec.status = t.status;
                    rec.priority = t.priority;
                    rec.projectId = t.projectId;
                    rec.userId = t.userId;
                    rec.dueDate = new Date(t.dueDate);
                    rec.updatedAt = new Date(t.updatedAt);
                });
            } else {
                await tasksCollection.create((rec: Task) => {
                    rec._raw.id = serverId;
                    rec.title = t.title;
                    rec.description = t.description ?? null;
                    rec.status = t.status;
                    rec.priority = t.priority;
                    rec.projectId = t.projectId;
                    rec.userId = t.userId;
                    rec.dueDate = new Date(t.dueDate);
                    rec.updatedAt = new Date(t.updatedAt);
                    rec.createdAt = new Date(t.createdAt);
                });
            }
        }
    });
}

// async function upsertAttachments(serverAttachments: any[]) {
//     const attachmentsCollection = database.collections.get('attachments');
//     await database.write(async () => {
//         for (const a of serverAttachments) {
//             const serverId = String(a.id);
//             let existing: any | null = null;
//             try {
//                 existing = await attachmentsCollection.find(serverId);
//             } catch {
//                 existing = null;
//             }

//             if (existing) {
//                 await existing.update((rec: any) => {
//                     rec.filename = a.filename;
//                     rec.original_name = a.originalName ?? a.original_name;
//                     rec.mime_type = a.mimeType ?? a.mime_type;
//                     rec.size = a.size;
//                     rec.path = a.path;
//                     rec.project_id = a.projectId ?? a.project_id;
//                     rec.task_id = a.taskId ?? a.task_id;
//                     rec.user_id = a.userId ?? a.user_id;
//                     rec.is_dirty = false;
//                     rec.is_deleted = false;
//                     rec._raw.updated_at = isoToTimestamp(a.updatedAt ?? a.updated_at) ?? Date.now();
//                     rec._raw.last_synced_at = Date.now();
//                 });
//             } else {
//                 await attachmentsCollection.create((rec: any) => {
//                     rec._raw.id = serverId;
//                     rec.filename = a.filename;
//                     rec.original_name = a.originalName ?? a.original_name ?? null;
//                     rec.mime_type = a.mimeType ?? a.mime_type ?? null;
//                     rec.size = a.size;
//                     rec.path = a.path;
//                     rec.project_id = a.projectId ?? a.project_id ?? null;
//                     rec.task_id = a.taskId ?? a.task_id ?? null;
//                     rec.user_id = a.userId ?? a.user_id ?? null;
//                     rec.is_dirty = false;
//                     rec.is_deleted = false;
//                     rec._raw.created_at = isoToTimestamp(a.createdAt ?? a.created_at) ?? Date.now();
//                     rec._raw.updated_at = isoToTimestamp(a.updatedAt ?? a.updated_at) ?? Date.now();
//                     rec._raw.last_synced_at = Date.now();
//                 });
//             }
//         }
//     });
// }

async function upsertAuthUser(user: UserReponse): Promise<void> {
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

async function fetchAllFromServer() {
    try {
        const [projects, tasks, user] = await Promise.all([
            projectsApi.getAll().catch(() => []),
            tasksApi.getAll().catch(() => []),
            usersApi.getMe().catch(),
            //attachmentsApi.getAll().catch(() => []),
        ]);

        await upsertProjects(projects);
        await upsertTasks(tasks);
        await upsertAuthUser(user);
        //await upsertAttachments(attachments);
    } catch (err) {
        console.warn('fetchAllFromServer failed', err);
    }
}

/**
 * Push local changes:
 * - For records with is_deleted === true: try delete on server (id == local id), then destroy local.
 * - For other dirty records:
 *    * Try update using local.id (works for server-origin records).
 *    * If update fails (404), create on server and replace local record with server-id record.
 */
// async function pushLocalChanges() {
//     try {
//         // Projects
//         const projectsCollection = database.collections.get('projects');
//         const dirtyProjects = await projectsCollection.query(Q.where('is_dirty', true)).fetch();
//         for (const p of dirtyProjects) {
//             const raw = (p as any)._raw;
//             if (raw.is_deleted) {
//                 try {
//                     await projectsApi.delete(p.id);
//                 } catch {
//                     // ignore 404 etc.
//                 }
//                 await database.write(async () => {
//                     await p.destroyPermanently();
//                 });
//                 continue;
//             }

//             // Try update on server using local id
//             try {
//                 const payload = {
//                     name: (p as any).name,
//                     description: (p as any).description,
//                     status: (p as any).status,
//                     startDate: (p as any).start_date,
//                     endDate: (p as any).end_date,
//                 };
//                 const res = await projectsApi.update({ id: p.id, projectParams: payload });
//                 // success -> mark not dirty
//                 await database.write(async () => {
//                     await p.update((rec: any) => {
//                         rec.is_dirty = false;
//                         rec._raw.updated_at = isoToTimestamp(res.updatedAt) ?? Date.now();
//                         rec._raw.last_synced_at = Date.now();
//                     });
//                 });
//             } catch {
//                 // if update failed (likely 404), create on server then replace local record
//                 try {
//                     const payload = {
//                         name: (p as any).name,
//                         description: (p as any).description,
//                         status: (p as any).status,
//                         startDate: (p as any).start_date,
//                         endDate: (p as any).end_date,
//                     };
//                     const res = await projectsApi.create(payload);
//                     // create a new local record with server id and copy fields, then remove old local one
//                     await database.write(async () => {
//                         await projectsCollection.create((rec: any) => {
//                             rec._raw.id = String(res.id);
//                             rec.name = res.name ?? payload.name;
//                             rec.description = res.description ?? payload.description ?? null;
//                             rec.status = res.status ?? payload.status;
//                             // map start/end dates when server returns them
//                             rec._raw.start_date = isoToTimestamp(res.startDate) ?? null;
//                             rec._raw.end_date = isoToTimestamp(res.endDate) ?? null;
//                             rec.is_dirty = false;
//                             rec.is_deleted = false;
//                             rec._raw.created_at = isoToTimestamp(res.createdAt) ?? Date.now();
//                             rec._raw.updated_at = isoToTimestamp(res.updatedAt) ?? Date.now();
//                             rec._raw.last_synced_at = Date.now();
//                         });
//                         await p.destroyPermanently();
//                     });
//                 } catch (createErr) {
//                     console.warn('create project on server failed', createErr);
//                 }
//             }
//         }

//         // Tasks (same pattern)
//         const tasksCollection = database.collections.get('tasks');
//         const dirtyTasks = await tasksCollection.query(Q.where('is_dirty', true)).fetch();
//         for (const t of dirtyTasks) {
//             const raw = (t as any)._raw;
//             if (raw.is_deleted) {
//                 try {
//                     await tasksApi.delete(t.id);
//                 } catch { }
//                 await database.write(async () => {
//                     await t.destroyPermanently();
//                 });
//                 continue;
//             }

//             try {
//                 const payload = {
//                     title: (t as any).title,
//                     description: (t as any).description,
//                     status: (t as any).status,
//                     priority: (t as any).priority,
//                     dueDate: (t as any).due_date,
//                     projectId: (t as any).project_id,
//                 };
//                 const res = await tasksApi.update({ id: t.id, taskParams: payload });
//                 await database.write(async () => {
//                     await t.update((rec: any) => {
//                         rec.is_dirty = false;
//                         rec._raw.updated_at = isoToTimestamp(res.updatedAt) ?? Date.now();
//                         rec._raw.last_synced_at = Date.now();
//                     });
//                 });
//             } catch {
//                 try {
//                     const payload = {
//                         title: (t as any).title,
//                         description: (t as any).description,
//                         status: (t as any).status,
//                         priority: (t as any).priority,
//                         projectId: (t as any).project_id,
//                         dueDate: (t as any).due_date,
//                     };
//                     const res = await tasksApi.create(payload);
//                     await database.write(async () => {
//                         await tasksCollection.create((rec: any) => {
//                             rec._raw.id = String(res.id);
//                             rec.title = res.title ?? payload.title;
//                             rec.description = res.description ?? payload.description ?? null;
//                             rec.status = res.status ?? payload.status;
//                             rec.priority = res.priority ?? payload.priority;
//                             rec.project_id = res.projectId ?? payload.projectId ?? null;
//                             // map due date when server returns it
//                             rec._raw.due_date = isoToTimestamp(res.dueDate) ?? null;
//                             rec.is_dirty = false;
//                             rec.is_deleted = false;
//                             rec._raw.created_at = isoToTimestamp(res.createdAt) ?? Date.now();
//                             rec._raw.updated_at = isoToTimestamp(res.updatedAt) ?? Date.now();
//                             rec._raw.last_synced_at = Date.now();
//                         });
//                         await t.destroyPermanently();
//                     });
//                 } catch (createErr) {
//                     console.warn('create task on server failed', createErr);
//                 }
//             }
//         }

//         // Attachments
//         // const attachmentsCollection = database.collections.get('attachments');
//         // const dirtyAttachments = await attachmentsCollection.query(Q.where('is_dirty', true)).fetch();
//         // for (const a of dirtyAttachments) {
//         //     const raw = (a as any)._raw;
//         //     if (raw.is_deleted) {
//         //         try {
//         //             await attachmentsApi.deleteById(a.id);
//         //         } catch (e) { }
//         //         await database.write(async () => {
//         //             await a.destroyPermanently();
//         //         });
//         //         continue;
//         //     }

//         //     try {
//         //         const payload = {
//         //             filename: (a as any).filename,
//         //             originalName: (a as any).original_name,
//         //             mimeType: (a as any).mime_type,
//         //             size: (a as any).size,
//         //             path: (a as any).path,
//         //             userId: (a as any).user_id,
//         //             projectId: (a as any).project_id,
//         //             taskId: (a as any).task_id,
//         //         };
//         //         const res = await attachmentsApi.updateById({ id: a.id, attachmentParams: payload });
//         //         await database.write(async () => {
//         //             await a.update((rec: any) => {
//         //                 rec.is_dirty = false;
//         //                 rec._raw.updated_at = isoToTimestamp(res.updatedAt ?? res.updated_at) ?? Date.now();
//         //                 rec._raw.last_synced_at = Date.now();
//         //             });
//         //         });
//         //     } catch (err) {
//         //         try {
//         //             const payload = {
//         //                 filename: (a as any).filename,
//         //                 originalName: (a as any).original_name,
//         //                 mimeType: (a as any).mime_type,
//         //                 size: (a as any).size,
//         //                 path: (a as any).path,
//         //                 userId: (a as any).user_id,
//         //                 projectId: (a as any).project_id,
//         //                 taskId: (a as any).task_id,
//         //             };
//         //             const res = await attachmentsApi.create(payload);
//         //             await database.write(async () => {
//         //                 await attachmentsCollection.create((rec: any) => {
//         //                     rec._raw.id = String(res.id);
//         //                     rec.filename = res.filename ?? payload.filename;
//         //                     rec.original_name = res.originalName ?? payload.originalName ?? null;
//         //                     rec.mime_type = res.mimeType ?? payload.mimeType ?? null;
//         //                     rec.size = res.size ?? payload.size;
//         //                     rec.path = res.path ?? payload.path;
//         //                     rec.project_id = res.projectId ?? payload.projectId ?? null;
//         //                     rec.task_id = res.taskId ?? payload.taskId ?? null;
//         //                     rec.user_id = res.userId ?? payload.userId ?? null;
//         //                     rec.is_dirty = false;
//         //                     rec.is_deleted = false;
//         //                     rec._raw.created_at = isoToTimestamp(res.createdAt ?? res.created_at) ?? Date.now();
//         //                     rec._raw.updated_at = isoToTimestamp(res.updatedAt ?? res.updated_at) ?? Date.now();
//         //                     rec._raw.last_synced_at = Date.now();
//         //                 });
//         //                 await a.destroyPermanently();
//         //             });
//         //         } catch (createErr) {
//         //             console.warn('create attachment on server failed', createErr);
//         //         }
//         //     }
//         // }
//     } catch (err) {
//         console.warn('pushLocalChanges failed', err);
//     }
// }

export async function syncNow() {
    try {
        //await pushLocalChanges();
        await fetchAllFromServer();
    } catch (err) {
        console.warn('syncNow error', err);
    }
}

export function startAutoSync() {
    if (unsubscribeNetInfo) return;
    unsubscribeNetInfo = NetInfo.addEventListener((state: any) => {
        if (state.isConnected) {
            const delay = Platform.OS === 'android' ? 500 : 200;
            setTimeout(() => {
                syncNow().catch(e => console.warn('auto sync error', e));
            }, delay);
        }
    });
}

export function stopAutoSync() {
    if (unsubscribeNetInfo) {
        unsubscribeNetInfo();
        unsubscribeNetInfo = null;
    }
}