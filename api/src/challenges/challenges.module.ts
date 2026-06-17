import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { AwardXpService } from '../common/award-xp.service';

@Module({
  controllers: [ChallengesController],
  providers: [ChallengesService, AwardXpService],
})
export class ChallengesModule {}
