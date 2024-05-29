import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { PublicKey } from '@solana/web3.js';
import { commands, walletRedirectURL } from './telegram.constants';
import { WarriorDto } from 'src/modules/register/dto/warrior.dto';
import { PublicKeyDto } from 'src/modules/register/dto/publickey.dto';

@Injectable()
export class TelegramService {
    private chatId: string | number;

    constructor(@InjectBot() private readonly bot: Telegraf) {
        this.initBot();
    }

    private initBot() {
        this.bot.telegram.setMyCommands(commands);
        this.bot.command('start', async (ctx) => {
            this.chatId = ctx.chat.id;
            await ctx.reply('Please provide your Solana wallet address to connect, or use the link below to connect your wallet:');
            await ctx.replyWithHTML(walletRedirectURL);
        });
    }

    public listWarriors(publicKeyDto: PublicKeyDto, warriors: WarriorDto[]) {
        if (this.chatId !== undefined && this.chatId !== null) {
            this.bot.telegram.sendMessage(this.chatId, publicKeyDto.address);
        }
    }

}
