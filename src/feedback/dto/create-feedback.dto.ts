import { IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  parcelId: string;
  @IsString()
  senderId: string;
  @IsString()
  courierId: string;
  @IsString()
  rating: string;
  @IsString()
  comment: string;
}
