/**
 * Modèle Project WatermelonDB
 * Correspond au modèle Project du schéma Prisma
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, relation, writer } from '@nozbe/watermelondb/decorators';
import User from './User';
import Task from './Task';
import Attachment from './Attachment';

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';

export default class Project extends Model {
  static table = 'projects';
  
  static associations = {
    user: { type: 'belongs_to', key: 'user_id' },
    tasks: { type: 'has_many', key: 'project_id' },
    attachments: { type: 'has_many', key: 'project_id' },
  };

  // Champs de base
  @field('name') name!: string;
  @field('description') description!: string | null;
  @field('status') status!: ProjectStatus;
  @date('start_date') startDate?: Date;
  @date('end_date') endDate?: Date;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
  @field('user_id') userId!: string;

  // Champs de synchronisation
  @field('is_dirty') isDirty!: boolean;
  @date('last_sync_at') lastSyncAt?: Date;

  // Relations
  @relation('users', 'user_id') user!: User;
  @relation('tasks', 'project_id') tasks!: any;
  @relation('attachments', 'project_id') attachments!: any;

  // Méthodes business
  @writer async updateProject(updates: {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    startDate?: Date;
    endDate?: Date;
  }) {
    await this.update((project) => {
      if (updates.name !== undefined) project.name = updates.name;
      if (updates.description !== undefined) project.description = updates.description;
      if (updates.status !== undefined) project.status = updates.status;
      if (updates.startDate !== undefined) project.startDate = updates.startDate;
      if (updates.endDate !== undefined) project.endDate = updates.endDate;
      project.isDirty = true;
      project.updatedAt = new Date();
    });
  }

  @writer async changeStatus(status: ProjectStatus) {
    await this.update((project) => {
      project.status = status;
      project.isDirty = true;
      project.updatedAt = new Date();
    });
  }

  @writer async complete() {
    await this.update((project) => {
      project.status = 'COMPLETED';
      project.endDate = new Date();
      project.isDirty = true;
      project.updatedAt = new Date();
    });
  }

  @writer async cancel() {
    await this.update((project) => {
      project.status = 'CANCELLED';
      project.isDirty = true;
      project.updatedAt = new Date();
    });
  }

  @writer async putOnHold() {
    await this.update((project) => {
      project.status = 'ON_HOLD';
      project.isDirty = true;
      project.updatedAt = new Date();
    });
  }

  @writer async resume() {
    await this.update((project) => {
      project.status = 'ACTIVE';
      project.isDirty = true;
      project.updatedAt = new Date();
    });
  }

  @writer async markAsSynced() {
    await this.update((project) => {
      project.isDirty = false;
      project.lastSyncAt = new Date();
    });
  }

  // Getters utiles
  get isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  get isCompleted(): boolean {
    return this.status === 'COMPLETED';
  }

  get isCancelled(): boolean {
    return this.status === 'CANCELLED';
  }

  get isOnHold(): boolean {
    return this.status === 'ON_HOLD';
  }

  get duration(): number | null {
    if (!this.startDate) return null;
    const end = this.endDate || new Date();
    return end.getTime() - this.startDate.getTime();
  }

  get progressPercentage(): number {
    if (this.isCompleted) return 100;
    if (this.isCancelled) return 0;
    // TODO: Calculer basé sur les tâches complétées
    return 0;
  }

  get statusColor(): string {
    switch (this.status) {
      case 'ACTIVE':
        return '#10B981'; // green
      case 'COMPLETED':
        return '#3B82F6'; // blue
      case 'CANCELLED':
        return '#EF4444'; // red
      case 'ON_HOLD':
        return '#F59E0B'; // yellow
      default:
        return '#6B7280'; // gray
    }
  }
}

