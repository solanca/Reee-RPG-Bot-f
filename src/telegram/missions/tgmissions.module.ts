import { Module } from '@nestjs/common';
import { TgmissionsService } from './tgmissions.service';
import { HistoryModule } from 'src/modules/history/history.module';
import { RegisterModule } from 'src/modules/register/register.module';

@Module({
  imports: [HistoryModule, RegisterModule],
  providers: [TgmissionsService],
  exports: [TgmissionsService]
})
export class TgmissionsModule {}
