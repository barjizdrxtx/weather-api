// File: src/auth/auth.controller.ts

import { Controller, Request, Post, UseGuards, Get, Body, HttpException, HttpStatus, UnauthorizedException, Param, Query, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateAdminDto } from '../user/dto/create-admin.dto';
import { UserRole } from '../user/admin.schema';
import { AdminService } from '../user/admin.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: AdminService,
  ) { }



  @Post('login')
  async login(@Body() { email, password }: { email: string; password: string }) {
    try {

      const { access_token } = await this.authService.login(email, password);


      return {
        success: true,
        message: 'Login successful',
        access_token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return { success: false, message: error.message, statusCode: error.getStatus() };
      } else {
        throw error;
      }
    }
  }






  @Post('signup')
  async signup(@Body() createAdminDto: CreateAdminDto) {
    try {
      // Assign the default role here (e.g., "ADMIN")
      createAdminDto.role = UserRole.ADMIN;


      // Validate if you want to check that the role is "ADMIN"
      if (createAdminDto.role !== UserRole.ADMIN) {
        throw new HttpException('User can only sign up with the role "ADMIN"', HttpStatus.UNAUTHORIZED);
      }

      // Pass the CreateAdminDto to the create method
      await this.usersService.create(createAdminDto);

      return {
        success: true,
        message: 'User account created. Please check your email for verification instructions.',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return { success: false, message: error.message, statusCode: error.getStatus() };
      } else {
        throw error;
      }
    }
  }



  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string) {
    try {
      const user: any = await this.usersService.findByVerificationToken(token);

      if (!user) {
        throw new HttpException('Invalid verification token', HttpStatus.BAD_REQUEST);
      }

      user.status = 'verified';
      await user.save();

      return {
        success: true,
        message: 'Email verification successful. You can now log in.',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return { success: false, message: error.message, statusCode: error.getStatus() };
      } else {
        throw error;
      }
    }
  }


  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }) {
    try {
      await this.usersService.requestPasswordReset(email);

      return {
        success: true,
        message: 'Password reset instructions sent to your email.',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return { success: false, message: error.message, statusCode: error.getStatus() };
      } else {
        throw error;
      }
    }
  }

  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() { newPassword }: { newPassword: string }) {
    try {
      await this.usersService.resetPassword(token, newPassword);

      return {
        success: true,
        message: 'Password reset successful. You can now log in with your new password.',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return { success: false, message: error.message, statusCode: error.getStatus() };
      } else {
        throw error;
      }
    }
  }
}