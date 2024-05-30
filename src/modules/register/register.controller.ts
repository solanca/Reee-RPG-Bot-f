import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './register.service';
import { PublicKeyDto } from './dto/publickey.dto';
import { TelegramService } from 'src/telegram/telegram.service';

@Controller('register')
export class RegisterController {
    constructor(private readonly registerService: RegisterService, private readonly telegramService: TelegramService) {}

    @Post('retrieve-nfts')
    async retrieveNFTs(@Body() publicKeyDto: PublicKeyDto) {
        const warriorList = await this.registerService.retrieveNFTs(publicKeyDto);
        await this.telegramService.replyWithText("Just fetching your warriors from your wallet. Please wait...");
        await this.telegramService.listWarriors(warriorList);
        return publicKeyDto;
    }
}
