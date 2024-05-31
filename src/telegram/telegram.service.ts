import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Markup, Telegraf, Context } from 'telegraf';
import { commands, walletRedirectURL } from './telegram.constants';
import { WarriorDto } from 'src/modules/register/dto/warrior.dto';
import { TgmissionsService } from './missions/tgmissions.service';
import { RegisterService } from 'src/modules/register/register.service';

@Injectable()
export class TelegramService {
    context: Context;
    warriorMap = new Map<string, WarriorDto>();

    constructor(@InjectBot() private readonly bot: Telegraf, 
        private readonly tgmissionsService: TgmissionsService, private readonly registerService: RegisterService) {
        this.initBot();
    }

    private initBot() {
        this.bot.telegram.setMyCommands(commands);
        this.bot.command('start', async (ctx) => {
            this.context = ctx;
            await ctx.reply('Please use the link below to connect your wallet:');
            await ctx.replyWithHTML(walletRedirectURL);

            // ### Referrence
            // await ctx.reply(message, mainMenu)
        });
        this.bot.action(/register_warrior (.*?)/, (ctx) => this.registerWarrior(ctx, this.warriorMap));
        // Initialize - Mission Bot
        this.tgmissionsService.initBot(this.bot);
    }

    public replyWithText(msg: string) {
        if (this.context !== undefined && this.context !== null) {
            this.context.reply(msg);
        }
    }

    public listWarriors(warriors: WarriorDto[]) {
        if (this.context !== undefined && this.context !== null) {
            this.warriorMap.clear();
            warriors.forEach(async (warrior) => {
                const warriorFromDb = await this.registerService.findByAddress(warrior.address);
                const warriorDto = warriorFromDb === null ? warrior : this.registerService.toWarriorDto(warriorFromDb);
                this.warriorMap.set(warriorDto.address, warriorDto);
                const select_warrior_markup = Markup.inlineKeyboard([
                    Markup.button.callback(`Select Warrior`, `register_warrior ${warriorDto.address}`),
                ]);
                await this.context.replyWithPhoto(warriorDto.image, { 
                    caption: `${warriorDto.description} \n\nExpreience: ${warriorDto.xp} \nLevel: ${warriorDto.level} \nWepon: ${warriorDto.weapon} \nArmor: ${warriorDto.armor}`, 
                    reply_markup: select_warrior_markup.reply_markup 
                });
            });
        }
    }

    private async registerWarrior(ctx: Context, warriorMap: Map<string, WarriorDto>) {
        const [ warriorId ] = ctx["match"]["input"].replace(/register_warrior /g, '').split(' ');
        const warrior = warriorMap.get(warriorId);
        await this.registerService.create(warrior);
        // Update mission bot warrior
        this.tgmissionsService.warriorDto = warrior;
        await ctx.reply('You just selected Warrior. Below is warrior info:');
        await ctx.replyWithPhoto(warrior.image, {
            caption: `${warrior.description} \n\nExpreience: ${warrior.xp} \nLevel: ${warrior.level} \nWepon: ${warrior.weapon} \nArmor: ${warrior.armor}`
        });
    }

}
