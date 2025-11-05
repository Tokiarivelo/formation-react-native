import { Model, Query } from '@nozbe/watermelondb';
import { field, date, relation, children, writer } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import Project from './Project';
import User from './User';
import Attachment from './Attachment';
import { TaskResponseCount } from '../../types/api';
export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export default class Task extends Model {
    static table = 'tasks';
    static associations: Associations = {
        projects: { type: 'belongs_to', key: 'project_id' },
        attachments: { type: 'has_many', foreignKey: 'task_id' },
        users: { type: 'belongs_to', key: 'user_id' },
    };

    @field('title') title!: string;
    @field('description') description!: string;
    @field('status') status!: TaskStatus;
    @field('priority') priority!: TaskPriority;
    @field('project_id') projectId!: string;
    @field('user_id') userId!: string;
    @date('due_date') dueDate?: Date;
    @date('created_at') createdAt!: Date;
    @date('updated_at') updatedAt!: Date;

    @field('is_dirty') isDirty!: boolean;

    @relation('projects', 'project_id') project!: Project;
    @relation('users', 'user_id') user!: User;

    @children('attachments') attachments!: Query<Attachment>;

    @writer async delete(isPermanent: boolean) {
        if (isPermanent) {
            await this.destroyPermanently();
        }
        else {
            await this.markAsDeleted();
        }
    }

    @writer async deleteAndCreate(task: TaskResponseCount) {
        await this.batch(
            this.prepareDestroyPermanently(),
            this.collections.get<Task>('tasks').prepareCreate((rec: Task) => {
                rec._raw.id = task.id;
                rec.title = task.title;
                rec.description = task.description;
                rec.status = task.status;
                rec.priority = task.priority;
                rec.dueDate = new Date(task.dueDate);
                rec.userId = task.userId;
                rec.projectId = task.projectId;
                rec.createdAt = new Date(task.createdAt);
                rec.updatedAt = new Date(task.updatedAt);
                rec.isDirty = false;
                rec._raw._status = "synced";
            })
        )
    }
}