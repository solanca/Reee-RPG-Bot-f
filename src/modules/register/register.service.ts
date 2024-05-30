import { Injectable } from '@nestjs/common';
import { PublicKeyDto } from './dto/publickey.dto';
import { WarriorDto } from './dto/warrior.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Warrior, WarriorDocument } from 'src/schemas/warrior.schema';
import { Model } from 'mongoose';
import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

@Injectable()
export class RegisterService {
    private connection: Connection;
    private metaplex: Metaplex;

    constructor(@InjectModel(Warrior.name) private warriorModel: Model<WarriorDocument>) {
        this.connection = new Connection("https://api.devnet.solana.com", "confirmed");
        this.metaplex = new Metaplex(this.connection);
    }

    async retrieveNFTs(publicKeyDto: PublicKeyDto): Promise<WarriorDto[]> {
        try {
            // const walletPublicKey = new PublicKey(publicKeyDto.address);

            // const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(walletPublicKey, {
            //   programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
            // });
      
            // const nfts = tokenAccounts.value.filter(tokenAccount => {
            //     console.log(tokenAccount.account.data.parsed);
            //   const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;
            //   return tokenAmount.amount === '1' && tokenAmount.decimals === 0;
            // });
      
            // const nftsArr = tokenAccounts.value.map(nft => ({
            //   mint: nft.account.data.parsed.info.mint,
            //   tokenAccount: nft.pubkey.toBase58(),
            // }));

            // const candyMachinePubkey = new PublicKey("BrwCS4qwuKwu9TbmKQ83N7YN8Bx5iht3yYg7yCsK8dNw");

            // console.log("candyMachinePubKey ========= ", candyMachinePubkey);

            // const metadataAccounts = await this.metaplex.candyMachinesV2().findMintedNfts({ candyMachine: candyMachinePubkey });
            
            // console.log("metadataAccounts   ====  ", metadataAccounts);

            // console.log("nftsArr ====== ", nftsArr);
          } catch (error) {
            console.error('Failed to retrieve NFTs:', error);
            throw new Error('Failed to retrieve NFTs');
          }

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

    async create(warriorDto: WarriorDto): Promise<Warrior> {
        const existWarrior = await this.findByAddress(warriorDto.address);
        if (existWarrior === null) {
            const createdWarrior = new this.warriorModel(warriorDto);
            return createdWarrior.save();
        }
        return existWarrior;
    }

    async findByAddress(address: string): Promise<Warrior | null> {
        return this.warriorModel.findOne({ address }).exec();
    }
}
