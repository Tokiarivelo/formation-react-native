# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React Native training project (`formation-react-native`) that includes:

- **Backend**: NestJS v11 API with SQLite database, JWT authentication, and file upload capabilities
- **Frontend**: React Native application (to be developed during training)

The project uses modern full-stack development patterns with TypeScript, Prisma ORM, and comprehensive API documentation.

## Backend Development Commands

### Environment Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

### Database Operations

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Run database migrations (for production)
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Reset database completely
npm run db:reset

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Development

```bash
# Start backend in development mode
cd backend && npm run start:dev

# Start with debugging enabled
npm run start:debug

# Build for production
npm run build

# Start in production mode
npm run start:prod
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code with Prettier
npm run format
```

### Docker Deployment

```bash
# Start with docker-compose (recommended)
cd backend && docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Architecture

### Backend Architecture (NestJS)

- **Modular Design**: Feature-based modules (auth, users, projects, tasks, attachments)
- **Database**: SQLite with Prisma ORM for development, easily switchable to PostgreSQL/MySQL
- **Authentication**: JWT with access/refresh token strategy
- **File Upload**: Multer with local storage, configurable size limits
- **API Documentation**: Swagger/OpenAPI at `/api/docs`
- **Testing**: Jest for unit and E2E tests with mocking

### Database Schema

The backend uses a task management domain model:

- **User**: Authentication and user management with roles (USER/ADMIN)
- **RefreshToken**: Secure token storage with revocation support
- **Project**: Project management with status tracking (ACTIVE/COMPLETED/CANCELLED/ON_HOLD)
- **Task**: Task management with priority levels (LOW/MEDIUM/HIGH/URGENT) and status (TODO/IN_PROGRESS/DONE/CANCELLED)
- **Attachment**: File upload system linked to projects and tasks

### API Endpoints Structure

- `/auth/*` - Authentication (register, login, refresh, logout)
- `/users/*` - User management (CRUD operations, profile management)
- `/projects/*` - Project management with user ownership
- `/tasks/*` - Task management with project association
- `/attachments/*` - File upload/download with ownership validation

### Security Features

- Bcrypt password hashing
- JWT authentication with configurable expiration
- Request validation with class-validator
- User ownership validation for resource access
- File type and size validation for uploads

## Development Environment

### Prerequisites

- Node.js 18+
- npm or yarn

### Key Configuration Files

- `backend/.env` - Environment variables (JWT secrets, database URL, file upload settings)
- `backend/prisma/schema.prisma` - Database schema definition
- `backend/docker-compose.yml` - Multi-container deployment setup
- `backend/package.json` - Dependencies and npm scripts

### Default Development Access

- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api/docs
- **Default Admin**: admin@example.com / admin123

## React Native Development (To Be Added)

The frontend React Native application will be developed during the training. Common patterns to expect:

- Navigation setup (React Navigation)
- State management (Context API or Redux)
- API integration with the NestJS backend
- Authentication flow implementation
- File upload capabilities
- Form handling and validation

## Training Flow

This appears to be structured for a React Native training program where:

1. Backend API is pre-built and provides a solid foundation
2. Students will build the React Native frontend
3. Focus on modern React Native patterns and backend integration
4. Full-stack development learning experience

## Troubleshooting

### Common Backend Issues

- Ensure SQLite database directory exists and is writable
- Check JWT_SECRET is set in `.env` file
- Verify upload directory permissions for file operations
- Use `npm run db:reset` if database gets corrupted during development

### Environment Variables

Critical environment variables (see `.env.example`):

- `DATABASE_URL` - SQLite database path
- `JWT_SECRET` - Must be set for authentication
- `PORT` - Server port (default: 3000)
- `UPLOAD_DEST` - File upload directory
- `MAX_FILE_SIZE` - File size limit in bytes
