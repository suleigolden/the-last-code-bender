import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AwardXpService } from '../common/award-xp.service';

@Injectable()
export class WorkspaceService {
  constructor(
    private prisma: PrismaService,
    private awardXpService: AwardXpService,
  ) {}

  async getWorkspace(benderId: string) {
    const data = await this.prisma.benderProfileWorkspace.findUnique({
      where: { bender_id: benderId },
    });
    if (!data) return null;
    return {
      bender_id: data.bender_id,
      files: this.castFiles(data.files),
      updated_at: data.updated_at,
    };
  }

  getSnapshots(benderId: string) {
    return this.prisma.benderProfileSnapshot.findMany({
      where: { bender_id: benderId },
      select: { id: true, commit_message: true, created_at: true },
      orderBy: { created_at: 'desc' },
      take: 20,
    });
  }

  async getSnapshotFiles(snapshotId: string) {
    const snap = await this.prisma.benderProfileSnapshot.findUnique({
      where: { id: snapshotId },
      select: { files: true },
    });
    if (!snap) return null;
    return this.castFiles(snap.files);
  }

  async save(input: {
    benderId: string;
    files: Record<string, string>;
    commitMessage: string;
    handle?: string;
  }) {
    const now = new Date();

    await this.prisma.benderProfileWorkspace.upsert({
      where: { bender_id: input.benderId },
      update: { files: input.files as never, updated_at: now },
      create: { bender_id: input.benderId, files: input.files as never, updated_at: now },
    });

    const snapshot = await this.prisma.benderProfileSnapshot.create({
      data: {
        bender_id: input.benderId,
        commit_message: input.commitMessage.trim() || 'Update profile',
        files: input.files as never,
      },
    });

    // Award XP for workspace save (mirrors the old DB trigger)
    if (input.handle && input.commitMessage.trim()) {
      await this.awardXpService.awardXp(input.handle, 'workspace_save', 10, {
        commit_message: input.commitMessage,
        snapshot_id: snapshot.id,
      });
    }

    return snapshot;
  }

  private castFiles(raw: unknown): Record<string, string> {
    if (!raw || typeof raw !== 'object') return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof v === 'string') out[k] = v;
    }
    return out;
  }
}
