import { IsString } from 'class-validator';

export class CreateParcelDto {
  @IsString()
  description: string;
  @IsString()
  weight: number;
  @IsString()
  pickupAddress: string;
  @IsString()
  destinationAddress: string;
  @IsString()
  status: string;
  @IsString()
  senderId: number;
  @IsString()
  courierId?: number;
  @IsString()
  recipientId?: number;
}
