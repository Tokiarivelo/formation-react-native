/**
 * Modèle Outbox WatermelonDB
 * Gère les mutations offline en attente de synchronisation
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, writer } from '@nozbe/watermelondb/decorators';

export type OutboxAction = 'create' | 'update' | 'delete';
export type OutboxStatus = 'pending' | 'processing' | 'completed' | 'failed';

export default class Outbox extends Model {
  static table = 'outbox';

  // Champs de base
  @field('action') action!: OutboxAction;
  @field('table_name') tableName!: string;
  @field('record_id') recordId!: string;
  @field('data') data!: string; // JSON stringifié
  @date('created_at') createdAt!: Date;
  @field('retry_count') retryCount!: number;
  @date('last_retry_at') lastRetryAt?: Date;
  @field('status') status!: OutboxStatus;
  @field('error_message') errorMessage?: string;

  // Méthodes business
  @writer async markAsProcessing() {
    await this.update((outbox) => {
      outbox.status = 'processing';
      outbox.updatedAt = new Date();
    });
  }

  @writer async markAsCompleted() {
    await this.update((outbox) => {
      outbox.status = 'completed';
      outbox.updatedAt = new Date();
    });
  }

  @writer async markAsFailed(errorMessage: string) {
    await this.update((outbox) => {
      outbox.status = 'failed';
      outbox.errorMessage = errorMessage;
      outbox.retryCount += 1;
      outbox.lastRetryAt = new Date();
      outbox.updatedAt = new Date();
    });
  }

  @writer async incrementRetryCount() {
    await this.update((outbox) => {
      outbox.retryCount += 1;
      outbox.lastRetryAt = new Date();
      outbox.status = 'pending';
      outbox.updatedAt = new Date();
    });
  }

  @writer async resetRetryCount() {
    await this.update((outbox) => {
      outbox.retryCount = 0;
      outbox.lastRetryAt = null;
      outbox.status = 'pending';
      outbox.errorMessage = null;
      outbox.updatedAt = new Date();
    });
  }

  // Getters utiles
  get isPending(): boolean {
    return this.status === 'pending';
  }

  get isProcessing(): boolean {
    return this.status === 'processing';
  }

  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  get isFailed(): boolean {
    return this.status === 'failed';
  }

  get canRetry(): boolean {
    return this.isFailed && this.retryCount < 3; // Max 3 tentatives
  }

  get shouldRetry(): boolean {
    if (!this.canRetry) return false;
    
    // Attendre au moins 30 secondes entre les tentatives
    if (!this.lastRetryAt) return true;
    
    const now = new Date();
    const timeSinceLastRetry = now.getTime() - this.lastRetryAt.getTime();
    const minRetryInterval = 30 * 1000; // 30 secondes
    
    return timeSinceLastRetry >= minRetryInterval;
  }

  get retryDelay(): number {
    // Backoff exponentiel : 30s, 60s, 120s
    return Math.min(30 * Math.pow(2, this.retryCount), 120) * 1000;
  }

  get parsedData(): any {
    try {
      return JSON.parse(this.data);
    } catch (error) {
      console.error('Erreur lors du parsing des données outbox:', error);
      return null;
    }
  }

  get description(): string {
    return `${this.action.toUpperCase()} ${this.tableName} (${this.recordId})`;
  }
}

