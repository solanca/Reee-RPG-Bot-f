import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type HistoryDocument = History & Document;

@Schema()
export class History {
    @Prop({required: true})
    type: string;

    @Prop({required: true})
    description: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);