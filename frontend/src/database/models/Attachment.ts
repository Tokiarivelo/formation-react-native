import { Model } from "@nozbe/watermelondb";
import { date, field, relation } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import Project from "./Project";
import Task from "./Task";
import User from "./User";

export default class Attachment extends Model {
    static table = 'attachments';
    static associations: Associations = {
        projects: { type: 'belongs_to', key: 'projectId' },
        tasks: { type: 'belongs_to', key: 'taskId' },
        users: { type: 'belongs_to', key: 'userId' },
    };

    @field('filename') filename!: string;
    @field('originalName') originalName!: string;
    @field('mimeType') mimeType!: string;
    @field('size') size!: number;
    @field('path') path!: string;
    @field('projectId') projectId!: string;
    @field('taskId') taskId!: string;
    @field('userId') userId!: string;
    @field('isDirty') isDirty!: boolean;
    @date('createdAt') createdAt!: Date;
    @date('updatedAt') updatedAt!: Date;

    @relation('projects', 'projectId') project!: Project;
    @relation('tasks', 'taskId') task!: Task;
    @relation('users', 'userId') user!: User;
}