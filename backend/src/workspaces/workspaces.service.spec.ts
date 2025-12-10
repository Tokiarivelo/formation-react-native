import { Test, TestingModule } from '@nestjs/testing';
import { WorkspacesService } from './workspaces.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { WorkspaceRole } from '@prisma/client';

describe('WorkspacesService', () => {
  let service: WorkspacesService;
  let prismaService: PrismaService;
  let notificationsGateway: NotificationsGateway;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    username: 'testuser',
  };

  const mockWorkspace = {
    id: 'workspace-1',
    name: 'Test Workspace',
    description: 'Test Description',
    ownerId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      id: 'user-1',
      username: 'testuser',
      email: 'test@example.com',
    },
    members: [
      {
        id: 'member-1',
        userId: 'user-1',
        workspaceId: 'workspace-1',
        role: WorkspaceRole.ADMIN,
        user: {
          id: 'user-1',
          username: 'testuser',
          email: 'test@example.com',
        },
      },
    ],
    _count: {
      projects: 0,
      members: 1,
    },
  };

  const mockPrismaService = {
    workspace: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    workspaceMember: {
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    task: {
      update: jest.fn(),
    },
  };

  const mockNotificationsGateway = {
    sendToUser: jest.fn(),
    sendToWorkspace: jest.fn(),
    broadcast: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspacesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationsGateway,
          useValue: mockNotificationsGateway,
        },
      ],
    }).compile();

    service = module.get<WorkspacesService>(WorkspacesService);
    prismaService = module.get<PrismaService>(PrismaService);
    notificationsGateway =
      module.get<NotificationsGateway>(NotificationsGateway);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a workspace and add creator as admin member', async () => {
      mockPrismaService.workspace.create.mockResolvedValue(mockWorkspace);

      const result = await service.create('user-1', {
        name: 'Test Workspace',
        description: 'Test Description',
      });

      expect(result).toEqual(mockWorkspace);
      expect(mockPrismaService.workspace.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Workspace',
          description: 'Test Description',
          ownerId: 'user-1',
          members: {
            create: {
              userId: 'user-1',
              role: WorkspaceRole.ADMIN,
            },
          },
        },
        include: expect.any(Object),
      });
      expect(mockNotificationsGateway.sendToUser).toHaveBeenCalledWith(
        'user-1',
        'workspace:created',
        { workspace: mockWorkspace },
      );
    });
  });

  describe('findAll', () => {
    it('should return all workspaces for a user (owned or member)', async () => {
      mockPrismaService.workspace.findMany.mockResolvedValue([mockWorkspace]);

      const result = await service.findAll('user-1');

      expect(result).toEqual([mockWorkspace]);
      expect(mockPrismaService.workspace.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { ownerId: 'user-1' },
            { members: { some: { userId: 'user-1' } } },
          ],
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findById', () => {
    it('should return a workspace if user is owner', async () => {
      mockPrismaService.workspace.findUnique.mockResolvedValue(mockWorkspace);

      const result = await service.findById('workspace-1', 'user-1');

      expect(result).toEqual(mockWorkspace);
    });

    it('should throw NotFoundException if workspace does not exist', async () => {
      mockPrismaService.workspace.findUnique.mockResolvedValue(null);

      await expect(service.findById('workspace-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not owner or member', async () => {
      const workspaceWithoutAccess = {
        ...mockWorkspace,
        ownerId: 'other-user',
        members: [],
      };
      mockPrismaService.workspace.findUnique.mockResolvedValue(
        workspaceWithoutAccess,
      );

      await expect(service.findById('workspace-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should update workspace if user is owner', async () => {
      const updatedWorkspace = { ...mockWorkspace, name: 'Updated Name' };
      mockPrismaService.workspace.findUnique.mockResolvedValue(mockWorkspace);
      mockPrismaService.workspace.update.mockResolvedValue(updatedWorkspace);

      const result = await service.update('workspace-1', 'user-1', {
        name: 'Updated Name',
      });

      expect(result).toEqual(updatedWorkspace);
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      const workspaceWithMember = {
        ...mockWorkspace,
        ownerId: 'other-user',
        members: [
          {
            userId: 'user-1',
            role: WorkspaceRole.MEMBER,
          },
        ],
      };
      mockPrismaService.workspace.findUnique.mockResolvedValue(
        workspaceWithMember,
      );

      await expect(
        service.update('workspace-1', 'user-1', { name: 'Updated' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete workspace if user is owner', async () => {
      mockPrismaService.workspace.findUnique.mockResolvedValue(mockWorkspace);
      mockPrismaService.workspace.delete.mockResolvedValue(mockWorkspace);

      const result = await service.delete('workspace-1', 'user-1');

      expect(result).toEqual({ message: 'Workspace deleted successfully' });
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      const workspaceOwnedByOther = {
        ...mockWorkspace,
        ownerId: 'other-user',
      };
      mockPrismaService.workspace.findUnique.mockResolvedValue(
        workspaceOwnedByOther,
      );

      await expect(service.delete('workspace-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('addMember', () => {
    it('should add a member to workspace', async () => {
      const newMember = {
        id: 'member-2',
        userId: 'user-2',
        workspaceId: 'workspace-1',
        role: WorkspaceRole.MEMBER,
        user: {
          id: 'user-2',
          username: 'newuser',
          email: 'new@example.com',
        },
        workspace: {
          id: 'workspace-1',
          name: 'Test Workspace',
        },
      };

      mockPrismaService.workspace.findUnique.mockResolvedValue(mockWorkspace);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-2',
        email: 'new@example.com',
      });
      mockPrismaService.workspaceMember.create.mockResolvedValue(newMember);

      const result = await service.addMember('workspace-1', 'user-1', {
        userId: 'user-2',
        role: WorkspaceRole.MEMBER,
      });

      expect(result).toEqual(newMember);
      expect(mockNotificationsGateway.sendToUser).toHaveBeenCalledWith(
        'user-2',
        'workspace:joined',
        expect.any(Object),
      );
    });

    it('should throw ConflictException if user is already a member', async () => {
      mockPrismaService.workspace.findUnique.mockResolvedValue(mockWorkspace);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.addMember('workspace-1', 'user-1', {
          userId: 'user-1',
          role: WorkspaceRole.MEMBER,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('removeMember', () => {
    it('should remove a member from workspace', async () => {
      const workspaceWithTwoMembers = {
        ...mockWorkspace,
        members: [
          ...mockWorkspace.members,
          {
            id: 'member-2',
            userId: 'user-2',
            workspaceId: 'workspace-1',
            role: WorkspaceRole.MEMBER,
          },
        ],
      };
      mockPrismaService.workspace.findUnique.mockResolvedValue(
        workspaceWithTwoMembers,
      );
      mockPrismaService.workspaceMember.delete.mockResolvedValue({});

      const result = await service.removeMember(
        'workspace-1',
        'user-1',
        'user-2',
      );

      expect(result).toEqual({ message: 'Member removed successfully' });
    });

    it('should throw ForbiddenException when trying to remove owner', async () => {
      mockPrismaService.workspace.findUnique.mockResolvedValue(mockWorkspace);

      await expect(
        service.removeMember('workspace-1', 'user-1', 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
