import { Body, Controller, Get, NotFoundException, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkspaceService } from './workspace.service';

@Controller('workspace')
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Get(':benderId')
  @UseGuards(JwtAuthGuard)
  async getWorkspace(@Param('benderId') benderId: string) {
    return this.workspaceService.getWorkspace(benderId);
  }

  @Get(':benderId/snapshots')
  @UseGuards(JwtAuthGuard)
  getSnapshots(@Param('benderId') benderId: string) {
    return this.workspaceService.getSnapshots(benderId);
  }

  @Get('snapshots/:snapshotId')
  @UseGuards(JwtAuthGuard)
  async getSnapshotFiles(@Param('snapshotId') snapshotId: string) {
    const files = await this.workspaceService.getSnapshotFiles(snapshotId);
    if (!files) throw new NotFoundException('Snapshot not found');
    return files;
  }

  @Put(':benderId')
  @UseGuards(JwtAuthGuard)
  save(
    @Param('benderId') benderId: string,
    @Body() body: { files: Record<string, string>; commitMessage: string; handle?: string },
  ) {
    return this.workspaceService.save({ benderId, ...body });
  }
}
