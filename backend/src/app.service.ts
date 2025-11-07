import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getApiInfo(): object {
    return {
      name: this.configService.get('APP_NAME') || 'NestJS Backend',
      version: this.configService.get('APP_VERSION') || '1.0.0',
      description:
        'NestJS v11 Backend with SQLite, Prisma, JWT Auth, and File Upload',
      environment: this.configService.get('NODE_ENV') || 'development',
      documentation: '/api/docs',
      endpoints: {
        auth: '/auth',
        users: '/users',
        projects: '/projects',
        tasks: '/tasks',
        attachments: '/attachments',
      },
    };
  }
}
