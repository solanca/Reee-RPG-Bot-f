import { Module, forwardRef } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { TelegramModule } from 'src/telegram/telegram.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Warrior, WarriorSchema } from 'src/schemas/warrior.schema';

@Module({
  imports: [
    forwardRef(() => TelegramModule),
    MongooseModule.forFeature([{ name: Warrior.name, schema: WarriorSchema }])
  ],
  controllers: [RegisterController],
  providers: [RegisterService],
  exports: [RegisterService]
})
export class RegisterModule {}
