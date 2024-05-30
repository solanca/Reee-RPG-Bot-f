import { Injectable } from '@nestjs/common';
import { HistoryService } from 'src/modules/history/history.service';
import { Telegraf } from 'telegraf';

@Injectable()
export class TgmissionsService {
    constructor(private readonly historyService: HistoryService) {}

    initBot(bot: Telegraf) {
        bot.command('mission', async (ctx) => { 
            await ctx.reply("Send your warrior on a daily mission(Collect 10 Herbs). Please wait...");
            
            // TODO: complete the backend logic to calc the mission result
            const description = "🎉 Congratulations!!! 🎉 \n\nYou successfully finished your daily mission(Collect 10 Herbs). \n\nYou earned 10 XP(Experience) increased and 20 Reee Tokens.";
            await this.historyService.create({
                type: "daily_mission",
                description: description
            });

            await ctx.reply(description);
         });
    }
}
