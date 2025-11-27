import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  AddMemberDto,
  AddMembersDto,
  UpdateMemberRoleDto,
  AssignTaskDto,
} from './dto/workspace.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Workspaces')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({ status: 201, description: 'Workspace created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return this.workspacesService.create(user.id, createWorkspaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workspaces for the current user' })
  @ApiResponse({ status: 200, description: 'Workspaces retrieved successfully' })
  async findAll(@CurrentUser() user: any) {
    return this.workspacesService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workspace by ID' })
  @ApiResponse({ status: 200, description: 'Workspace retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.workspacesService.findById(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update workspace by ID' })
  @ApiResponse({ status: 200, description: 'Workspace updated successfully' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(id, user.id, updateWorkspaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workspace by ID' })
  @ApiResponse({ status: 200, description: 'Workspace deleted successfully' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.workspacesService.delete(id, user.id);
  }

  // Member management endpoints
  @Get(':id/members')
  @ApiOperation({ summary: 'Get all members of a workspace' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getMembers(@Param('id') id: string, @CurrentUser() user: any) {
    return this.workspacesService.getMembers(id, user.id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a member to workspace' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 404, description: 'Workspace or user not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 409, description: 'User already a member' })
  async addMember(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.workspacesService.addMember(id, user.id, addMemberDto);
  }

  @Post(':id/members/batch')
  @ApiOperation({ summary: 'Add multiple members to workspace' })
  @ApiResponse({ status: 201, description: 'Members added successfully' })
  @ApiResponse({ status: 404, description: 'Workspace or user not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async addMembers(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() addMembersDto: AddMembersDto,
  ) {
    return this.workspacesService.addMembers(id, user.id, addMembersDto.members);
  }

  @Put(':id/members/:memberId/role')
  @ApiOperation({ summary: 'Update member role' })
  @ApiResponse({ status: 200, description: 'Member role updated successfully' })
  @ApiResponse({ status: 404, description: 'Workspace or member not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: any,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
  ) {
    return this.workspacesService.updateMemberRole(
      id,
      user.id,
      memberId,
      updateMemberRoleDto,
    );
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove a member from workspace' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 404, description: 'Workspace or member not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: any,
  ) {
    return this.workspacesService.removeMember(id, user.id, memberId);
  }

  // Project management within workspace
  @Get(':id/projects')
  @ApiOperation({ summary: 'Get all projects in workspace' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getProjects(@Param('id') id: string, @CurrentUser() user: any) {
    return this.workspacesService.getProjects(id, user.id);
  }

  @Post(':id/projects')
  @ApiOperation({ summary: 'Create a project in workspace' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async createProject(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() projectData: { name: string; description?: string },
  ) {
    return this.workspacesService.createProject(id, user.id, projectData);
  }

  // Task assignment
  @Post(':id/tasks/:taskId/assign')
  @ApiOperation({ summary: 'Assign a task to a workspace member' })
  @ApiResponse({ status: 200, description: 'Task assigned successfully' })
  @ApiResponse({ status: 404, description: 'Workspace or task not found' })
  @ApiResponse({ status: 403, description: 'Access denied or invalid assignee' })
  async assignTask(
    @Param('id') id: string,
    @Param('taskId') taskId: string,
    @CurrentUser() user: any,
    @Body() assignTaskDto: AssignTaskDto,
  ) {
    return this.workspacesService.assignTask(
      id,
      taskId,
      user.id,
      assignTaskDto.assigneeId,
    );
  }

  @Delete(':id/tasks/:taskId/assign')
  @ApiOperation({ summary: 'Unassign a task' })
  @ApiResponse({ status: 200, description: 'Task unassigned successfully' })
  @ApiResponse({ status: 404, description: 'Workspace or task not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async unassignTask(
    @Param('id') id: string,
    @Param('taskId') taskId: string,
    @CurrentUser() user: any,
  ) {
    return this.workspacesService.unassignTask(id, taskId, user.id);
  }
}
