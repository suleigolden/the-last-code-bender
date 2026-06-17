import { Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { AwardXpService } from '../common/award-xp.service';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService, AwardXpService],
})
export class SkillsModule {}
