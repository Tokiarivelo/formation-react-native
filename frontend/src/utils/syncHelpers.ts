import { ProjectResponseCount, TaskResponseCount } from "../types/api";

export function mapProjectFromServer(p: ProjectResponseCount) {
    return {
        id: String(p.id),
        name: p.name,
        description: p.description,
        status: p.status,

        start_date: new Date(p.startDate).getTime(),
        end_date: new Date(p.endDate).getTime(),

        created_at: new Date(p.createdAt).getTime(),
        updated_at: new Date(p.updatedAt).getTime(),
        user_id: p.userId
    };
}

export function mapTaskFromServer(t: TaskResponseCount) {
    return {
        id: String(t.id),
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        due_date: new Date(t.dueDate).getTime(),
        created_at: new Date(t.createdAt).getTime(),
        updated_at: new Date(t.updatedAt).getTime(),
        project_id: t.projectId,
        user_id: t.userId
    };
}
