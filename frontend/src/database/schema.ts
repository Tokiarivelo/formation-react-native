import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'users',
            columns: [
                { name: 'email', type: 'string', isIndexed: true },
                { name: 'username', type: 'string', isIndexed: true },
                { name: 'password', type: 'string' },
                { name: 'firstName', type: 'string', isOptional: true },
                { name: 'lastName', type: 'string', isOptional: true },
                { name: 'isActive', type: 'boolean' },
                { name: 'role', type: 'string' },
                { name: 'createdAt', type: 'number' },
                { name: 'updatedAt', type: 'number' },
                // Sync fields
                { name: 'isDirty', type: 'boolean' },
            ],
        }),

        tableSchema({
            name: 'projects',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'status', type: 'string' },
                { name: 'startDate', type: 'number', isOptional: true },
                { name: 'endDate', type: 'number', isOptional: true },
                { name: 'userId', type: 'string', isIndexed: true },
                { name: 'createdAt', type: 'number' },
                { name: 'updatedAt', type: 'number' },
                // Sync fields
                { name: 'isDirty', type: 'boolean' },
            ],
        }),

        tableSchema({
            name: 'tasks',
            columns: [
                { name: 'title', type: 'string' },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'status', type: 'string' },
                { name: 'priority', type: 'string' },
                { name: 'dueDate', type: 'number', isOptional: true },
                { name: 'userId', type: 'string', isIndexed: true },
                { name: 'projectId', type: 'string', isIndexed: true },
                { name: 'createdAt', type: 'number' },
                { name: 'updatedAt', type: 'number' },
                // Sync fields
                { name: 'isDirty', type: 'boolean' },
            ],
        }),

        tableSchema({
            name: 'attachments',
            columns: [
                { name: 'filename', type: 'string' },
                { name: 'originalName', type: 'string' },
                { name: 'mimeType', type: 'string' },
                { name: 'size', type: 'number' },
                { name: 'path', type: 'string' },
                { name: 'userId', type: 'string', isIndexed: true },
                { name: 'projectId', type: 'string', isOptional: true, isIndexed: true },
                { name: 'taskId', type: 'string', isOptional: true, isIndexed: true },
                { name: 'createdAt', type: 'number' },
                { name: 'updatedAt', type: 'number' },
                // Sync fields
                { name: 'isDirty', type: 'boolean' },
            ],
        }),
    ],
})
