import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';

// Raw record type for WatermelonDB
export interface RawRecord {
  id: string;
  [key: string]: any;
}

// Changes structure for each table
export interface TableChanges {
  created: RawRecord[];
  updated: RawRecord[];
  deleted: string[];
}

// Main changes object
export interface Changes {
  [tableName: string]: TableChanges;
}

export class PullRequestDto {
  @ApiProperty({
    description:
      'Timestamp of last pull (in milliseconds). Use 0 for initial sync.',
    example: 0,
  })
  @IsNumber()
  lastPulledAt: number;

  @ApiProperty({
    description: 'Schema version of the client',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  schemaVersion?: number;

  @ApiProperty({
    description: 'Migration object for schema changes',
    required: false,
  })
  @IsOptional()
  @IsObject()
  migration?: any;
}

export class PullResponseDto {
  @ApiProperty({
    description: 'Changes object containing all table updates',
  })
  changes: Changes;

  @ApiProperty({
    description: 'Current server timestamp for next sync',
    example: 1670000000000,
  })
  timestamp: number;
}

export class PushRequestDto {
  @ApiProperty({
    description: 'Changes to push to server',
  })
  @IsObject()
  changes: Changes;

  @ApiProperty({
    description: 'Timestamp of last pull (for conflict detection)',
    example: 1670000000000,
  })
  @IsNumber()
  lastPulledAt: number;
}

export class PushResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Optional error message',
    required: false,
  })
  message?: string;
}
