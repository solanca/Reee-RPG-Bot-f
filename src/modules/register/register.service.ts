import { Injectable } from '@nestjs/common';
import { PublicKeyDto } from './dto/publickey.dto';
import { WarriorDto } from './dto/warrior.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Warrior, WarriorDocument } from 'src/schemas/warrior.schema';
import { Model } from 'mongoose';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import axios from 'axios';
import { fetchDigitalAsset, mplTokenMetadata,} from '@metaplex-foundation/mpl-token-metadata';
import { publicKey} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class RegisterService {
    private connection: Connection;
    private metaplex: Metaplex;

    constructor(@InjectModel(Warrior.name) private warriorModel: Model<WarriorDocument>) {
        this.connection = new Connection("https://api.devnet.solana.com", "confirmed");
        this.metaplex = new Metaplex(this.connection);
            // .use(keypairIdentity(Keypair.generate()));
    }

    async retrieveNFTs(publicKeyDto: PublicKeyDto): Promise<WarriorDto[]> {
        try {
            const mintNFTsPath = join(__dirname, '../../', 'assets', 'minted-nfts.json');
            const mintedNFTAddresses: string[] = await JSON.parse(readFileSync(mintNFTsPath, 'utf-8'));

            const walletPublicKey = new PublicKey(publicKeyDto.address);
            const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(walletPublicKey, {
              programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
            });
      
            const nfts = tokenAccounts.value.filter(tokenAccount => {
              const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;
              return tokenAmount.amount === '1' && tokenAmount.decimals === 0 && mintedNFTAddresses.includes(tokenAccount.account.data.parsed.info.mint);
            });

            const nftsArrPromises = nfts.map(async (nft) => await this.getMetadataAttrs(nft.account.data.parsed.info.mint));
            
            return await Promise.all(nftsArrPromises);
          } catch (error) {
            console.error('Failed to retrieve NFTs:', error);
            throw new Error('Failed to retrieve NFTs');
          }
    }

    async create(warriorDto: WarriorDto): Promise<Warrior> {
        const existWarrior = await this.findByAddress(warriorDto.address);
        if (existWarrior === null) {
            const createdWarrior = new this.warriorModel(warriorDto);
            return createdWarrior.save();
        }
        return existWarrior;
    }

    async update(warriorDto: WarriorDto): Promise<Warrior | null> {
        const updatedWarrior = await this.warriorModel.findOneAndUpdate(
            { address: warriorDto.address },
            warriorDto,
            { new: true }
        ).exec();
        return updatedWarrior;
    }

    async findByAddress(address: string): Promise<Warrior | null> {
        return this.warriorModel.findOne({ address }).exec();
    }

    async getMetadataAttrs(mintAddress: string): Promise<WarriorDto> {
        const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata()).use(mplCandyMachine());
        const asset = await fetchDigitalAsset(umi,publicKey(mintAddress));
        const attributes = (await axios.get(asset.metadata.uri)).data;
        return {
            address: mintAddress,
            owner: "",
            name: attributes.name,
            xp: attributes.attributes[0].value,
            level: attributes.attributes[1].value,
            image: attributes.image,
            weapon: attributes.attributes[2].value,
            armor: attributes.attributes[3].value,
            description: attributes.description,
            assets: attributes.attributes[4].value
        }
    }

    toWarriorDto(warrior: Warrior): WarriorDto {
        return {
            address: warrior.address,
            owner: warrior.owner,
            name: warrior.name,
            xp: warrior.xp,
            level: warrior.level,
            weapon: warrior.weapon,
            armor: warrior.armor,
            assets: warrior.assets,
            image: warrior.image,
            description: warrior.description,
        };
    }
}


        //     const mintAddress = new PublicKey("5qfHXBBHcThGmHGigUSQBLHr24x2ZTcRSn6zvT8GPeAM");
        
        //     const nft = await this.metaplex.nfts().findByMint({ mintAddress });

        //     console.log("Connection =================== ", this.connection);
        
        //     console.log("nft.json  ============== ", nft.json);

            // const candyMachinePubkey = new PublicKey("BrwCS4qwuKwu9TbmKQ83N7YN8Bx5iht3yYg7yCsK8dNw");

            // console.log("candyMachinePubKey ========= ", candyMachinePubkey);

            // const metadataAccounts = await this.metaplex.candyMachinesV2().findMintedNfts({ candyMachine: candyMachinePubkey });
            
            // console.log("metadataAccounts   ====  ", metadataAccounts);

            // console.log("nftsArr ====== ", nftsArr);