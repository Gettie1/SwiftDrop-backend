import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { JWTPayload } from '../strategies/at.strategy';

interface RequestWithUser extends Request {
  user?: JWTPayload;
}
export class RolesGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user || !user.role) {
      return false;
    }
    const dbUser = await this.userRepository.findOne({
      where: { id: parseInt(user.sub.toString()) },
      select: ['id', 'role'],
    });
    if (!dbUser) {
      return false;
    }
    return requiredRoles.some(
      (role) => dbUser.role.toString() === role.toString(),
    );
  }
}
