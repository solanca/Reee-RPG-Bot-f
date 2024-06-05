import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Markup, Telegraf, Context } from 'telegraf';
import { commands } from './telegram.constants';
import { WarriorDto } from 'src/modules/register/dto/warrior.dto';
import { TgmissionsService } from './missions/tgmissions.service';
import { RegisterService } from 'src/modules/register/register.service';
import { ConfigService } from '@nestjs/config';
import { mainMenu } from './telegram.menus';

@Injectable()
export class TelegramService {
    context: Context;
    warriorMap = new Map<string, WarriorDto>();
    owner: string;

    constructor(@InjectBot() private readonly bot: Telegraf, 
        private readonly tgmissionsService: TgmissionsService, 
        private readonly registerService: RegisterService,
        private readonly configService: ConfigService) {
        this.initBot();
    }

    private initBot() {
        this.bot.telegram.setMyCommands(commands);
        this.bot.command('start', async (ctx) => {
            this.context = ctx;
            // await ctx.reply('Please use the link below to connect your wallet:');
            // await ctx.replyWithHTML(this.configService.get<string>('HOST_URL'));

            await ctx.replyWithPhoto(this.configService.get<string>('BANNER_URL'), { 
                caption: `Welcome to REEE Game, @! 👋 \n\n` 
                        + `Jump in our REEE Game and farm $GAME tokens, just open game and go on!\n\n`
                        + `💠 Your mined $GAME tokens will be unlocked in: 166.63 hours\m\n`
                        + `✳️ Your final withdraw multiplier: x1.0015\n\n`
                        + `You can decrease your unlock time and boost your final tokens multiplier just holding $GAME!\n\n`
                        + `More $GAME you hold, faster and more tokens you will get!`, 
                reply_markup: mainMenu.reply_markup
            })

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

    public listWarriors(owner: string, warriors: WarriorDto[]) {
        if (this.context !== undefined && this.context !== null) {
            this.owner = owner;
            this.warriorMap.clear();
            warriors.forEach(async (warrior) => {
                const warriorFromDb = await this.registerService.findByAddress(warrior.address);
                const warriorDto = warriorFromDb === null ? warrior : this.registerService.toWarriorDto(warriorFromDb);
                this.warriorMap.set(warriorDto.address, warriorDto);
                const select_warrior_markup = Markup.inlineKeyboard([
                    Markup.button.callback(`Select Warrior`, `register_warrior ${warriorDto.address}`),
                ]);
                await this.context.replyWithPhoto(warriorDto.image.replace('?ext=png',''), { 
                    caption: `${warriorDto.description} \n\nExpreience: ${warriorDto.xp} \nLevel: ${warriorDto.level} \nWepon: ${warriorDto.weapon} \nArmor: ${warriorDto.armor}`, 
                    reply_markup: select_warrior_markup.reply_markup 
                });
            });
        }
    }

    private async registerWarrior(ctx: Context, warriorMap: Map<string, WarriorDto>) {
        const [ warriorId ] = ctx["match"]["input"].replace(/register_warrior /g, '').split(' ');
        const warrior = warriorMap.get(warriorId);
        if (warrior !== null && warrior !== undefined) {
            await this.registerService.create({...warrior, owner: this.owner});
            // Update mission bot warrior
            this.tgmissionsService.warriorDto = {...warrior, owner: this.owner};
            await ctx.reply('You just selected Warrior. Below is warrior info:');
            await ctx.replyWithPhoto(warrior.image.replace('?ext=png',''), {
                caption: `${warrior.description} \n\nExpreience: ${warrior.xp} \nLevel: ${warrior.level} \nWepon: ${warrior.weapon} \nArmor: ${warrior.armor}`
            });
        }
    }

}
