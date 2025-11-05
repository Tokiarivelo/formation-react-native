import { Observable } from "@nozbe/watermelondb/utils/rx";
import { database } from "../../database";
import Task from "../../database/models/Task";
import { useAuthStore } from "../../store/authStore";
import { TaskParams } from "../../types/api";

const userState = useAuthStore.getState().userState;
export const tasksApi_local = {
    async create(taskParams: TaskParams): Promise<Task> {
        const tasksCollection = database.get<Task>('tasks');
        const newTask = await database.write(() => {
            return tasksCollection.create(task => {
                task.title = taskParams.title;
                task.description = taskParams.description;
                task.status = taskParams.status;
                task.priority = taskParams.priority;
                task.projectId = taskParams.projectId ?? "";
                task.userId = userState?.id ?? "";
                task.isDirty = true;
                task.dueDate = new Date(taskParams.dueDate);
                task.createdAt = new Date();
                task.updatedAt = new Date();
            });
        });

        return newTask;
    },

    // async getAll(): Promise<Task[]> {
    //     return await database.get<Task>('tasks').query().fetch();
    // },

    // async get(id: string): Promise<Task> {
    //     return await database.get<Task>('tasks').find(id);
    // },

    getAll(): Observable<Task[]> {
        return database.get<Task>('tasks').query().observe();
    },

    get(id: string): Observable<Task> {
        return database.get<Task>('tasks').findAndObserve(id);
    },

    async update({ id, taskParams }: { id: string, taskParams: TaskParams }): Promise<Task> {
        const task = await database.get<Task>('tasks').find(id);
        const updatedTask = await database.write(() => {
            return task.update(t => {
                t.title = taskParams.title;
                t.description = taskParams.description;
                t.status = taskParams.status;
                t.priority = taskParams.priority;
                t.dueDate = new Date(taskParams.dueDate);
                t.updatedAt = new Date();
                t.isDirty = true;
            })
        })
        return updatedTask;
    },

    async delete(id: string, isPermanent: boolean): Promise<string> {
        const task = await database.get<Task>('tasks').find(id);
        task.delete(isPermanent);
        return "Task marked as deleted";
    }
}