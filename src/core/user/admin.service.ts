// users/users.service.ts

import { Injectable, BadRequestException, HttpStatus, Param, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as argon2 from 'argon2';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateAdminDto } from './dto/create-admin.dto';
import { isEmail } from 'class-validator';
import { Admin, AdminDocument, UserRole } from './admin.schema';

@Injectable()
export class AdminService {

  constructor(

    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly mailerService: MailerService,

  ) { }

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    try {
      const { image, email, password, name, role } = createAdminDto;

      // Check if the email already exists
      const existingUser = await this.adminModel.findOne({ email });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      // Define a default subscription plan
      const defaultSubscription = {
        plan: 'basic',
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isTrial: false,
        isActive: true,
        billingCycle: 'monthly',
        price: 0,
        currency: 'INR',
        symbol: '₹',
      };

      // Create a new user with the default subscription
      const newUser = new this.adminModel({
        image,
        email,
        name,
        password: await argon2.hash(password),
        role,
        status: 'unverified',
        verificationToken: this.generateUniqueToken(),
        subscription: defaultSubscription,  // Include the default subscription
      });

      const savedUser: any = await newUser.save();

      await this.sendVerificationEmail(email, savedUser.verificationToken);

      return savedUser;

    } catch (error) {
      throw new BadRequestException(`Failed to create user: ${error.message}`);
    }
  }


  async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Email Verification',
        template: './verification', // Assuming you have a Handlebars template named 'verification.hbs'
        context: {
          link: `https://www.onetouchemart.com/auth/verify/${token}`,
        },
      });

    } catch (error) {
      console.error(`Error sending verification email to ${email}: ${error.message}`);
      throw new BadRequestException(`Failed to send verification email: ${error.message}`);
    }
  }


  async findOne(identifier: string): Promise<Admin | undefined> {

    return this.adminModel.findOne({ email: identifier }).exec();

  }



  // forget password


  async requestPasswordReset(email: string): Promise<void> {

    const user: any = await this.adminModel.findOne({ email }).exec();


    if (!user) {
      throw new BadRequestException('User not found');
    }


    user.resetPasswordToken = this.generateUniqueToken();



    await user.save();

    // Send password reset email
    await this.sendPasswordResetEmail(user.email, user.resetPasswordToken);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset',
        template: './password-reset', // Assuming you have a Handlebars template named 'password-reset.hbs'
        context: {
          link: `https://www.onetouchemart.com/auth/reset-password/${token}`,
        },
      });

    } catch (error) {
      console.error(`Error sending password reset email to ${email}: ${error.message}`);
      throw new BadRequestException(`Failed to send password reset email: ${error.message}`);
    }
  }



  // reset password


  async resetPassword(token: string, newPassword: string): Promise<void> {

    const user: any = await this.adminModel.findOne({ resetPasswordToken: token }).exec();


    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.resetPasswordExpiration < new Date()) {

      throw new BadRequestException('Invalid or expired reset password token');
    }

    user.password = await argon2.hash(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiration = undefined;

    // Set resetPasswordToken to undefined
    user.resetPasswordToken = undefined;

    await user.save();
  }


  async findByVerificationToken(token: string): Promise<Admin | null> {
    return this.adminModel.findOne({ verificationToken: token }).exec();
  }





  async findProfile(userId: string, role: string): Promise<any> {


    try {


      let user;

      user = await this.adminModel.findById(userId)
        .select('-password')
        .lean()
        .exec();


      if (!user) {
        throw new Error('User not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User Details',
        success: true,
        result: user,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Failed to load user: ' + error.message,
        success: false,
        result: null,
      };
    }
  }



  async findById(userId: string): Promise<AdminDocument | null> {
    return this.adminModel.findById(userId).exec();
  }





  private generateUniqueToken(): string {
    const timestamp = Date.now().toString();
    const randomString = this.generateRandomString(16);
    return `${timestamp}-${randomString}`;
  }


  private generateRandomString(length: number): string {
    const randomBytes = require('crypto').randomBytes(length);
    return randomBytes.toString('hex');
  }


  async addRestaurantToUser(userId: string, restaurantId: string): Promise<void> {
    try {
      const user: any = await this.adminModel.findById(userId).exec();

      if (!user) {
        throw new BadRequestException('User not found');
      }


      await user.save();

    } catch (error) {
      console.error(`Error adding restaurant to user: ${error.message}`);
      throw new BadRequestException(`Failed to add restaurant to user: ${error.message}`);
    }
  }
}



