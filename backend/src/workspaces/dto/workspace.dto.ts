import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { WorkspaceRole } from '@prisma/client';

export class CreateWorkspaceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateWorkspaceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AddMemberDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: WorkspaceRole, required: false, default: 'MEMBER' })
  @IsOptional()
  @IsEnum(WorkspaceRole)
  role?: WorkspaceRole;
}

export class AddMembersDto {
  @ApiProperty({ type: [AddMemberDto] })
  @IsArray()
  @ArrayNotEmpty()
  members: AddMemberDto[];
}

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: WorkspaceRole })
  @IsEnum(WorkspaceRole)
  role: WorkspaceRole;
}

export class AssignTaskDto {
  @ApiProperty()
  @IsString()
  assigneeId: string;
}
