/**
 * Gestionnaire de synchronisation offline/online
 * Orchestrateur intelligent pour la synchronisation des données
 */

import { database } from '../database';
// import { axiosInstance } from '../services/axiosInstance';
import NetInfo from '@react-native-community/netinfo';
import { env } from '../config/env';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAt?: Date;
  pendingMutations: number;
  error?: string;
}

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  errorCount: number;
  errors: string[];
}

class SyncManager {
  private static instance: SyncManager;
  private isOnline = false;
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private listeners: ((status: SyncStatus) => void)[] = [];

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // Écouter les changements de connectivité
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
      this.notifyListeners();
      
      if (this.isOnline) {
        this.startSync();
      } else {
        this.stopSync();
      }
    });

    // Vérifier l'état initial
    const netInfo = await NetInfo.fetch();
    this.isOnline = netInfo.isConnected ?? false;
    this.notifyListeners();

    if (this.isOnline) {
      this.startSync();
    }
  }

  /**
   * Démarrer la synchronisation automatique
   */
  startSync() {
    if (this.syncInterval) return;

    // Synchronisation immédiate
    this.performSync();

    // Puis toutes les 30 secondes
    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        this.performSync();
      }
    }, 30000);
  }

  /**
   * Arrêter la synchronisation automatique
   */
  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Effectuer une synchronisation manuelle
   */
  async performSync(): Promise<SyncResult> {
    if (!this.isOnline || this.isSyncing) {
      return {
        success: false,
        syncedCount: 0,
        errorCount: 0,
        errors: ['Pas de connexion ou synchronisation en cours'],
      };
    }

    this.isSyncing = true;
    this.notifyListeners();

    try {
      const result = await this.syncOutbox();
      this.notifyListeners();
      return result;
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      this.notifyListeners();
      return {
        success: false,
        syncedCount: 0,
        errorCount: 1,
        errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
      };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Synchroniser les mutations en attente (outbox)
   */
  private async syncOutbox(): Promise<SyncResult> {
    // Temporairement désactivé jusqu'à ce que les modèles soient créés
    return {
      success: true,
      syncedCount: 0,
      errorCount: 0,
      errors: [],
    };
    
    // const outboxItems = await database.collections
    //   .get<Outbox>('outbox')
    //   .query()
    //   .where('status', 'pending')
    //   .fetch();

    // let syncedCount = 0;
    // let errorCount = 0;
    // const errors: string[] = [];

    // for (const item of outboxItems) {
    //   try {
    //     await this.syncOutboxItem(item);
    //     syncedCount++;
    //   } catch (error) {
    //     errorCount++;
    //     const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    //     errors.push(`Item ${item.id}: ${errorMessage}`);
        
    //     // Marquer comme échoué et incrémenter le compteur de retry
    //     await item.markAsFailed(errorMessage);
    //   }
    // }

    // return {
    //   success: errorCount === 0,
    //   syncedCount,
    //   errorCount,
    //   errors,
    // };
  }

  /**
   * Synchroniser un élément de l'outbox
   */
  private async syncOutboxItem(item: Outbox): Promise<void> {
    await item.markAsProcessing();

    const { action, tableName, recordId, data } = item;
    const parsedData = item.parsedData;

    try {
      let response;

      switch (action) {
        case 'create':
          response = await this.createRecord(tableName, parsedData);
          break;
        case 'update':
          response = await this.updateRecord(tableName, recordId, parsedData);
          break;
        case 'delete':
          response = await this.deleteRecord(tableName, recordId);
          break;
        default:
          throw new Error(`Action non supportée: ${action}`);
      }

      // Marquer comme synchronisé
      await item.markAsCompleted();

      // Mettre à jour le record local avec la réponse du serveur
      if (response && (action === 'create' || action === 'update')) {
        await this.updateLocalRecord(tableName, recordId, response);
      }

    } catch (error) {
      await item.markAsFailed(error instanceof Error ? error.message : 'Erreur inconnue');
      throw error;
    }
  }

  /**
   * Créer un enregistrement sur le serveur
   */
  private async createRecord(tableName: string, data: any) {
    const endpoint = this.getEndpointForTable(tableName);
    const response = await axiosInstance.post(endpoint, data);
    return response.data;
  }

  /**
   * Mettre à jour un enregistrement sur le serveur
   */
  private async updateRecord(tableName: string, recordId: string, data: any) {
    const endpoint = this.getEndpointForTable(tableName);
    const response = await axiosInstance.put(`${endpoint}/${recordId}`, data);
    return response.data;
  }

  /**
   * Supprimer un enregistrement sur le serveur
   */
  private async deleteRecord(tableName: string, recordId: string) {
    const endpoint = this.getEndpointForTable(tableName);
    await axiosInstance.delete(`${endpoint}/${recordId}`);
  }

  /**
   * Mettre à jour l'enregistrement local avec les données du serveur
   */
  private async updateLocalRecord(tableName: string, recordId: string, serverData: any) {
    const collection = database.collections.get(tableName);
    const record = await collection.find(recordId);
    
    await database.write(async () => {
      await record.update((r: any) => {
        // Mettre à jour avec les données du serveur
        Object.keys(serverData).forEach(key => {
          if (key !== 'id' && r[key] !== undefined) {
            r[key] = serverData[key];
          }
        });
        r.isDirty = false;
        r.lastSyncAt = new Date();
      });
    });
  }

  /**
   * Obtenir l'endpoint API pour une table
   */
  private getEndpointForTable(tableName: string): string {
    const endpoints: Record<string, string> = {
      users: '/users',
      projects: '/projects',
      tasks: '/tasks',
      attachments: '/attachments',
    };
    
    return endpoints[tableName] || `/${tableName}`;
  }

  /**
   * Ajouter un listener pour les changements de statut
   */
  addListener(listener: (status: SyncStatus) => void) {
    this.listeners.push(listener);
  }

  /**
   * Supprimer un listener
   */
  removeListener(listener: (status: SyncStatus) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notifier tous les listeners
   */
  private async notifyListeners() {
    const status = await this.getSyncStatus();
    this.listeners.forEach(listener => listener(status));
  }

  /**
   * Obtenir le statut actuel de la synchronisation
   */
  async getSyncStatus(): Promise<SyncStatus> {
    // Temporairement simplifié
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingMutations: 0,
    };
    
    // const pendingMutations = await database.collections
    //   .get<Outbox>('outbox')
    //   .query()
    //   .where('status', 'pending')
    //   .fetchCount();

    // return {
    //   isOnline: this.isOnline,
    //   isSyncing: this.isSyncing,
    //   pendingMutations,
    // };
  }

  /**
   * Forcer une synchronisation immédiate
   */
  async forceSync(): Promise<SyncResult> {
    return this.performSync();
  }

  /**
   * Nettoyer les éléments synchronisés de l'outbox
   */
  async cleanupOutbox(): Promise<void> {
    await database.write(async () => {
      const completedItems = await database.collections
        .get<Outbox>('outbox')
        .query()
        .where('status', 'completed')
        .fetch();

      for (const item of completedItems) {
        await item.destroyPermanently();
      }
    });
  }

  /**
   * Obtenir les statistiques de synchronisation
   */
  async getSyncStats() {
    const outbox = await database.collections.get<Outbox>('outbox').query().fetch();
    
    return {
      total: outbox.length,
      pending: outbox.filter(item => item.isPending).length,
      processing: outbox.filter(item => item.isProcessing).length,
      completed: outbox.filter(item => item.isCompleted).length,
      failed: outbox.filter(item => item.isFailed).length,
    };
  }
}

export const syncManager = SyncManager.getInstance();
export default syncManager;

