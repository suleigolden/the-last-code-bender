import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { AwardXpService } from '../common/award-xp.service';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, AwardXpService],
})
export class WorkspaceModule {}
