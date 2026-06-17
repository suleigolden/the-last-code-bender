import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller()
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get('leaderboard')
  getLeaderboard() {
    return this.leaderboardService.getLeaderboard();
  }

  @Get('xp/:handle')
  getXpEvents(@Param('handle') handle: string) {
    return this.leaderboardService.getXpEvents(handle);
  }
}
