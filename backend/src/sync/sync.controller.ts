import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SyncService } from './sync.service';
import {
  PullRequestDto,
  PullResponseDto,
  PushRequestDto,
  PushResponseDto,
} from './dto/sync.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Sync')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('sync')
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Post('pull')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Pull changes from server (WatermelonDB sync)',
    description:
      'Fetches all changes since lastPulledAt timestamp for offline-first sync',
  })
  @ApiResponse({
    status: 200,
    description: 'Changes retrieved successfully',
    type: PullResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async pullChanges(
    @CurrentUser() user: any,
    @Body() pullRequest: PullRequestDto,
  ): Promise<PullResponseDto> {
    return this.syncService.pullChanges(user.id, pullRequest);
  }

  @Post('push')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Push changes to server (WatermelonDB sync)',
    description:
      'Applies client changes to server database with conflict resolution',
  })
  @ApiResponse({
    status: 200,
    description: 'Changes applied successfully',
    type: PushResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async pushChanges(
    @CurrentUser() user: any,
    @Body() pushRequest: PushRequestDto,
  ): Promise<PushResponseDto> {
    return this.syncService.pushChanges(user.id, pushRequest);
  }
}
