import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [TelegramModule],
  controllers: [RegisterController],
  providers: [RegisterService]
})
export class RegisterModule {}
