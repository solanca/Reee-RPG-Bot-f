import { generateSigner } from '@metaplex-foundation/umi';
import { Injectable } from '@nestjs/common';
import { TOKEN_PROGRAM_ID, createTransferInstruction, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
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

                const connection = new Connection("https://api.devnet.solana.com", "confirmed");
                const wallet_scret_key = new Uint8Array([1,170,121,236,30,93,34,190,49,236,97,173,225,99,128,122,220,222,224,
                            91,88,246,28,208,27,189,92,247,22,200,173,127,144,39,115,1,195,126,147,168,100,159
                            ,132,152,25,250,160,232,193,13,118,169,18,242,73,128,42,169,72,140,61,159,226,239]);

                // Construct wallet keypairs
                var fromWallet = Keypair.fromSecretKey(wallet_scret_key);
                var toWallet = new PublicKey(this.warriorDto.owner)
                // Construct my token class
                var myMint = new PublicKey("GwKSWTo17hvbttGYHKorcfFHRiY3oJhtLTzbKQWeEKfi");
                // Create associated token accounts for my token if they don't exist yet
                var fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                    connection,
                    fromWallet,
                    myMint,
                    fromWallet.publicKey
                );
                var toTokenAccount = await getOrCreateAssociatedTokenAccount(
                    connection,
                    fromWallet,
                    myMint,
                    toWallet
                );
                // Add token transfer instructions to transaction
                var transaction = new Transaction()
                    .add(
                        createTransferInstruction(
                            // TOKEN_PROGRAM_ID,
                            fromTokenAccount.address,
                            toTokenAccount.address,
                            fromWallet.publicKey,
                            BigInt(20*Math.pow(10,9))
                        )
                    );
                // Sign transaction, broadcast, and confirm
                var signature = await sendAndConfirmTransaction(
                    connection,
                    transaction,
                    [fromWallet]
                );
                console.log("SIGNATURE", signature);
                console.log("SUCCESS");

                await ctx.reply(`${description} \n\nYou can find the transaction at below: \n\n https://solscan.io/tx/${signature}?cluster=devnet`);
            }else {
                await ctx.reply("Please select your warrior first...");
            }
         });
    }
}
