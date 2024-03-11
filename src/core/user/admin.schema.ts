// Import necessary modules and types
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type AdminDocument = Admin & Document;

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  POS = 'pos',
  KDS = 'kds',
  SUPPLIER = 'supplier',
}

export enum Verification {
  UNVERIFIED = 'unverified',
  VERIFIED = 'verified',
}


interface SubscriptionPlan {
  plan: string;
  startDate: Date;
  endDate: Date;
  isTrial?: boolean;
  isActive: boolean;
  billingCycle: 'monthly' | 'annual';
  price: number;
  currency: string;
  symbol: string;
}

@Schema({ timestamps: true })
export class Admin {



  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: false, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  image: string;

  @Prop({ type: String, enum: Object.values(UserRole), required: true })
  role: UserRole;

  @Prop({ type: String, enum: Object.values(Verification), required: true })
  status: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ required: false })
  verificationToken: string;

  @Prop({ required: false })
  resetPasswordToken: string;

  @Prop({
    type: Object,
    default: () => ({
      plan: 'basic',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isTrial: false,
      isActive: true,
      billingCycle: 'monthly',
      price: 0,
      currency: 'inr',
      symbol: '₹',
    } as SubscriptionPlan),
  })
  subscription: SubscriptionPlan;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
