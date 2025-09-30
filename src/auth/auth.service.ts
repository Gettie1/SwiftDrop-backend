import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private async getTokens(userId: string, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRE_IN',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRE_IN',
          ),
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  private async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }
  private async saveRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, { hashedRefreshToken });
  }
  async signIn(createAuthDto: CreateAuthDto) {
    const user = await this.usersService.findByEmail(createAuthDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatches = await bcrypt.compare(
      createAuthDto.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { access_token, refresh_token } = await this.getTokens(
      user.id.toString(),
      user.email,
      user.role,
    );
    await this.saveRefreshToken(user.id, refresh_token);
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
      access_token,
      refresh_token,
    };
  }
}
