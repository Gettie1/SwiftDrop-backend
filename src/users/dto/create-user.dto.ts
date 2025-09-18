import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsEnum(Role)
  role: Role;
}
