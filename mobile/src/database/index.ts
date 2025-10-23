/**
 * Configuration et initialisation de WatermelonDB
 * Base de données locale SQLite pour la synchronisation offline
 */

import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';

// Import des modèles
import User from './models/User';
// import Project from './models/Project';
// import Task from './models/Task';
// import Attachment from './models/Attachment';
// import Outbox from './models/Outbox';

// Configuration de l'adaptateur SQLite
const adapter = new SQLiteAdapter({
  schema,
  // Migrations (pour les futures versions)
  migrations: {
    // migrations: {
    //   1: (oldSchema, newSchema) => {
    //     // Migration pour la version 1
    //   },
    // },
  },
  // Configuration de la base de données
  dbName: 'FormationReactNative',
  // JSI (JavaScript Interface) pour de meilleures performances
  jsi: true,
  // Synchronisation en arrière-plan
  onSetUpError: (error) => {
    console.error('Erreur lors de l\'initialisation de WatermelonDB:', error);
  },
});

// Configuration de la base de données
export const database = new Database({
  adapter,
  modelClasses: [
    User,
    // Project,
    // Task,
    // Attachment,
    // Outbox,
  ],
  // Configuration des actions
  actionsEnabled: true,
});

// Export des modèles pour faciliter l'import
export { User };
// export { Project, Task, Attachment, Outbox };

// Export des types
export type { UserRole } from './models/User';
// export type { ProjectStatus } from './models/Project';
// export type { TaskStatus, Priority } from './models/Task';
// export type { UploadStatus } from './models/Attachment';
// export type { OutboxAction, OutboxStatus } from './models/Outbox';

// Fonctions utilitaires
export const getDatabase = () => database;

// Fonction pour nettoyer la base de données (utile pour les tests)
export const clearDatabase = async () => {
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
};

// Fonction pour obtenir les statistiques de la base de données
export const getDatabaseStats = async () => {
  const users = await database.collections.get('users').query().fetchCount();
  // const projects = await database.collections.get('projects').query().fetchCount();
  // const tasks = await database.collections.get('tasks').query().fetchCount();
  // const attachments = await database.collections.get('attachments').query().fetchCount();
  // const outbox = await database.collections.get('outbox').query().fetchCount();

  return {
    users,
    // projects,
    // tasks,
    // attachments,
    // outbox,
    total: users, // + projects + tasks + attachments + outbox,
  };
};

// Fonction pour vérifier la santé de la base de données
export const checkDatabaseHealth = async () => {
  try {
    await database.adapter.schema;
    const stats = await getDatabaseStats();
    return {
      healthy: true,
      stats,
    };
  } catch (error) {
    console.error('Erreur de santé de la base de données:', error);
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export default database;

