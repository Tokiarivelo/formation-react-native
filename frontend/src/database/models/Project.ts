import { Model } from "@nozbe/watermelondb";
import { children, date, field, relation, writer } from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import User from "./User";
import Attachment from "./Attachment";
import Task from "./Task";
import { ProjectResponseCount } from "../../types/api";

export enum ProjectStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    ON_HOLD = 'ON_HOLD',
}
export default class Project extends Model {
    static table = 'projects';
    static associations: Associations = {
        attachments: { type: 'has_many', foreignKey: 'project_id' },
        tasks: { type: 'has_many', foreignKey: 'project_id' },
        users: { type: 'belongs_to', key: 'user_id' },
    }
    @field('name') name!: string;
    @field('description') description?: string;
    @field('status') status!: ProjectStatus;
    @field('user_id') userId!: string;
    @date('start_date') startDate?: Date;
    @date('end_date') endDate?: Date;
    @date('created_at') createdAt!: Date;
    @date('updated_at') updatedAt!: Date;

    @field('is_dirty') isDirty!: boolean;

    @relation('users', 'user_id') user!: User;

    @children('tasks') tasks!: Task[];
    @children('attachments') attachments!: Attachment[];

    @writer async delete(isPermanent: boolean) {
        if (isPermanent) {
            await this.destroyPermanently();
        }
        else {
            await this.markAsDeleted();
        }
    }

    @writer async deleteAndCreate(project: ProjectResponseCount) {
        await this.batch(
            this.prepareDestroyPermanently(),
            this.collections.get<Project>('projects').prepareCreate((rec: Project) => {
                rec._raw.id = project.id;
                rec.name = project.name;
                rec.description = project.description;
                rec.status = project.status;
                rec.userId = project.userId;
                rec.startDate = new Date(project.startDate);
                rec.endDate = new Date(project.endDate);
                rec.createdAt = new Date(project.createdAt);
                rec.updatedAt = new Date(project.updatedAt);
                rec.isDirty = false;
            })
        )
    }
}
