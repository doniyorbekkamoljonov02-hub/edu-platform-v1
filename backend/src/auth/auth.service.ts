import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { ALLOWED_REGISTER_ROLES, RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export type { Tokens };


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<Tokens> {
    if (!ALLOWED_REGISTER_ROLES.includes(dto.role as any)) {
      throw new BadRequestException(
        'Ushbu rol bilan ro‘yxatdan o‘tish ruxsat etilmagan.',
      );
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Bu email bilan foydalanuvchi allaqachon mavjud.');
    }

    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role: dto.role,
      isActive: true,
    });

    return this.issueTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email yoki parol noto‘g‘ri.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Hisobingiz bloklangan. Administratorga murojaat qiling.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Email yoki parol noto‘g‘ri.');
    }

    return this.issueTokens(user.id, user.email, user.role);
  }

  async me(userId: string) {
    const user = await this.usersService.findOne(userId);
    return { userId: user.id, id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role, avatarUrl: user.avatarUrl, isActive: user.isActive };
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    let payload: { sub: string; email: string; role: string };
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token yaroqsiz yoki muddati tugagan.');
    }

    const user = await this.usersService.findOne(payload.sub).catch(() => null);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Hisob faol emas yoki topilmadi.');
    }

    return this.issueTokens(user.id, user.email, user.role);
  }

  /**
   * Sending a reset email requires a mail provider, which is not wired up
   * yet — this is intentionally left as a clear stub rather than a fake
   * "email sent" response.
   */
  forgotPassword(_dto: ForgotPasswordDto): never {
    throw new NotImplementedException('Parolni tiklash xizmati hali ulanmagan.');
  }

  resetPassword(_dto: ResetPasswordDto): never {
    throw new NotImplementedException('Parolni tiklash xizmati hali ulanmagan.');
  }

  private async issueTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });

    return { accessToken, refreshToken };
  }
}
