import { IsString } from 'class-validator/types/decorator/typechecker/IsString';

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
