import { Model } from '@nozbe/watermelondb'
import { field, date, children } from '@nozbe/watermelondb/decorators'
import { Associations } from '@nozbe/watermelondb/Model';
import Project from './Project';
import { Task } from 'react-native';
import Attachment from './Attachment';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export default class User extends Model {
    static table = 'users'
    static associations: Associations = {
        projects: { type: 'has_many', foreignKey: 'userId' },
        tasks: { type: 'has_many', foreignKey: 'userId' },
        attachments: { type: 'has_many', foreignKey: 'userId' },
    };

    // Basic user fields (match these names/types with schema.ts)
    @field('username') username!: string
    @field('email') email!: string
    @field('password') password!: string;
    @field('firstName') firstName?: string;
    @field('lastName') lastName?: string;
    @field('isActive') isActive!: boolean;
    @field('role') role!: UserRole;
    @date('createdAt') createdAt!: Date;
    @date('updatedAt') updatedAt!: Date;

    @date('isDirty') isDirty!: Date;

    @children('projects') projects!: Project[];
    @children('tasks') tasks!: Task[];
    @children('attachments') attachments!: Attachment[];
}