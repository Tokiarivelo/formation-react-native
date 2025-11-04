import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema'
import User from './models/User'
import Task from './models/Task'
import Project from './models/Project'
import Attachment from './models/Attachment'

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
    schema,
    dbName: 'watermelon',
    // (You might want to comment it out for development purposes -- see Migrations documentation)
    // (optional database name or file system path)
    // dbName: 'myapp',
    // (recommended option, should work flawlessly out of the box on iOS. On Android,
    // additional installation steps have to be taken - disable if you run into issues...)
    jsi: true, /* Platform.OS === 'ios' */
    // (optional, but you should implement this method)
    onSetUpError: () => {
        // Database failed to load -- offer the user to reload the app or log out
    }
})

// Then, make a Watermelon database from it!
export const database = new Database({
    adapter,
    modelClasses: [
        User, Task, Project, Attachment,
    ],
})