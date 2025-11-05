import { Model, Query } from '@nozbe/watermelondb'
import { field, date, children } from '@nozbe/watermelondb/decorators'
import { Associations } from '@nozbe/watermelondb/Model';
import Project from './Project';
import Attachment from './Attachment';
import Task from './Task';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export default class User extends Model {
    static table = 'users'
    static associations: Associations = {
        projects: { type: 'has_many', foreignKey: 'user_id' },
        tasks: { type: 'has_many', foreignKey: 'user_id' },
        attachments: { type: 'has_many', foreignKey: 'user_id' },
    };

    // Basic user fields (match these names/types with schema.ts)
    @field('username') username!: string
    @field('email') email!: string
    @field('password') password!: string;
    @field('first_name') firstName?: string;
    @field('last_name') lastName?: string;
    @field('is_active') isActive!: boolean;
    @field('role') role!: UserRole;
    @date('created_at') createdAt!: Date;
    @date('updated_at') updatedAt!: Date;

    @field('is_dirty') isDirty!: boolean;

    @children('projects') projects!: Query<Project>;
    @children('tasks') tasks!: Query<Task>;
    @children('attachments') attachments!: Query<Attachment>;
}
