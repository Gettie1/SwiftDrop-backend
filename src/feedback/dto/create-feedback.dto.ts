import { IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  parcelId: number;
  @IsString()
  senderId: number;
  @IsString()
  courierId: number;
  @IsString()
  rating: number;
  @IsString()
  comment: string;
}
