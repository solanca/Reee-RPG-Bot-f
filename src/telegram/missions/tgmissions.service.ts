import { Injectable } from '@nestjs/common';
import { HistoryService } from 'src/modules/history/history.service';
import { WarriorDto } from 'src/modules/register/dto/warrior.dto';
import { RegisterService } from 'src/modules/register/register.service';
import { Telegraf } from 'telegraf';

@Injectable()
export class TgmissionsService {
    warriorDto: WarriorDto;
    constructor(private readonly registerService: RegisterService, private readonly historyService: HistoryService) {}

    initBot(bot: Telegraf) {
        bot.command('mission', async (ctx) => {
            if (this.warriorDto !== null && this.warriorDto !== undefined) {
                await ctx.reply("Send your warrior on a daily mission(Collect 10 Herbs). Please wait...");
            
                // TODO: complete the backend logic to calc the mission result
                const description = "🎉 Congratulations!!! 🎉 \n\nYou successfully finished your daily mission(Collect 10 Herbs). \n\nYou earned 10 XP(Experience) increased and 20 Reee Tokens.";
                await this.historyService.create({
                    type: "daily_mission",
                    description: description
                });

                await this.registerService.update({
                    ...this.warriorDto,
                    xp: this.warriorDto.xp + 10
                });

                await ctx.reply(description);
            }else {
                await ctx.reply("Please select your warrior first...");
            }
         });
    }
}
