import { Model } from "@nozbe/watermelondb";
import { children, date, field, relation } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import User from "./User";
import Attachment from "./Attachment";
import Task from "./Task";

export default class Project extends Model {
    static table = 'projects';
    static association: Associations = {
        attachments: { type: 'has_many', foreignKey: 'projectId' },
        tasks: { type: 'has_many', foreignKey: 'projectId' },
        user: { type: 'belongs_to', key: 'userId' },
    }
    @field('name') name!: string;
    @field('description') description?: string;
    @field('status') status!: string;
    @field('userId') userId!: string;
    @field('isDirty') isDirty!: boolean;
    @date('startDate') startDate?: Date;
    @date('endDate') endDate?: Date;
    @date('createdAt') createdAt!: Date;
    @date('updatedAt') updatedAt!: Date;

    @relation('users', 'userId') user!: User;

    @children('tasks') tasks!: Task[];
    @children('attachments') attachments!: Attachment[];
}