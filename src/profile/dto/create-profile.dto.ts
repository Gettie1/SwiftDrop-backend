import { IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
  @IsString()
  address: string;

  @IsString()
  phoneNumber: string;
  @IsString()
  userId: string;
}
