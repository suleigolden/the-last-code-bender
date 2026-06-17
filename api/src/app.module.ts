import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BendersModule } from './benders/benders.module';
import { ChallengesModule } from './challenges/challenges.module';
import { SkillsModule } from './skills/skills.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    BendersModule,
    ChallengesModule,
    SkillsModule,
    WorkspaceModule,
    LeaderboardModule,
  ],
})
export class AppModule {}
