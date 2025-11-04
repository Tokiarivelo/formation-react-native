import { Model } from "@nozbe/watermelondb";
import { date, field, relation } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import Project from "./Project";
import Task from "./Task";
import User from "./User";

export default class Attachment extends Model {
    static table = 'attachments';
    static associations: Associations = {
        projects: { type: 'belongs_to', key: 'project_id' },
        tasks: { type: 'belongs_to', key: 'task_id' },
        users: { type: 'belongs_to', key: 'user_id' },
    };

    @field('filename') filename!: string;
    @field('original_name') originalName!: string;
    @field('mime_type') mimeType!: string;
    @field('size') size!: number;
    @field('path') path!: string;
    @field('project_id') projectId?: string;
    @field('task_id') taskId?: string;
    @field('user_id') userId!: string;
    @date('created_at') createdAt!: Date;
    @date('updated_at') updatedAt!: Date;

    @field('is_dirty') isDirty!: boolean;

    @relation('projects', 'project_id') project!: Project;
    @relation('tasks', 'task_id') task!: Task;
    @relation('users', 'user_id') user!: User;
}
