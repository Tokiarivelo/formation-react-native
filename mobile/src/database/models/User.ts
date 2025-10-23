/**
 * Modèle User WatermelonDB
 * Correspond au modèle User du schéma Prisma
 */

import { Model } from '@nozbe/watermelondb';
import { date, field, relation, writer } from '@nozbe/watermelondb/decorators';

export type UserRole = 'USER' | 'ADMIN';

export default class User extends Model {
  static table = 'users';
  
  static associations = {
    projects: { type: 'has_many', key: 'user_id' },
    tasks: { type: 'has_many', key: 'user_id' },
    attachments: { type: 'has_many', key: 'user_id' },
  };

  // Champs de base
  @field('email') email!: string;
  @field('username') username!: string;
  @field('password') password!: string;
  @field('first_name') firstName!: string | null;
  @field('last_name') lastName!: string | null;
  @field('is_active') isActive!: boolean;
  @field('role') role!: UserRole;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // Champs de synchronisation
  @field('is_dirty') isDirty!: boolean;
  @date('last_sync_at') lastSyncAt?: Date;

  // Relations
  @relation('projects', 'user_id') projects!: any;
  @relation('tasks', 'user_id') tasks!: any;
  @relation('attachments', 'user_id') attachments!: any;

  // Méthodes business
  @writer async updateProfile(updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
  }) {
    await this.update((user) => {
      if (updates.firstName !== undefined) user.firstName = updates.firstName;
      if (updates.lastName !== undefined) user.lastName = updates.lastName;
      if (updates.email !== undefined) user.email = updates.email;
      if (updates.username !== undefined) user.username = updates.username;
      user.isDirty = true;
      user.updatedAt = new Date();
    });
  }

  @writer async deactivate() {
    await this.update((user) => {
      user.isActive = false;
      user.isDirty = true;
      user.updatedAt = new Date();
    });
  }

  @writer async activate() {
    await this.update((user) => {
      user.isActive = true;
      user.isDirty = true;
      user.updatedAt = new Date();
    });
  }

  @writer async markAsSynced() {
    await this.update((user) => {
      user.isDirty = false;
      user.lastSyncAt = new Date();
    });
  }

  // Getters utiles
  get fullName(): string {
    const firstName = this.firstName || '';
    const lastName = this.lastName || '';
    return `${firstName} ${lastName}`.trim() || this.username;
  }

  get displayName(): string {
    return this.fullName || this.email;
  }

  get isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  get initials(): string {
    const first = this.firstName?.charAt(0) || '';
    const last = this.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || this.username.charAt(0).toUpperCase();
  }
}

