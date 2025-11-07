# Firebase Authentication & Socket.IO Implementation

## Overview

This implementation adds Firebase authentication (Google & Apple sign-in) and Socket.IO real-time notifications to the NestJS backend.

## Features Added

### 1. Firebase Authentication

- **Endpoint**: `POST /v1/auth/firebase`
- **Functionality**: 
  - Verifies Firebase ID token from Google or Apple sign-in
  - Creates or links user account in database
  - Issues JWT access and refresh tokens

### 2. Socket.IO Real-Time Notifications

- **Connection Authentication**: Supports both Firebase ID token and JWT Bearer token
- **Features**:
  - Authenticated WebSocket connections
  - User-specific rooms for targeted notifications
  - Broadcast capability for all connected clients

## Configuration

Add the following environment variables to your `.env` file:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Usage

### Firebase Authentication

```bash
# Example: Authenticate with Firebase token
curl -X POST http://localhost:3000/v1/auth/firebase \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "YOUR_FIREBASE_ID_TOKEN"
  }'

# Response:
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "user_abc123",
    "firebaseUid": "firebase-uid",
    "firstName": "John Doe",
    "role": "USER",
    "isActive": true
  },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token"
}
```

### Socket.IO Connection

#### Option 1: Using JWT Access Token

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'YOUR_JWT_ACCESS_TOKEN'
  }
});

socket.on('connected', (data) => {
  console.log('Connected:', data);
});
```

#### Option 2: Using Firebase ID Token

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'YOUR_FIREBASE_ID_TOKEN'
  }
});

socket.on('connected', (data) => {
  console.log('Connected:', data);
});
```

#### Option 3: Using Authorization Header

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  extraHeaders: {
    Authorization: 'Bearer YOUR_JWT_ACCESS_TOKEN'
  }
});
```

### Sending Messages

```javascript
// Send a message
socket.emit('message', { text: 'Hello, World!' });

// Listen for messages
socket.on('message', (data) => {
  console.log('Received:', data);
});
```

## Architecture

### Database Schema Changes

Added `firebaseUid` field to User model:

```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String   @unique
  password    String?  // Nullable for Firebase users
  firebaseUid String?  @unique
  // ... other fields
}
```

### New Services

1. **FirebaseService** (`src/firebase/firebase.service.ts`)
   - Initializes Firebase Admin SDK
   - Verifies Firebase ID tokens
   
2. **NotificationsGateway** (`src/notifications/notifications.gateway.ts`)
   - Handles WebSocket connections
   - Authenticates using JWT or Firebase tokens
   - Manages user-specific rooms
   - Provides broadcast capabilities

### API Endpoints

- `POST /v1/auth/register` - Register with email/password
- `POST /v1/auth/login` - Login with email/password
- `POST /v1/auth/firebase` - **NEW**: Authenticate with Firebase token
- `POST /v1/auth/refresh` - Refresh access token
- `POST /v1/auth/logout` - Logout user

## Testing

All existing tests pass. To run tests:

```bash
npm test
```

## Security Notes

1. Firebase credentials are loaded from environment variables
2. Password field is now nullable to support social login users
3. Social login users cannot use email/password login
4. WebSocket connections require valid authentication tokens
5. Each user is isolated in their own Socket.IO room

## Swagger Documentation

API documentation is available at: `http://localhost:3000/api/docs`
