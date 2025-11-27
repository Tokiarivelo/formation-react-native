import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  AddMemberDto,
  UpdateMemberRoleDto,
} from './dto/workspace.dto';
import { WorkspaceRole } from '@prisma/client';

@Injectable()
export class WorkspacesService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(userId: string, createWorkspaceDto: CreateWorkspaceDto) {
    const workspace = await this.prisma.workspace.create({
      data: {
        ...createWorkspaceDto,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: WorkspaceRole.ADMIN,
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
    });

    // Notify the creator
    this.notificationsGateway.sendToUser(userId, 'workspace:created', {
      workspace,
    });

    return workspace;
  }

  async findAll(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        projects: {
          include: {
            _count: {
              select: {
                tasks: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if user has access (is owner or member)
    const isMember = workspace.members.some((m) => m.userId === userId);
    if (workspace.ownerId !== userId && !isMember) {
      throw new ForbiddenException('Access denied');
    }

    return workspace;
  }

  async update(
    id: string,
    userId: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if user is owner or admin
    const member = workspace.members.find((m) => m.userId === userId);
    const isAdmin =
      workspace.ownerId === userId || member?.role === WorkspaceRole.ADMIN;

    if (!isAdmin) {
      throw new ForbiddenException('Only owners and admins can update workspace');
    }

    const updatedWorkspace = await this.prisma.workspace.update({
      where: { id },
      data: updateWorkspaceDto,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
    });

    // Notify all workspace members about the update
    this.notifyWorkspaceMembers(id, 'workspace:updated', {
      workspace: updatedWorkspace,
    });

    return updatedWorkspace;
  }

  async delete(id: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can delete a workspace');
    }

    // Notify all members before deletion
    this.notifyWorkspaceMembers(id, 'workspace:deleted', {
      workspaceId: id,
      workspaceName: workspace.name,
    });

    await this.prisma.workspace.delete({ where: { id } });
    return { message: 'Workspace deleted successfully' };
  }

  // Member management
  async addMember(
    workspaceId: string,
    userId: string,
    addMemberDto: AddMemberDto,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if user is owner or admin
    const member = workspace.members.find((m) => m.userId === userId);
    const isAdmin =
      workspace.ownerId === userId || member?.role === WorkspaceRole.ADMIN;

    if (!isAdmin) {
      throw new ForbiddenException('Only owners and admins can add members');
    }

    // Check if user to be added exists
    const userToAdd = await this.prisma.user.findUnique({
      where: { id: addMemberDto.userId },
    });

    if (!userToAdd) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a member
    const existingMember = workspace.members.find(
      (m) => m.userId === addMemberDto.userId,
    );

    if (existingMember) {
      throw new ConflictException('User is already a member of this workspace');
    }

    const newMember = await this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: addMemberDto.userId,
        role: addMemberDto.role || WorkspaceRole.MEMBER,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Notify all workspace members about the new member
    this.notifyWorkspaceMembers(workspaceId, 'workspace:member:added', {
      member: newMember,
    });

    // Notify the newly added member
    this.notificationsGateway.sendToUser(
      addMemberDto.userId,
      'workspace:joined',
      {
        workspace: newMember.workspace,
      },
    );

    return newMember;
  }

  async addMembers(
    workspaceId: string,
    userId: string,
    members: AddMemberDto[],
  ) {
    const results = await Promise.all(
      members.map((m) => this.addMember(workspaceId, userId, m)),
    );
    return results;
  }

  async removeMember(workspaceId: string, userId: string, memberUserId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if user is owner or admin (or removing themselves)
    const member = workspace.members.find((m) => m.userId === userId);
    const isAdmin =
      workspace.ownerId === userId || member?.role === WorkspaceRole.ADMIN;
    const isSelf = userId === memberUserId;

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException(
        'Only owners and admins can remove members',
      );
    }

    // Cannot remove the owner
    if (memberUserId === workspace.ownerId) {
      throw new ForbiddenException('Cannot remove the workspace owner');
    }

    const memberToRemove = workspace.members.find(
      (m) => m.userId === memberUserId,
    );

    if (!memberToRemove) {
      throw new NotFoundException('Member not found in workspace');
    }

    await this.prisma.workspaceMember.delete({
      where: { id: memberToRemove.id },
    });

    // Notify all workspace members about the removal
    this.notifyWorkspaceMembers(workspaceId, 'workspace:member:removed', {
      workspaceId,
      userId: memberUserId,
    });

    // Notify the removed member
    this.notificationsGateway.sendToUser(
      memberUserId,
      'workspace:removed',
      {
        workspaceId,
        workspaceName: workspace.name,
      },
    );

    return { message: 'Member removed successfully' };
  }

  async updateMemberRole(
    workspaceId: string,
    userId: string,
    memberUserId: string,
    updateMemberRoleDto: UpdateMemberRoleDto,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Only owner can change roles
    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can change member roles');
    }

    const memberToUpdate = workspace.members.find(
      (m) => m.userId === memberUserId,
    );

    if (!memberToUpdate) {
      throw new NotFoundException('Member not found in workspace');
    }

    const updatedMember = await this.prisma.workspaceMember.update({
      where: { id: memberToUpdate.id },
      data: { role: updateMemberRoleDto.role },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    // Notify all workspace members about the role change
    this.notifyWorkspaceMembers(workspaceId, 'workspace:member:role:updated', {
      member: updatedMember,
    });

    return updatedMember;
  }

  async getMembers(workspaceId: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if user has access
    const isMember = workspace.members.some((m) => m.userId === userId);
    if (workspace.ownerId !== userId && !isMember) {
      throw new ForbiddenException('Access denied');
    }

    return workspace.members;
  }

  // Project management within workspace
  async createProject(
    workspaceId: string,
    userId: string,
    projectData: { name: string; description?: string },
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if user is a member
    const isMember = workspace.members.some((m) => m.userId === userId);
    if (workspace.ownerId !== userId && !isMember) {
      throw new ForbiddenException('Access denied');
    }

    const project = await this.prisma.project.create({
      data: {
        ...projectData,
        userId,
        workspaceId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    // Notify all workspace members about the new project
    this.notifyWorkspaceMembers(workspaceId, 'workspace:project:created', {
      project,
    });

    return project;
  }

  async getProjects(workspaceId: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if user is a member
    const isMember = workspace.members.some((m) => m.userId === userId);
    if (workspace.ownerId !== userId && !isMember) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.project.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Task assignment
  async assignTask(
    workspaceId: string,
    taskId: string,
    userId: string,
    assigneeId: string,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: true,
        projects: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if user is a member
    const isMember = workspace.members.some((m) => m.userId === userId);
    if (workspace.ownerId !== userId && !isMember) {
      throw new ForbiddenException('Access denied');
    }

    // Find the task in the workspace's projects
    const task = workspace.projects
      .flatMap((p) => p.tasks)
      .find((t) => t.id === taskId);

    if (!task) {
      throw new NotFoundException('Task not found in this workspace');
    }

    // Check if assignee is a member of the workspace
    const assigneeMember = workspace.members.find(
      (m) => m.userId === assigneeId,
    );
    if (!assigneeMember && workspace.ownerId !== assigneeId) {
      throw new ForbiddenException(
        'Assignee must be a member of the workspace',
      );
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: { assigneeId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        assignee: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Notify all workspace members about the assignment
    this.notifyWorkspaceMembers(workspaceId, 'workspace:task:assigned', {
      task: updatedTask,
    });

    // Notify the assignee specifically
    if (assigneeId !== userId) {
      this.notificationsGateway.sendToUser(assigneeId, 'task:assigned', {
        task: updatedTask,
      });
    }

    return updatedTask;
  }

  async unassignTask(workspaceId: string, taskId: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: true,
        projects: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Check if user is a member
    const isMember = workspace.members.some((m) => m.userId === userId);
    if (workspace.ownerId !== userId && !isMember) {
      throw new ForbiddenException('Access denied');
    }

    // Find the task in the workspace's projects
    const task = workspace.projects
      .flatMap((p) => p.tasks)
      .find((t) => t.id === taskId);

    if (!task) {
      throw new NotFoundException('Task not found in this workspace');
    }

    const previousAssigneeId = task.assigneeId;

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: { assigneeId: null },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Notify all workspace members about the unassignment
    this.notifyWorkspaceMembers(workspaceId, 'workspace:task:unassigned', {
      task: updatedTask,
    });

    // Notify the previous assignee if there was one
    if (previousAssigneeId && previousAssigneeId !== userId) {
      this.notificationsGateway.sendToUser(
        previousAssigneeId,
        'task:unassigned',
        {
          task: updatedTask,
        },
      );
    }

    return updatedTask;
  }

  // Helper method to notify all members of a workspace
  private async notifyWorkspaceMembers(
    workspaceId: string,
    event: string,
    data: Record<string, unknown>,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: true,
      },
    });

    if (workspace) {
      // Notify owner
      this.notificationsGateway.sendToUser(workspace.ownerId, event, data);

      // Notify all members
      for (const member of workspace.members) {
        if (member.userId !== workspace.ownerId) {
          this.notificationsGateway.sendToUser(member.userId, event, data);
        }
      }
    }
  }
}
