import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AwardXpService } from '../common/award-xp.service';

const RANK_TIERS = ['Apprentice', 'Journeyman', 'Senior', 'Master', 'TheLastCodeBender'] as const;

function computeRankTier(rank: number): string {
  if (rank <= 50) return 'Apprentice';
  if (rank <= 100) return 'Journeyman';
  if (rank <= 150) return 'Senior';
  if (rank <= 199) return 'Master';
  return 'TheLastCodeBender';
}

@Injectable()
export class BendersService {
  constructor(
    private prisma: PrismaService,
    private awardXp: AwardXpService,
  ) {}

  findAll() {
    return this.prisma.bender.findMany({ orderBy: { rank: 'asc' } });
  }

  findByHandle(handle: string) {
    return this.prisma.bender.findUnique({ where: { handle } });
  }

  findByDiscipline(discipline: string) {
    return this.prisma.bender.findMany({
      where: { discipline },
      orderBy: { rank: 'asc' },
    });
  }

  async isHandleAvailable(handle: string): Promise<boolean> {
    const bender = await this.prisma.bender.findUnique({
      where: { handle },
      select: { handle: true },
    });
    return bender === null;
  }

  findByGithubLogin(githubLogin: string) {
    return this.prisma.bender.findUnique({ where: { github_login: githubLogin } });
  }

  async search(query: string) {
    return this.prisma.bender.findMany({
      where: { handle: { contains: query, mode: 'insensitive' } },
      orderBy: { xp: 'desc' },
      take: 20,
    });
  }

  async recruiterSearch(filters: {
    disciplines?: string[];
    openToWork?: string;
    minRank?: string;
    mustHaveStack?: string;
    sortBy?: string;
    query?: string;
  }) {
    const where: Record<string, unknown> = { is_founder: false };

    if (filters.disciplines?.length) {
      where.discipline = { in: filters.disciplines };
    }

    if (filters.openToWork === 'Open to work') {
      where.open_to_work = true;
    } else if (filters.openToWork === 'Not looking') {
      where.open_to_work = false;
    }

    if (filters.minRank && filters.minRank !== 'Any') {
      const tierMap: Record<string, string[]> = {
        'Journeyman+': ['Journeyman', 'Senior', 'Master'],
        'Senior+': ['Senior', 'Master'],
        'Master+': ['Master'],
      };
      const tiers = tierMap[filters.minRank];
      if (tiers) where.rank_tier = { in: tiers };
    }

    if (filters.query && filters.query.length >= 2) {
      where.OR = [
        { handle: { contains: filters.query, mode: 'insensitive' } },
        { github: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    const orderByMap: Record<string, object> = {
      'Most XP': { xp: 'desc' },
      'Most recent': { last_active: 'desc' },
      'Most challenge wins': { challenge_wins: 'desc' },
    };
    const orderBy = filters.sortBy ? (orderByMap[filters.sortBy] ?? { xp: 'desc' }) : { xp: 'desc' };

    return this.prisma.bender.findMany({
      where: where as never,
      orderBy: orderBy as never,
      take: 50,
    });
  }

  async register(input: {
    handle: string;
    github: string;
    github_login: string;
    discipline: string;
    profile_url: string;
    avatar_url: string | null;
  }) {
    const lastInDiscipline = await this.prisma.bender.findFirst({
      where: { discipline: input.discipline },
      orderBy: { rank: 'desc' },
      select: { rank: true },
    });

    const nextRank = lastInDiscipline ? lastInDiscipline.rank + 1 : 1;
    const rank_tier = computeRankTier(nextRank);

    return this.prisma.bender.create({
      data: {
        handle: input.handle,
        github: input.github,
        github_login: input.github_login,
        discipline: input.discipline,
        rank: nextRank,
        rank_tier,
        xp: 0,
        skill_version: '1.0.0',
        skill_live: true,
        open_to_work: false,
        challenge_wins: 0,
        demo_url: null,
        demo_description: null,
        demo_type: null,
        demo_views: 0,
        skill_downloads: 0,
        profile_url: input.profile_url,
        avatar_url: input.avatar_url,
      },
    });
  }

  async updateDemo(
    handle: string,
    demo_url: string,
    demo_description?: string,
    demo_type?: string,
  ) {
    const current = await this.prisma.bender.findUnique({
      where: { handle },
      select: { demo_url: true },
    });
    if (!current) throw new NotFoundException('Bender not found');

    const wasNull = !current.demo_url;

    const bender = await this.prisma.bender.update({
      where: { handle },
      data: {
        demo_url,
        demo_description: demo_description ?? null,
        demo_type: demo_type ?? null,
      },
    });

    if (wasNull && demo_url) {
      await this.awardXp.awardXp(handle, 'showcase_deployed', 20, { demo_url });
    }

    return bender;
  }

  async updateOpenToWork(handle: string, open_to_work: boolean) {
    return this.prisma.bender.update({ where: { handle }, data: { open_to_work } });
  }

  async updateSkillLive(handle: string, skill_live: boolean) {
    return this.prisma.bender.update({ where: { handle }, data: { skill_live } });
  }

  getGitHubDataCache(handle: string) {
    return this.prisma.bender.findUnique({
      where: { handle },
      select: { github_data_cache: true, github_synced_at: true, journey_started_at: true },
    });
  }

  async trackDemoView(handle: string, viewer_ip: string | null) {
    return this.prisma.demoView.create({ data: { handle, viewer_ip } });
  }

  getRankTiers() {
    return RANK_TIERS;
  }
}
