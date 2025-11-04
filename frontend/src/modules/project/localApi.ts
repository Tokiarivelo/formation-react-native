import { Observable } from "@nozbe/watermelondb/utils/rx";
import { database } from "../../database";
import Project from "../../database/models/Project";
import { useAuthStore } from "../../store/authStore";
import { ProjectParams } from "../../types/api";

const userState = useAuthStore.getState().userState;
export const projectsApi_local = {
    async create(projectParams: ProjectParams): Promise<Project> {
        const projectsCollection = database.get<Project>('projects');
        const newProject = await database.write(() => {
            return projectsCollection.create((project: Project) => {
                project.name = projectParams.name;
                project.description = projectParams.description;
                project.status = projectParams.status;
                project.startDate = new Date(projectParams.startDate);
                project.endDate = new Date(projectParams.endDate);
                project.userId = userState?.id || "";
                project.isDirty = true;
                project.createdAt = new Date();
                project.updatedAt = new Date();
            });
        });
        return newProject;
    },

    // async getAll(): Promise<Project[]> {
    //     return await database.get<Project>('projects').query().fetch();
    // },

    getAll(): Observable<Project[]> {
        return database.get<Project>('projects').query().observe();
    },

    // async get(id: string): Promise<Project> {
    //     return await database.get<Project>('projects').find(id);
    // },
    get(id: string): Observable<Project> {
        return database.get<Project>('projects').findAndObserve(id);
    },

    async update({ id, projectParams }: { id: string, projectParams: ProjectParams }): Promise<Project> {
        const project = await database.get<Project>('projects').find(id)
        const updatedProject = await database.write(() => {
            return project.update(p => {
                p.name = projectParams.name;
                p.description = projectParams.description;
                p.status = projectParams.status;
                p.startDate = new Date(projectParams.startDate);
                p.endDate = new Date(projectParams.endDate);
                p.isDirty = true;
                p.updatedAt = new Date();
            })
        })
        return updatedProject;
    },

    async delete(id: string, isPermanent: boolean): Promise<string> {
        const project = await database.get<Project>('projects').find(id)
        project.delete(isPermanent);
        return "Project marked as deleted";
    }
}