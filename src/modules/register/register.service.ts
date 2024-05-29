import { Injectable } from '@nestjs/common';
import { PublicKeyDto } from './dto/publickey.dto';
import { WarriorDto } from './dto/warrior.dto';

@Injectable()
export class RegisterService {
    constructor() {}

    async retrieveNFTs(publicKeyDto: PublicKeyDto): Promise<WarriorDto[]> {
        return [];
    }
}
