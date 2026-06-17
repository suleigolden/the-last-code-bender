import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AwardXpService {
  constructor(private prisma: PrismaService) {}

  async awardXp(
    handle: string,
    eventType: string,
    xp: number,
    metadata?: Record<string, unknown>,
  ) {
    const bender = await this.prisma.bender.findUnique({ where: { handle } });
    if (!bender) throw new Error(`Bender not found: ${handle}`);

    const newXp = bender.xp + xp;
    const oldTier = bender.rank_tier;

    let newTier: string;
    if (bender.is_founder) {
      newTier = 'TheLastCodeBender';
    } else if (newXp >= 600 && bender.community_vote) {
      newTier = 'Master';
    } else if (newXp >= 300 && bender.challenge_wins >= 1) {
      newTier = 'Senior';
    } else if (newXp >= 100) {
      newTier = 'Journeyman';
    } else {
      newTier = 'Apprentice';
    }

    await this.prisma.$transaction([
      this.prisma.bender.update({
        where: { handle },
        data: { xp: newXp, rank_tier: newTier, last_active: new Date() },
      }),
      this.prisma.xpEvent.create({
        data: {
          bender_id: bender.id,
          handle,
          event_type: eventType,
          xp_awarded: xp,
          metadata: metadata as never,
        },
      }),
    ]);

    return {
      handle,
      old_xp: bender.xp,
      new_xp: newXp,
      old_tier: oldTier,
      new_tier: newTier,
      promoted: newTier !== oldTier,
    };
  }
}
