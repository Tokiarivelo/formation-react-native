import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import { AttachmentsService } from './attachments.service';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { multerConfig } from './multer.config';

@ApiTags('Attachments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('attachments')
export class AttachmentsController {
  constructor(private attachmentsService: AttachmentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Upload a file attachment' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    type: UploadAttachmentDto,
    required: true,
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
    @Body() uploadDto: UploadAttachmentDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.attachmentsService.upload(
      user.id,
      file,
      uploadDto.projectId,
      uploadDto.taskId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all user attachments' })
  @ApiResponse({ status: 200, description: 'Attachments retrieved successfully' })
  async findAll(
    @CurrentUser() user: any,
    @Query('projectId') projectId?: string,
    @Query('taskId') taskId?: string,
  ) {
    return this.attachmentsService.findAll(user.id, projectId, taskId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attachment by ID' })
  @ApiResponse({ status: 200, description: 'Attachment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.attachmentsService.findById(id, user.id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download attachment file' })
  @ApiResponse({ status: 200, description: 'File downloaded successfully' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async download(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Res() res: Response,
  ) {
    const attachment = await this.attachmentsService.findById(id, user.id);
    const filePath = await this.attachmentsService.getFilePath(id, user.id);
    
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);
    res.setHeader('Content-Type', attachment.mimeType);
    res.sendFile(filePath, { root: '.' });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attachment by ID' })
  @ApiResponse({ status: 200, description: 'Attachment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.attachmentsService.delete(id, user.id);
  }
}