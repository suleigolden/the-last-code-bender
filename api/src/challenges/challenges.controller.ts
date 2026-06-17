import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChallengesService } from './challenges.service';
import type { Request } from 'express';

@Controller('challenges')
export class ChallengesController {
  constructor(private challengesService: ChallengesService) {}

  @Get()
  findAll() {
    return this.challengesService.findAll();
  }

  @Get('submissions/:handle')
  @UseGuards(JwtAuthGuard)
  mySubmissions(@Param('handle') handle: string) {
    return this.challengesService.findMySubmissions(handle);
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  submit(
    @Body()
    body: {
      challenge_id: string;
      challenge_slug: string;
      handle: string;
      github: string;
      content: string;
      language?: string;
      stack?: unknown;
    },
    @Req() req: Request,
  ) {
    const user = req.user as AuthUser;
    return this.challengesService.submit({ ...body, github: body.github || user.github_login });
  }
}
