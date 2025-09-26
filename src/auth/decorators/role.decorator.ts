import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/entities/user.entity';

export const KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(KEY, roles);
