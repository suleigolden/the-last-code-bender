import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getLeaderboard(limit = 100) {
    const benders = await this.prisma.bender.findMany({
      select: {
        handle: true,
        github: true,
        discipline: true,
        rank: true,
        rank_tier: true,
        xp: true,
        challenge_wins: true,
        skill_live: true,
        avatar_url: true,
        is_founder: true,
      },
      orderBy: [{ is_founder: 'desc' }, { xp: 'desc' }],
      take: limit,
    });

    return benders.map((b, i) => ({ ...b, position: i + 1 }));
  }

  getXpEvents(handle: string) {
    return this.prisma.xpEvent.findMany({
      where: { handle },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
  }
}
