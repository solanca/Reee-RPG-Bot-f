import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Markup, Telegraf, Context } from 'telegraf';
import { commands, walletRedirectURL } from './telegram.constants';
import { WarriorDto } from 'src/modules/register/dto/warrior.dto';
import { MissionsService } from './missions/missions.service';

@Injectable()
export class TelegramService {
    context: Context;
    warriorMap = new Map<string, WarriorDto>();

    constructor(@InjectBot() private readonly bot: Telegraf, private readonly missionsService: MissionsService) {
        this.initBot();
    }

    private initBot() {
        this.bot.telegram.setMyCommands(commands);
        this.bot.command('start', async (ctx) => {
            this.context = ctx;
            await ctx.reply('Please provide your Solana wallet address to connect, or use the link below to connect your wallet:');
            await ctx.replyWithHTML(walletRedirectURL);

            // ### Referrence
            // await ctx.reply(message, mainMenu)
        });
        this.bot.action(/register_warrior (.*?)/, (ctx) => this.registerWarrior(ctx, this.warriorMap));

        this.missionsService.initBot(this.bot);
    }

    public listWarriors(warriors: WarriorDto[]) {
        if (this.context !== undefined && this.context !== null) {
            this.context.reply("Select Warrior:");
            warriors.forEach(warrior => {
                this.warriorMap.set(warrior.address, warrior);
                const select_warrior_markup = Markup.inlineKeyboard([
                    Markup.button.callback(`Select Warrior`, `register_warrior ${warrior.address}`),
                ]);
                this.context.replyWithPhoto(warrior.image, { 
                    caption: `${warrior.description} \n\nExpreience: ${warrior.xp} \nLevel: ${warrior.level} \nWepon: ${warrior.weapon} \nArmor: ${warrior.armor}`, 
                    reply_markup: select_warrior_markup.reply_markup 
                });
            });
        }
    }

    private registerWarrior(ctx: Context, warriorMap: Map<string, WarriorDto>) {
        const [ warriorId ] = ctx["match"]["input"].replace(/register_warrior /g, '').split(' ');
        console.log("warrior info ======== ", warriorMap.get(warriorId));
    }

}
