import { ProjectStatus } from "../database/models/Project";
import { TaskPriority, TaskStatus } from "../database/models/Task";
import { UserRole } from "../database/models/User";

//AUTH RESPONSE TYPE    
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
    user: User
}


/**
 * ********************** USERS TYPE *****************************
 */
export interface UserCredentials {
    email: string;
    password: string;
    username?: string,
    firstName?: string,
    lastName?: string,
}

export interface User {
    id: string;
    email: string;
    username: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
    role: string,
    createdAt: string,
    updatedAt: string,
}

export type UserParams = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
    role: UserRole,
}

export type UserForeignData = {
    id: string,
    username: string,
    email: string
}

/**
 * ********************** PROJECTS TYPE *****************************
 */
export type ProjectParams = {
    name: string,
    description: string,
    status: ProjectStatus,
    startDate: string,
    endDate: string
}

export interface ProjectData {
    id: string,
    name: string,
    description: string,
    status: ProjectStatus,
    startDate: string,
    endDate: string,
    createdAt: string,
    updatedAt: string,
    userId: string,
    user: UserForeignData,
}

export interface ProjectResponseCount extends ProjectData {
    _count: {
        tasks: number,
        attachments: number
    }
}

export interface ProjectResponseDetail extends ProjectData {
    tasks: TaskData[],
    attachments: Attachment[],
}

type ProjectForeignData = {
    id: string,
    name: string
}


/**
 * ********************** TASKS TYPE *****************************
 */

export type TaskParams = {
    title: string,
    description: string,
    status: TaskStatus,
    priority: TaskPriority,
    dueDate: string,
    projectId?: string,
}

export interface TaskData {
    id: string,
    title: string,
    description: string,
    status: TaskStatus,
    priority: TaskPriority,
    dueDate: string,
    createdAt: string,
    updatedAt: string,
    userId: string,
    projectId: string,
    user: UserForeignData,
    project: ProjectForeignData,
}

export interface TaskResponseCount extends TaskData {
    _count: {
        attachments: number,
    }
}

export interface TaskResponseDetail extends TaskData {
    attachments: Attachment[];
}

export type TaskForeignData = {
    id: string,
    title: string
}

/**
 * ********************** ATTACHMENTS TYPE *****************************
 */
export interface Attachment {
    id: string,
    filename: string,
    originalName: string,
    mimeType: string,
    size: number,
    path: string,
    createdAt: string,
    updatedAt: string,
    userId: string,
    projectId: string,
    taskId: string,
    user: UserForeignData,
    project: ProjectForeignData,
    task: TaskForeignData
}

