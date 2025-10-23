/**
 * Modèle Task WatermelonDB
 * Correspond au modèle Task du schéma Prisma
 */

import { Model } from '@nozbe/watermelondb';
import { date, field, relation, writer } from '@nozbe/watermelondb/decorators';
import Project from './Project';
import User from './User';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export default class Task extends Model {
  static table = 'tasks';
  
  static associations = {
    user: { type: 'belongs_to' as const, key: 'user_id' },
    project: { type: 'belongs_to' as const, key: 'project_id' },
    attachments: { type: 'has_many' as const, key: 'task_id' },
  };

  // Champs de base
  @field('title') title!: string;
  @field('description') description!: string | null;
  @field('status') status!: TaskStatus;
  @field('priority') priority!: Priority;
  @date('due_date') dueDate?: Date;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
  @field('user_id') userId!: string;
  @field('project_id') projectId!: string;

  // Champs de synchronisation
  @field('is_dirty') isDirty!: boolean;
  @date('last_sync_at') lastSyncAt?: Date;

  // Relations
  @relation('users', 'user_id') user!: User;
  @relation('projects', 'project_id') project!: Project;
  @relation('attachments', 'task_id') attachments!: any;

  // Méthodes business
  @writer async updateTask(updates: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: Priority;
    dueDate?: Date;
  }) {
    await this.update((task) => {
      if (updates.title !== undefined) task.title = updates.title;
      if (updates.description !== undefined) task.description = updates.description;
      if (updates.status !== undefined) task.status = updates.status;
      if (updates.priority !== undefined) task.priority = updates.priority;
      if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
      task.isDirty = true;
      task.updatedAt = new Date();
    });
  }

  @writer async toggleStatus() {
    await this.update((task) => {
      if (task.status === 'TODO') {
        task.status = 'IN_PROGRESS';
      } else if (task.status === 'IN_PROGRESS') {
        task.status = 'DONE';
      } else if (task.status === 'DONE') {
        task.status = 'TODO';
      }
      task.isDirty = true;
      task.updatedAt = new Date();
    });
  }

  @writer async markAsDone() {
    await this.update((task) => {
      task.status = 'DONE';
      task.isDirty = true;
      task.updatedAt = new Date();
    });
  }

  @writer async markAsInProgress() {
    await this.update((task) => {
      task.status = 'IN_PROGRESS';
      task.isDirty = true;
      task.updatedAt = new Date();
    });
  }

  @writer async markAsTodo() {
    await this.update((task) => {
      task.status = 'TODO';
      task.isDirty = true;
      task.updatedAt = new Date();
    });
  }

  @writer async cancel() {
    await this.update((task) => {
      task.status = 'CANCELLED';
      task.isDirty = true;
      task.updatedAt = new Date();
    });
  }

  @writer async updatePriority(priority: Priority) {
    await this.update((task) => {
      task.priority = priority;
      task.isDirty = true;
      task.updatedAt = new Date();
    });
  }

  @writer async setDueDate(dueDate: Date) {
    await this.update((task) => {
      task.dueDate = dueDate;
      task.isDirty = true;
      task.updatedAt = new Date();
    });
  }

  @writer async removeDueDate() {
    await this.update((task) => {
      task.dueDate = null;
      task.isDirty = true;
      task.updatedAt = new Date();
    });
  }

  @writer async markAsSynced() {
    await this.update((task) => {
      task.isDirty = false;
      task.lastSyncAt = new Date();
    });
  }

  // Getters utiles
  get isTodo(): boolean {
    return this.status === 'TODO';
  }

  get isInProgress(): boolean {
    return this.status === 'IN_PROGRESS';
  }

  get isDone(): boolean {
    return this.status === 'DONE';
  }

  get isCancelled(): boolean {
    return this.status === 'CANCELLED';
  }

  get isOverdue(): boolean {
    if (!this.dueDate || this.isDone || this.isCancelled) return false;
    return new Date() > this.dueDate;
  }

  get isDueSoon(): boolean {
    if (!this.dueDate || this.isDone || this.isCancelled) return false;
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return this.dueDate <= tomorrow;
  }

  get priorityColor(): string {
    switch (this.priority) {
      case 'URGENT':
        return '#EF4444'; // red
      case 'HIGH':
        return '#F97316'; // orange
      case 'MEDIUM':
        return '#3B82F6'; // blue
      case 'LOW':
        return '#10B981'; // green
      default:
        return '#6B7280'; // gray
    }
  }

  get statusColor(): string {
    switch (this.status) {
      case 'TODO':
        return '#6B7280'; // gray
      case 'IN_PROGRESS':
        return '#F59E0B'; // yellow
      case 'DONE':
        return '#10B981'; // green
      case 'CANCELLED':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  }

  get priorityWeight(): number {
    switch (this.priority) {
      case 'URGENT': return 4;
      case 'HIGH': return 3;
      case 'MEDIUM': return 2;
      case 'LOW': return 1;
      default: return 0;
    }
  }
}

