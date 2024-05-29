import { Injectable } from '@nestjs/common';
import { PublicKeyDto } from './dto/publickey.dto';
import { WarriorDto } from './dto/warrior.dto';

@Injectable()
export class RegisterService {
    constructor() {}

    async retrieveNFTs(publicKeyDto: PublicKeyDto): Promise<WarriorDto[]> {
        return [
            {
                address: "6Dg6Q5vbpwtP32CLbadRehPqu5YkfvcmpTBv9BcHrHBj",
                xp: 60,
                level: 1,
                weapon: "Weapon #2",
                armor: "Armor #6",
                assets: "Assets 2024",
                image: "https://dl.openseauserdata.com/cache/originImage/files/93fc0f9b186e088f67cc597987d8bcb4.jpg",
                description: "Reee Warrior are an NFT collection inspired by $REEE. Royalties are used to buy back and burn $REEE!"
            },
            {
                address: "767864455364568756745grtertertyertyey",
                xp: 30,
                level: 1,
                weapon: "Weapon #3",
                armor: "Armor #4",
                assets: "Assets 2024",
                image: "https://dl.openseauserdata.com/cache/originImage/files/901df1810b212b853dcbdc7c720aea3a.jpg",
                description: "Reee Warrior are an NFT collection inspired by $REEE. Royalties are used to buy back and burn $REEE!"
            },
            {
                address: "3458755464564565673456grertyertyerty",
                xp: 80,
                level: 1,
                weapon: "Weapon #7",
                armor: "Armor #2",
                assets: "Assets 2024",
                image: "https://dl.openseauserdata.com/cache/originImage/files/ec822bda6e385bcfedf056fbfa9796c8.jpg",
                description: "Reee Warrior are an NFT collection inspired by $REEE. Royalties are used to buy back and burn $REEE!"
            },
        ];
    }
}
