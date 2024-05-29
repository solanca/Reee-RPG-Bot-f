import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { PublicKey } from '@solana/web3.js';
import { commands, walletRedirectURL } from './telegram.constants';

@Injectable()
export class TelegramService {
    constructor(@InjectBot() private readonly bot: Telegraf) {
        this.initBot();
    }

    private initBot() {
        this.bot.telegram.setMyCommands(commands);
        this.bot.command('start', async (ctx) => {
            await ctx.reply('Please provide your Solana wallet address to connect, or use the link below to connect your wallet:');
            await ctx.replyWithHTML(walletRedirectURL);
        });
        
        // Handle wallet address input
        this.bot.hears('/.*/', (ctx) => {
            const text = ctx.message.text;
            const chatId = ctx.message.chat.id;

            // Validate if the text is a valid Solana address
            try {
                const publicKey = new PublicKey(text);
                ctx.reply(`Wallet connected successfully! Address: ${publicKey.toString()}`);
            } catch (error) {
                if (text.startsWith('/')) {
                    // If it's a command, skip processing as a wallet address
                    return;
                }
                ctx.reply('Invalid Solana wallet address. Please try again.');
            }
        });
    }

    public getBot(): Telegraf {
        return this.bot;
    }
}
