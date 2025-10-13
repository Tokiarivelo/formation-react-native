import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'APP_NAME':
                  return 'Test App';
                case 'APP_VERSION':
                  return '1.0.0';
                case 'NODE_ENV':
                  return 'test';
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return API info', () => {
      const result = appController.getHello();
      expect(result).toHaveProperty('name', 'Test App');
      expect(result).toHaveProperty('version', '1.0.0');
      expect(result).toHaveProperty('environment', 'test');
      expect(result).toHaveProperty('documentation', '/api/docs');
      expect(result).toHaveProperty('endpoints');
    });
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const result = appController.healthCheck();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
    });
  });
});
