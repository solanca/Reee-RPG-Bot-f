import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type WarriorDocument = Warrior & Document;

@Schema()
export class Warrior {
    @Prop({required: true})
    address: string;

    @Prop({required: true})
    xp: number;

    @Prop({required: true})
    level: number;
    
    @Prop({required: true})
    weapon: number;

    @Prop({required: true})
    armor: number;

    @Prop({required: true})
    assets: number;
}