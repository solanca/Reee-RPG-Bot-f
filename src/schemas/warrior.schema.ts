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
    weapon: string;

    @Prop({required: true})
    armor: string;

    @Prop({required: true})
    assets: string;

    @Prop({required: true})
    image: string;

    @Prop({required: true})
    description: string;
}

export const WarriorSchema = SchemaFactory.createForClass(Warrior);