import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

export interface GitHubProfile {
  id: string;
  username: string;
  displayName: string | null;
  photos: Array<{ value: string }>;
  emails: Array<{ value: string }> | undefined;
}

export interface JwtPayload {
  sub: string;
  github_login: string;
  avatar_url: string | null;
  email: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findOrCreateUser(profile: GitHubProfile) {
    const github_id = BigInt(profile.id);
    const github_login = profile.username;
    const avatar_url = profile.photos?.[0]?.value ?? null;
    const email = profile.emails?.[0]?.value ?? null;
    const name = profile.displayName ?? null;

    return this.prisma.user.upsert({
      where: { github_id },
      update: { avatar_url, email, name, last_sign_in: new Date() },
      create: { github_id, github_login, avatar_url, email, name },
    });
  }

  generateJwt(user: { id: string; github_login: string; avatar_url: string | null; email: string | null }) {
    const payload: JwtPayload = {
      sub: user.id,
      github_login: user.github_login,
      avatar_url: user.avatar_url,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }
}
