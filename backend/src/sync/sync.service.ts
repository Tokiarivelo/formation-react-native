import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Changes,
  TableChanges,
  PullRequestDto,
  PushRequestDto,
} from './dto/sync.dto';

@Injectable()
export class SyncService {
  constructor(private prisma: PrismaService) {}

  /**
   * Pull changes from server since lastPulledAt
   */
  async pullChanges(userId: string, pullRequest: PullRequestDto) {
    const { lastPulledAt } = pullRequest;
    const timestamp = Date.now();

    // Convert lastPulledAt to Date object
    const lastSyncDate = new Date(lastPulledAt);

    // Fetch changes for all tables
    const changes: Changes = {
      users: await this.getUserChanges(userId, lastSyncDate),
      projects: await this.getProjectChanges(userId, lastSyncDate),
      tasks: await this.getTaskChanges(userId, lastSyncDate),
      attachments: await this.getAttachmentChanges(userId, lastSyncDate),
      workspaces: await this.getWorkspaceChanges(userId, lastSyncDate),
      workspace_members: await this.getWorkspaceMemberChanges(
        userId,
        lastSyncDate,
      ),
    };

    return {
      changes,
      timestamp,
    };
  }

  /**
   * Push client changes to server
   */
  async pushChanges(userId: string, pushRequest: PushRequestDto) {
    const { changes } = pushRequest;

    try {
      // Process changes in a transaction
      await this.prisma.$transaction(async (tx) => {
        // Process each table
        for (const [tableName, tableChanges] of Object.entries(changes)) {
          await this.applyTableChanges(
            tx,
            userId,
            tableName,
            tableChanges as TableChanges,
          );
        }
      });

      return {
        success: true,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to push changes: ${error.message}`,
      );
    }
  }

  /**
   * Apply changes for a specific table
   */
  private async applyTableChanges(
    tx: any,
    userId: string,
    tableName: string,
    tableChanges: TableChanges,
  ) {
    const { created, updated, deleted } = tableChanges;

    // Get the Prisma model delegate
    const model = this.getModelDelegate(tx, tableName);
    if (!model) {
      return; // Skip unknown tables
    }

    // Handle created records
    for (const record of created || []) {
      // Skip if record already exists
      const existing = await model.findUnique({ where: { id: record.id } });
      if (!existing) {
        await model.create({
          data: this.sanitizeRecord(record, tableName),
        });
      }
    }

    // Handle updated records
    for (const record of updated || []) {
      // Update with merge strategy (client wins for updated columns)
      const existing = await model.findUnique({ where: { id: record.id } });
      if (existing) {
        await model.update({
          where: { id: record.id },
          data: this.sanitizeRecord(record, tableName),
        });
      }
    }

    // Handle deleted records
    for (const recordId of deleted || []) {
      try {
        await model.delete({ where: { id: recordId } });
      } catch (error) {
        // Record might not exist, continue
      }
    }
  }

  /**
   * Get Prisma model delegate for a table name
   */
  private getModelDelegate(tx: any, tableName: string) {
    const modelMap: { [key: string]: any } = {
      users: tx.user,
      projects: tx.project,
      tasks: tx.task,
      attachments: tx.attachment,
      workspaces: tx.workspace,
      workspace_members: tx.workspaceMember,
    };
    return modelMap[tableName];
  }

  /**
   * Sanitize record to remove undefined values and prepare for Prisma
   */
  private sanitizeRecord(record: any, tableName: string): any {
    const sanitized: any = { ...record };

    // Remove undefined values
    Object.keys(sanitized).forEach((key) => {
      if (sanitized[key] === undefined) {
        delete sanitized[key];
      }
    });

    // Convert date strings to Date objects
    if (sanitized.createdAt) {
      sanitized.createdAt = new Date(sanitized.createdAt);
    }
    if (sanitized.updatedAt) {
      sanitized.updatedAt = new Date(sanitized.updatedAt);
    }
    if (sanitized.dueDate) {
      sanitized.dueDate = new Date(sanitized.dueDate);
    }
    if (sanitized.startDate) {
      sanitized.startDate = new Date(sanitized.startDate);
    }
    if (sanitized.endDate) {
      sanitized.endDate = new Date(sanitized.endDate);
    }

    return sanitized;
  }

  /**
   * Get user changes
   */
  private async getUserChanges(
    userId: string,
    lastSyncDate: Date,
  ): Promise<TableChanges> {
    // Only return the current user's data
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const created = [];
    const updated = [];

    if (user) {
      if (user.createdAt > lastSyncDate) {
        created.push(this.convertToRawRecord(user));
      } else if (user.updatedAt > lastSyncDate) {
        updated.push(this.convertToRawRecord(user));
      }
    }

    return { created, updated, deleted: [] };
  }

  /**
   * Get project changes
   */
  private async getProjectChanges(
    userId: string,
    lastSyncDate: Date,
  ): Promise<TableChanges> {
    const projects = await this.prisma.project.findMany({
      where: {
        OR: [
          { userId },
          {
            workspace: {
              OR: [{ ownerId: userId }, { members: { some: { userId } } }],
            },
          },
        ],
      },
    });

    const created = projects
      .filter((p) => p.createdAt > lastSyncDate)
      .map(this.convertToRawRecord);

    const updated = projects
      .filter((p) => p.updatedAt > lastSyncDate && p.createdAt <= lastSyncDate)
      .map(this.convertToRawRecord);

    return { created, updated, deleted: [] };
  }

  /**
   * Get task changes
   */
  private async getTaskChanges(
    userId: string,
    lastSyncDate: Date,
  ): Promise<TableChanges> {
    const tasks = await this.prisma.task.findMany({
      where: {
        OR: [{ userId }, { assigneeId: userId }],
      },
    });

    const created = tasks
      .filter((t) => t.createdAt > lastSyncDate)
      .map(this.convertToRawRecord);

    const updated = tasks
      .filter((t) => t.updatedAt > lastSyncDate && t.createdAt <= lastSyncDate)
      .map(this.convertToRawRecord);

    return { created, updated, deleted: [] };
  }

  /**
   * Get attachment changes
   */
  private async getAttachmentChanges(
    userId: string,
    lastSyncDate: Date,
  ): Promise<TableChanges> {
    const attachments = await this.prisma.attachment.findMany({
      where: { userId },
    });

    const created = attachments
      .filter((a) => a.createdAt > lastSyncDate)
      .map(this.convertToRawRecord);

    const updated = attachments
      .filter((a) => a.updatedAt > lastSyncDate && a.createdAt <= lastSyncDate)
      .map(this.convertToRawRecord);

    return { created, updated, deleted: [] };
  }

  /**
   * Get workspace changes
   */
  private async getWorkspaceChanges(
    userId: string,
    lastSyncDate: Date,
  ): Promise<TableChanges> {
    const workspaces = await this.prisma.workspace.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
    });

    const created = workspaces
      .filter((w) => w.createdAt > lastSyncDate)
      .map(this.convertToRawRecord);

    const updated = workspaces
      .filter((w) => w.updatedAt > lastSyncDate && w.createdAt <= lastSyncDate)
      .map(this.convertToRawRecord);

    return { created, updated, deleted: [] };
  }

  /**
   * Get workspace member changes
   */
  private async getWorkspaceMemberChanges(
    userId: string,
    lastSyncDate: Date,
  ): Promise<TableChanges> {
    const members = await this.prisma.workspaceMember.findMany({
      where: {
        OR: [
          { userId },
          { workspace: { ownerId: userId } },
          { workspace: { members: { some: { userId } } } },
        ],
      },
    });

    const created = members
      .filter((m) => m.createdAt > lastSyncDate)
      .map(this.convertToRawRecord);

    const updated = members
      .filter((m) => m.updatedAt > lastSyncDate && m.createdAt <= lastSyncDate)
      .map(this.convertToRawRecord);

    return { created, updated, deleted: [] };
  }

  /**
   * Convert Prisma model to raw record format
   */
  private convertToRawRecord(model: any): any {
    const raw: any = {};

    for (const [key, value] of Object.entries(model)) {
      if (value instanceof Date) {
        raw[key] = value.getTime();
      } else {
        raw[key] = value;
      }
    }

    return raw;
  }
}
