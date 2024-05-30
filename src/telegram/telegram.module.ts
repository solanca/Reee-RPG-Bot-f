import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { MissionsModule } from './missions/missions.module';
import { RegisterService } from 'src/modules/register/register.service';
import { RegisterModule } from 'src/modules/register/register.module';

@Module({
  providers: [TelegramService],
  controllers: [TelegramController],
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'),
      }),
      inject: [ConfigService]
    }),
    MissionsModule,
    forwardRef(() => RegisterModule)
  ],
  exports: [TelegramService]
})
export class TelegramModule {}
