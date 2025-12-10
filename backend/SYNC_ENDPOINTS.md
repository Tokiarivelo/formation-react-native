# WatermelonDB Sync Endpoints

This backend provides sync endpoints for WatermelonDB offline-first synchronization.

## Endpoints

### Pull Changes
**Endpoint:** `POST /sync/pull`

Fetches all changes from the server since the last pull timestamp.

**Request:**
```json
{
  "lastPulledAt": 0,
  "schemaVersion": 1
}
```

**Response:**
```json
{
  "changes": {
    "users": {
      "created": [/* array of created user records */],
      "updated": [/* array of updated user records */],
      "deleted": [/* array of deleted user IDs */]
    },
    "projects": {
      "created": [],
      "updated": [],
      "deleted": []
    },
    "tasks": {
      "created": [],
      "updated": [],
      "deleted": []
    },
    "attachments": {
      "created": [],
      "updated": [],
      "deleted": []
    },
    "workspaces": {
      "created": [],
      "updated": [],
      "deleted": []
    },
    "workspace_members": {
      "created": [],
      "updated": [],
      "deleted": []
    }
  },
  "timestamp": 1670000000000
}
```

### Push Changes
**Endpoint:** `POST /sync/push`

Applies client changes to the server database.

**Request:**
```json
{
  "lastPulledAt": 1670000000000,
  "changes": {
    "projects": {
      "created": [
        {
          "id": "unique-id",
          "name": "New Project",
          "description": "Created offline",
          "status": "ACTIVE",
          "createdAt": 1670000100000,
          "updatedAt": 1670000100000,
          "userId": "user-id",
          "workspaceId": null
        }
      ],
      "updated": [],
      "deleted": []
    }
  }
}
```

**Response:**
```json
{
  "success": true
}
```

## Authentication

Both endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Sync Protocol

This implementation follows the [WatermelonDB Sync Protocol](https://watermelondb.dev/docs/Sync/Backend):

1. **Pull Phase**: Client requests changes since `lastPulledAt` timestamp
2. **Push Phase**: Client sends local changes to be applied on the server
3. **Conflict Resolution**: Server applies client changes with "client wins" strategy for updated columns

## Timestamps

All timestamps are in **milliseconds** (UNIX timestamp * 1000) as required by WatermelonDB.

## Tables Synced

- `users` - User accounts
- `projects` - Projects
- `tasks` - Tasks within projects
- `attachments` - File attachments
- `workspaces` - Team workspaces
- `workspace_members` - Workspace membership records

## Testing

You can test the endpoints using curl:

```bash
# Login to get access token
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'

# Pull changes (initial sync)
curl -X POST http://localhost:3000/sync/pull \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"lastPulledAt": 0, "schemaVersion": 1}'

# Push changes
curl -X POST http://localhost:3000/sync/push \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "lastPulledAt": 1670000000000,
    "changes": {
      "projects": {
        "created": [],
        "updated": [],
        "deleted": []
      }
    }
  }'
```

## Implementation Details

- **Transactions**: Push operations are wrapped in database transactions for atomicity
- **Authorization**: Only syncs data the authenticated user has access to
- **Error Handling**: Failed delete operations are logged but don't stop the sync process
- **Performance**: Uses efficient queries with proper indexing on updatedAt/createdAt fields
