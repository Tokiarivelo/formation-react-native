import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AttachmentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async upload(
    userId: string,
    file: Express.Multer.File,
    projectId?: string,
    taskId?: string,
  ) {
    // Verify ownership of project/task if provided
    if (projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!project || project.userId !== userId) {
        throw new ForbiddenException('Access denied to project');
      }
    }

    if (taskId) {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!task || task.userId !== userId) {
        throw new ForbiddenException('Access denied to task');
      }
    }

    return this.prisma.attachment.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        userId,
        projectId,
        taskId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        project: projectId ? {
          select: {
            id: true,
            name: true,
          },
        } : false,
        task: taskId ? {
          select: {
            id: true,
            title: true,
          },
        } : false,
      },
    });
  }

  async findAll(userId: string, projectId?: string, taskId?: string) {
    const where: any = { userId };
    if (projectId) {
      where.projectId = projectId;
    }
    if (taskId) {
      where.taskId = taskId;
    }

    return this.prisma.attachment.findMany({
      where,
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
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
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
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    if (attachment.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return attachment;
  }

  async delete(id: string, userId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    if (attachment.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Delete file from filesystem
    try {
      if (fs.existsSync(attachment.path)) {
        fs.unlinkSync(attachment.path);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    await this.prisma.attachment.delete({ where: { id } });
    return { message: 'Attachment deleted successfully' };
  }

  async getFilePath(id: string, userId: string): Promise<string> {
    const attachment = await this.findById(id, userId);
    return attachment.path;
  }
}