/**
 * Modèle Attachment WatermelonDB
 * Correspond au modèle Attachment du schéma Prisma
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, relation, writer } from '@nozbe/watermelondb/decorators';
import User from './User';
import Project from './Project';
import Task from './Task';

export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'failed';

export default class Attachment extends Model {
  static table = 'attachments';
  
  static associations = {
    user: { type: 'belongs_to', key: 'user_id' },
    project: { type: 'belongs_to', key: 'project_id' },
    task: { type: 'belongs_to', key: 'task_id' },
  };

  // Champs de base
  @field('filename') filename!: string;
  @field('original_name') originalName!: string;
  @field('mime_type') mimeType!: string;
  @field('size') size!: number;
  @field('path') path!: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
  @field('user_id') userId!: string;
  @field('project_id') projectId!: string | null;
  @field('task_id') taskId!: string | null;

  // Champs de synchronisation
  @field('is_dirty') isDirty!: boolean;
  @date('last_sync_at') lastSyncAt?: Date;

  // Champs pour l'upload
  @field('upload_progress') uploadProgress?: number;
  @field('upload_status') uploadStatus?: UploadStatus;

  // Relations
  @relation('users', 'user_id') user!: User;
  @relation('projects', 'project_id') project?: Project;
  @relation('tasks', 'task_id') task?: Task;

  // Méthodes business
  @writer async updateAttachment(updates: {
    filename?: string;
    originalName?: string;
    mimeType?: string;
    size?: number;
    path?: string;
  }) {
    await this.update((attachment) => {
      if (updates.filename !== undefined) attachment.filename = updates.filename;
      if (updates.originalName !== undefined) attachment.originalName = updates.originalName;
      if (updates.mimeType !== undefined) attachment.mimeType = updates.mimeType;
      if (updates.size !== undefined) attachment.size = updates.size;
      if (updates.path !== undefined) attachment.path = updates.path;
      attachment.isDirty = true;
      attachment.updatedAt = new Date();
    });
  }

  @writer async updateUploadProgress(progress: number) {
    await this.update((attachment) => {
      attachment.uploadProgress = progress;
      attachment.uploadStatus = 'uploading';
      attachment.isDirty = true;
      attachment.updatedAt = new Date();
    });
  }

  @writer async markUploadCompleted() {
    await this.update((attachment) => {
      attachment.uploadStatus = 'completed';
      attachment.uploadProgress = 100;
      attachment.isDirty = true;
      attachment.updatedAt = new Date();
    });
  }

  @writer async markUploadFailed(errorMessage?: string) {
    await this.update((attachment) => {
      attachment.uploadStatus = 'failed';
      attachment.isDirty = true;
      attachment.updatedAt = new Date();
    });
  }

  @writer async resetUpload() {
    await this.update((attachment) => {
      attachment.uploadStatus = 'pending';
      attachment.uploadProgress = 0;
      attachment.isDirty = true;
      attachment.updatedAt = new Date();
    });
  }

  @writer async assignToProject(projectId: string) {
    await this.update((attachment) => {
      attachment.projectId = projectId;
      attachment.taskId = null; // Un attachment ne peut être lié qu'à un projet OU une tâche
      attachment.isDirty = true;
      attachment.updatedAt = new Date();
    });
  }

  @writer async assignToTask(taskId: string) {
    await this.update((attachment) => {
      attachment.taskId = taskId;
      attachment.projectId = null; // Un attachment ne peut être lié qu'à un projet OU une tâche
      attachment.isDirty = true;
      attachment.updatedAt = new Date();
    });
  }

  @writer async unassign() {
    await this.update((attachment) => {
      attachment.projectId = null;
      attachment.taskId = null;
      attachment.isDirty = true;
      attachment.updatedAt = new Date();
    });
  }

  @writer async markAsSynced() {
    await this.update((attachment) => {
      attachment.isDirty = false;
      attachment.lastSyncAt = new Date();
    });
  }

  // Getters utiles
  get isImage(): boolean {
    return this.mimeType.startsWith('image/');
  }

  get isVideo(): boolean {
    return this.mimeType.startsWith('video/');
  }

  get isAudio(): boolean {
    return this.mimeType.startsWith('audio/');
  }

  get isDocument(): boolean {
    return this.mimeType.includes('pdf') || 
           this.mimeType.includes('document') || 
           this.mimeType.includes('text/');
  }

  get fileExtension(): string {
    return this.originalName.split('.').pop()?.toLowerCase() || '';
  }

  get formattedSize(): string {
    const bytes = this.size;
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  get isUploading(): boolean {
    return this.uploadStatus === 'uploading';
  }

  get isUploadCompleted(): boolean {
    return this.uploadStatus === 'completed';
  }

  get isUploadFailed(): boolean {
    return this.uploadStatus === 'failed';
  }

  get isUploadPending(): boolean {
    return this.uploadStatus === 'pending' || !this.uploadStatus;
  }

  get uploadProgressPercentage(): number {
    return this.uploadProgress || 0;
  }

  get isAssignedToProject(): boolean {
    return !!this.projectId;
  }

  get isAssignedToTask(): boolean {
    return !!this.taskId;
  }

  get isUnassigned(): boolean {
    return !this.projectId && !this.taskId;
  }

  get iconName(): string {
    if (this.isImage) return '🖼️';
    if (this.isVideo) return '🎥';
    if (this.isAudio) return '🎵';
    if (this.isDocument) return '📄';
    return '📎';
  }
}
