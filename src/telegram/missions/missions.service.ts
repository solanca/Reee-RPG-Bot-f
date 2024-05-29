import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class MissionsService {
    constructor() {}

    initBot(bot: Telegraf) {
        bot.command('mission', (ctx) => { 
            ctx.reply("Send your warrior on a daily mission. Please wait...");

            // TODO: complete the backend logic to calc the mission result
         });
    }
}
