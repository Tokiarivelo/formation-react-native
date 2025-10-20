import { Model } from '@nozbe/watermelondb';
import { field, date, relation, children } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import Project from './Project';
import User from './User';
import Attachment from './Attachment';

export default class Task extends Model {
    static table = 'tasks';
    static associations: Associations = {
        projects: { type: 'belongs_to', key: 'projectId' },
        attachments: { type: 'has_many', foreignKey: 'taskId' },
        user: { type: 'belongs_to', key: 'userId' },
    };

    @field('title') title!: string;
    @field('description') description!: string;
    @field('completed') completed!: boolean;
    @field('priority') priority!: 'low' | 'medium' | 'high' | 'urgent';
    @field('projectId') projectId!: string;
    @field('userId') userId!: string;
    @field('isDirty') isDirty!: boolean;
    @date('dueDate') dueDate?: Date;
    @date('createdAt') createdAt!: Date;
    @date('updatedAt') updatedAt!: Date;

    @relation('projects', 'project_id') project!: Project;
    @relation('users', 'userId') user!: User;

    @children('attachments') attachments!: Attachment[];
}