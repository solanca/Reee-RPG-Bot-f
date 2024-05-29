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
        this.telegramService.listWarriors(publicKeyDto, warriorList);
        return publicKeyDto;
    }
}
