import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { TgmissionsModule } from './missions/tgmissions.module';
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
    TgmissionsModule,
    forwardRef(() => RegisterModule)
  ],
  exports: [TelegramService]
})
export class TelegramModule {}
