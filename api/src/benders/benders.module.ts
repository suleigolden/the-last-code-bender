import { Module } from '@nestjs/common';
import { BendersController } from './benders.controller';
import { BendersService } from './benders.service';
import { AwardXpService } from '../common/award-xp.service';

@Module({
  controllers: [BendersController],
  providers: [BendersService, AwardXpService],
  exports: [BendersService, AwardXpService],
})
export class BendersModule {}
