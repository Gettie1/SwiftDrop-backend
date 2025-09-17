import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ParcelModule } from './parcel/parcel.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    ParcelModule,
    ProfileModule,
    DatabaseModule,
    FeedbackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
