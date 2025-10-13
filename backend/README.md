# NestJS v11 Backend

A comprehensive backend API built with NestJS v11, SQLite, Prisma, JWT authentication, and file upload capabilities.

## Features

- **Authentication**: JWT with access and refresh tokens
- **Database**: SQLite with Prisma ORM
- **File Upload**: Multipart file upload with local storage
- **API Documentation**: Swagger/OpenAPI documentation
- **Docker Support**: Multi-stage Docker build with docker-compose
- **Testing**: Jest unit and E2E tests
- **Validation**: Request validation with class-validator
- **Security**: Password hashing, JWT guards, user ownership validation

## Tech Stack

- **Framework**: NestJS v11
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (jsonwebtoken) with refresh tokens
- **File Upload**: Multer with local file storage
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Validation**: class-validator, class-transformer
- **Container**: Docker with multi-stage build

## Domain Models

- **User**: Authentication and user management
- **Project**: Project management with ownership
- **Task**: Task management linked to projects
- **Attachment**: File upload and management
- **RefreshToken**: Secure refresh token storage (hashed)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Generate Prisma client and setup database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run start:dev
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api/docs

### Default Admin User

- **Email**: admin@example.com
- **Password**: admin123

## Environment Variables

See `.env.example` for all required environment variables:

- `DATABASE_URL`: SQLite database file path
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_ACCESS_TOKEN_EXPIRES_IN`: Access token expiration (default: 15m)
- `JWT_REFRESH_TOKEN_EXPIRES_IN`: Refresh token expiration (default: 7d)
- `PORT`: Server port (default: 3000)
- `UPLOAD_DEST`: File upload directory (default: ./uploads)
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 5MB)

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Users
- `GET /users` - Get all users
- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user by ID
- `PUT /users/me` - Update current user profile
- `PUT /users/:id` - Update user by ID
- `DELETE /users/:id` - Delete user by ID

### Projects
- `POST /projects` - Create new project
- `GET /projects` - Get user's projects
- `GET /projects/:id` - Get project by ID
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Tasks
- `POST /tasks` - Create new task
- `GET /tasks` - Get user's tasks (optional: ?projectId=xxx)
- `GET /tasks/:id` - Get task by ID
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Attachments
- `POST /attachments/upload` - Upload file
- `GET /attachments` - Get user's attachments
- `GET /attachments/:id` - Get attachment details
- `GET /attachments/:id/download` - Download file
- `DELETE /attachments/:id` - Delete attachment

## Scripts

```bash
# Development
npm run start:dev          # Start in development mode
npm run start:debug        # Start in debug mode

# Production
npm run build              # Build the application
npm run start:prod         # Start in production mode

# Database
npm run db:generate        # Generate Prisma client
npm run db:push           # Push schema to database
npm run db:migrate        # Run database migrations
npm run db:seed           # Seed database with sample data
npm run db:reset          # Reset database
npm run db:studio         # Open Prisma Studio

# Testing
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Run tests with coverage
npm run test:e2e          # Run E2E tests

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Using Docker

```bash
# Build the image
docker build -t nestjs-backend .

# Run the container
docker run -p 3000:3000 \
  -e JWT_SECRET=your-secret-key \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/uploads:/app/uploads \
  nestjs-backend
```

## File Upload

The API supports file uploads with the following constraints:
- **Maximum file size**: 5MB (configurable)
- **Allowed types**: Images (JPEG, PNG, GIF, WebP), Documents (PDF, DOC, DOCX, XLS, XLSX), Text files, ZIP archives
- **Storage**: Local filesystem in `/uploads` directory
- **Security**: File type validation, user ownership validation

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Refresh Tokens**: Hashed refresh tokens with revocation
- **Authorization Guards**: Route-level access control
- **Input Validation**: Request validation with class-validator
- **File Upload Security**: MIME type validation and size limits
- **User Ownership**: Resource access restricted to owners

## Testing

The project includes comprehensive tests:
- **Unit Tests**: Service and controller testing
- **E2E Tests**: Full application flow testing
- **Mocking**: Database and external dependencies mocked
- **Coverage**: Test coverage reporting available

Run tests:
```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
npm run test:cov    # With coverage
```

## Architecture

The application follows NestJS best practices:
- **Modular Architecture**: Feature-based modules
- **Dependency Injection**: IoC container for dependencies
- **Guards**: Authentication and authorization
- **Pipes**: Request validation and transformation
- **Interceptors**: Cross-cutting concerns
- **DTOs**: Data transfer objects for type safety
- **Services**: Business logic separation
- **Controllers**: HTTP request handling

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## License

This project is licensed under the UNLICENSED license.

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
