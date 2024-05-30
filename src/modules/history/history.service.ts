import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History, HistoryDocument } from 'src/schemas/history.schema';
import { HistoryDto } from './dto/history.dto';

@Injectable()
export class HistoryService {
    constructor(@InjectModel(History.name) private historyModel: Model<HistoryDocument>) {}

    async create(historyDto: HistoryDto): Promise<History> {
        const createHistory = new this.historyModel(historyDto);
        return createHistory.save();
    }
}
