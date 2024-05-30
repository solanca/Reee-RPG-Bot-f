import { Module } from '@nestjs/common';
import { TgmissionsService } from './tgmissions.service';
import { HistoryModule } from 'src/modules/history/history.module';

@Module({
  imports: [HistoryModule],
  providers: [TgmissionsService],
  exports: [TgmissionsService]
})
export class TgmissionsModule {}
