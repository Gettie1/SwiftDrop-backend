import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ParcelModule } from './parcel/parcel.module';
import { FeedbackModule } from './feedback/feedback.module';
import { LoggerMiddleware } from './logger.middleware';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AtGuard } from './auth/guards/at.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    ParcelModule,
    ProfileModule,
    DatabaseModule,
    FeedbackModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    { provide: 'APP_GUARD', useClass: AtGuard },
    { provide: 'APP_GUARD', useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
