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
                { name: 'first_name', type: 'string', isOptional: true },
                { name: 'last_name', type: 'string', isOptional: true },
                { name: 'is_active', type: 'boolean' },
                { name: 'role', type: 'string' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
                { name: 'is_dirty', type: 'boolean' },
            ],
        }),

        tableSchema({
            name: 'projects',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'status', type: 'string' },
                { name: 'start_date', type: 'number', isOptional: true },
                { name: 'end_date', type: 'number', isOptional: true },
                { name: 'user_id', type: 'string' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
                { name: 'is_dirty', type: 'boolean' },
            ],
        }),

        tableSchema({
            name: 'tasks',
            columns: [
                { name: 'title', type: 'string' },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'status', type: 'string' },
                { name: 'priority', type: 'string' },
                { name: 'due_date', type: 'number', isOptional: true },
                { name: 'user_id', type: 'string' },
                { name: 'project_id', type: 'string' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
                { name: 'is_dirty', type: 'boolean' },
            ],
        }),

        tableSchema({
            name: 'attachments',
            columns: [
                { name: 'filename', type: 'string' },
                { name: 'original_name', type: 'string' },
                { name: 'mime_type', type: 'string' },
                { name: 'size', type: 'number' },
                { name: 'path', type: 'string' },
                { name: 'user_id', type: 'string' },
                { name: 'project_id', type: 'string', isOptional: true },
                { name: 'task_id', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
                { name: 'is_dirty', type: 'boolean' },
            ],
        }),
    ],
})
