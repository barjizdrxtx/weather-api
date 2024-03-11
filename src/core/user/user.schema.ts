import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'user',
}



@Schema({ timestamps: true })
export class User {
  toObject(): { [x: string]: any; } {
    throw new Error('Method not implemented.');
  }


  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;




  @Prop()
  status: string;

  @Prop({ default: true })
  isActive: boolean;


  @Prop({ type: String, enum: Object.values(UserRole), required: true })
  role: UserRole;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

}


export const UserSchema = SchemaFactory.createForClass(User);
