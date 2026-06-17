import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BendersService } from './benders.service';
import type { Request } from 'express';

@Controller('benders')
export class BendersController {
  constructor(private bendersService: BendersService) {}

  @Get()
  findAll() {
    return this.bendersService.findAll();
  }

  @Get('search')
  search(@Query('q') q: string) {
    if (!q || q.length < 2) return [];
    return this.bendersService.search(q);
  }

  @Get('recruiter')
  recruiterSearch(
    @Query('disciplines') disciplines: string,
    @Query('openToWork') openToWork: string,
    @Query('minRank') minRank: string,
    @Query('mustHaveStack') mustHaveStack: string,
    @Query('sortBy') sortBy: string,
    @Query('q') query: string,
  ) {
    return this.bendersService.recruiterSearch({
      disciplines: disciplines ? disciplines.split(',') : undefined,
      openToWork,
      minRank,
      mustHaveStack,
      sortBy,
      query,
    });
  }

  @Get('by-discipline/:discipline')
  findByDiscipline(@Param('discipline') discipline: string) {
    return this.bendersService.findByDiscipline(discipline);
  }

  @Get(':handle')
  async findByHandle(@Param('handle') handle: string) {
    const bender = await this.bendersService.findByHandle(handle);
    if (!bender) throw new NotFoundException('Bender not found');
    return bender;
  }

  @Get(':handle/available')
  async isHandleAvailable(@Param('handle') handle: string) {
    const available = await this.bendersService.isHandleAvailable(handle);
    return { available };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  register(
    @Body()
    body: {
      handle: string;
      github: string;
      github_login: string;
      discipline: string;
      profile_url: string;
      avatar_url: string | null;
    },
  ) {
    return this.bendersService.register(body);
  }

  @Patch(':handle/demo')
  @UseGuards(JwtAuthGuard)
  updateDemo(
    @Param('handle') handle: string,
    @Body() body: { demo_url: string; demo_description?: string; demo_type?: string },
  ) {
    return this.bendersService.updateDemo(handle, body.demo_url, body.demo_description, body.demo_type);
  }

  @Patch(':handle/open-to-work')
  @UseGuards(JwtAuthGuard)
  updateOpenToWork(
    @Param('handle') handle: string,
    @Body() body: { open_to_work: boolean },
  ) {
    return this.bendersService.updateOpenToWork(handle, body.open_to_work);
  }

  @Post(':handle/demo-views')
  async trackDemoView(@Param('handle') handle: string, @Req() req: Request) {
    const viewer_ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.ip ?? null;
    await this.bendersService.trackDemoView(handle, viewer_ip);
    return { ok: true };
  }
}
