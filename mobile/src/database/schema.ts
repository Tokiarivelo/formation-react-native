/**
 * Schéma WatermelonDB
 * Basé sur le schéma Prisma du backend
 * Correspondance exacte avec les tables et relations
 */

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    // Table Users
    tableSchema({
      name: 'users',
      columns: [
        { name: 'email', type: 'string', isIndexed: true },
        { name: 'username', type: 'string', isIndexed: true },
        { name: 'password', type: 'string' },
        { name: 'first_name', type: 'string', isOptional: true },
        { name: 'last_name', type: 'string', isOptional: true },
        { name: 'is_active', type: 'boolean' },
        { name: 'role', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        // Champs pour la synchronisation
        { name: 'is_dirty', type: 'boolean' },
        { name: 'last_sync_at', type: 'number', isOptional: true },
      ],
    }),
  ],
});

export default schema;

