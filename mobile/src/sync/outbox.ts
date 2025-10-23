/**
 * Système d'outbox pour les mutations offline
 * Gère les opérations CRUD en mode offline avec synchronisation différée
 */

import { database, Outbox, OutboxAction } from '../database';
import { Model } from '@nozbe/watermelondb';
import { syncManager } from './syncManager';

export interface OutboxItem {
  action: OutboxAction;
  tableName: string;
  recordId: string;
  data: any;
}

class OutboxService {
  private static instance: OutboxService;

  static getInstance(): OutboxService {
    if (!OutboxService.instance) {
      OutboxService.instance = new OutboxService();
    }
    return OutboxService.instance;
  }

  /**
   * Ajouter une mutation à l'outbox
   */
  async addToOutbox(item: OutboxItem): Promise<void> {
    await database.write(async () => {
      await database.collections.get<Outbox>('outbox').create((outbox) => {
        outbox.action = item.action;
        outbox.tableName = item.tableName;
        outbox.recordId = item.recordId;
        outbox.data = JSON.stringify(item.data);
        outbox.status = 'pending';
        outbox.retryCount = 0;
        outbox.createdAt = new Date();
      });
    });

    // Déclencher une synchronisation si en ligne
    const status = await syncManager.getSyncStatus();
    if (status.isOnline) {
      syncManager.forceSync();
    }
  }

  /**
   * Créer un enregistrement avec outbox
   */
  async createWithOutbox<T extends Model>(
    tableName: string,
    data: any,
    localCreate: () => Promise<T>
  ): Promise<T> {
    // Créer localement d'abord
    const record = await localCreate();

    // Ajouter à l'outbox
    await this.addToOutbox({
      action: 'create',
      tableName,
      recordId: record.id,
      data,
    });

    return record;
  }

  /**
   * Mettre à jour un enregistrement avec outbox
   */
  async updateWithOutbox<T extends Model>(
    tableName: string,
    recordId: string,
    data: any,
    localUpdate: () => Promise<void>
  ): Promise<void> {
    // Mettre à jour localement d'abord
    await localUpdate();

    // Ajouter à l'outbox
    await this.addToOutbox({
      action: 'update',
      tableName,
      recordId,
      data,
    });
  }

  /**
   * Supprimer un enregistrement avec outbox
   */
  async deleteWithOutbox<T extends Model>(
    tableName: string,
    recordId: string,
    localDelete: () => Promise<void>
  ): Promise<void> {
    // Supprimer localement d'abord
    await localDelete();

    // Ajouter à l'outbox
    await this.addToOutbox({
      action: 'delete',
      tableName,
      recordId,
      data: {},
    });
  }

  /**
   * Obtenir les éléments en attente de synchronisation
   */
  async getPendingItems(): Promise<Outbox[]> {
    return database.collections
      .get<Outbox>('outbox')
      .query()
      .where('status', 'pending')
      .fetch();
  }

  /**
   * Obtenir les éléments échoués
   */
  async getFailedItems(): Promise<Outbox[]> {
    return database.collections
      .get<Outbox>('outbox')
      .query()
      .where('status', 'failed')
      .fetch();
  }

  /**
   * Retry les éléments échoués
   */
  async retryFailedItems(): Promise<void> {
    const failedItems = await this.getFailedItems();
    
    for (const item of failedItems) {
      if (item.canRetry) {
        await item.resetRetryCount();
      }
    }

    // Déclencher une synchronisation
    const status = await syncManager.getSyncStatus();
    if (status.isOnline) {
      syncManager.forceSync();
    }
  }

  /**
   * Nettoyer l'outbox (supprimer les éléments synchronisés)
   */
  async cleanup(): Promise<void> {
    await syncManager.cleanupOutbox();
  }

  /**
   * Obtenir les statistiques de l'outbox
   */
  async getStats() {
    return syncManager.getSyncStats();
  }

  /**
   * Vider complètement l'outbox (utile pour les tests)
   */
  async clear(): Promise<void> {
    await database.write(async () => {
      const allItems = await database.collections
        .get<Outbox>('outbox')
        .query()
        .fetch();

      for (const item of allItems) {
        await item.destroyPermanently();
      }
    });
  }
}

// Fonctions utilitaires pour les opérations courantes

/**
 * Créer un projet avec outbox
 */
export async function createProjectWithOutbox(projectData: any) {
  const outboxService = OutboxService.getInstance();
  
  return outboxService.createWithOutbox(
    'projects',
    projectData,
    async () => {
      return database.write(async () => {
        return database.collections.get('projects').create((project) => {
          project.name = projectData.name;
          project.description = projectData.description;
          project.status = projectData.status || 'ACTIVE';
          project.userId = projectData.userId;
          project.isDirty = true;
          project.createdAt = new Date();
          project.updatedAt = new Date();
        });
      });
    }
  );
}

/**
 * Créer une tâche avec outbox
 */
export async function createTaskWithOutbox(taskData: any) {
  const outboxService = OutboxService.getInstance();
  
  return outboxService.createWithOutbox(
    'tasks',
    taskData,
    async () => {
      return database.write(async () => {
        return database.collections.get('tasks').create((task) => {
          task.title = taskData.title;
          task.description = taskData.description;
          task.status = taskData.status || 'TODO';
          task.priority = taskData.priority || 'MEDIUM';
          task.userId = taskData.userId;
          task.projectId = taskData.projectId;
          task.isDirty = true;
          task.createdAt = new Date();
          task.updatedAt = new Date();
        });
      });
    }
  );
}

/**
 * Mettre à jour une tâche avec outbox
 */
export async function updateTaskWithOutbox(taskId: string, updates: any) {
  const outboxService = OutboxService.getInstance();
  
  return outboxService.updateWithOutbox(
    'tasks',
    taskId,
    updates,
    async () => {
      const task = await database.collections.get('tasks').find(taskId);
      await task.updateTask(updates);
    }
  );
}

/**
 * Supprimer une tâche avec outbox
 */
export async function deleteTaskWithOutbox(taskId: string) {
  const outboxService = OutboxService.getInstance();
  
  return outboxService.deleteWithOutbox(
    'tasks',
    taskId,
    async () => {
      const task = await database.collections.get('tasks').find(taskId);
      await task.destroyPermanently();
    }
  );
}

export const outboxService = OutboxService.getInstance();
export default outboxService;
