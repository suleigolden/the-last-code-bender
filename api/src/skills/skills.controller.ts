import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SkillsService } from './skills.service';
import type { Response } from 'express';

@Controller('skills')
export class SkillsController {
  constructor(private skillsService: SkillsService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  generateSkill(
    @Body()
    body: {
      handle: string;
      github_username: string;
      discipline: string;
      force_refresh?: boolean;
    },
  ) {
    return this.skillsService.generateSkill(body);
  }

  @Post('review')
  @UseGuards(JwtAuthGuard)
  reviewSkill(
    @Body()
    body: {
      handle: string;
      skill_content: string;
      stack_content?: string;
    },
  ) {
    return this.skillsService.reviewSkill(body);
  }

  @Patch(':handle/live')
  @UseGuards(JwtAuthGuard)
  updateSkillLive(
    @Param('handle') handle: string,
    @Body() body: { skill_live: boolean },
  ) {
    return this.skillsService.updateSkillLive(handle, body.skill_live);
  }

  @Get(':handle')
  async downloadSkill(@Param('handle') handle: string, @Res() res: Response) {
    const content = await this.skillsService.getSkillContent(handle);
    if (!content) throw new NotFoundException('Skill not found or not live');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="SKILL.md"`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(content);
  }
}
