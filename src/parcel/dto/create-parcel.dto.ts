import { IsString } from 'class-validator';

export class CreateParcelDto {
  @IsString()
  description: string;
  @IsString()
  weight: string;
  @IsString()
  pickupAddress: string;
  @IsString()
  destinationAddress: string;
  @IsString()
  status: string;
  @IsString()
  senderId: string;
  @IsString()
  courierId?: string;
}
