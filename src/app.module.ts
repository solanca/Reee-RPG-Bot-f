import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RewardsModule } from './modules/rewards/rewards.module';
import { MissionsModule } from './modules/missions/missions.module';
import { TelegramModule } from './telegram/telegram.module';
import { RegisterModule } from './modules/register/register.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    RewardsModule,
    MissionsModule,
    TelegramModule,
    RegisterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
