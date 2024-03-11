import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2'; // Import argon2
import { AdminService } from '../user/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: AdminService,
    private jwtService: JwtService,
  ) { }



  async validateUser(identifier: string, pass: string): Promise<any> {

    const user = await this.usersService.findOne(identifier);


    if (user && (await argon2.verify(user.password, pass))) {
      if (user.status !== 'verified') {
        // If the user is not verified, throw UnauthorizedException
        throw new UnauthorizedException('Email not verified');
      }

      if (!user.isActive) {
        // If the user is not active, throw UnauthorizedException
        throw new UnauthorizedException('User is not active');
      }

      // User is verified, active, return user details (excluding password)
      const { password, ...result } = user;
      return { ...result };
    }

    return null;
  }




  //user login


  async login(identifier: string, password: string): Promise<{ access_token: string }> {
    const user = await this.validateUser(identifier, password);


    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const access_token = await this.generateAccessToken(user, identifier);
    return { access_token };
  }

  async generateAccessToken(user: any, identifier: string): Promise<string> {
    let userField: string;

    // Choose the appropriate field based on the type of identifier
    if (identifier.includes('@')) {
      // Assuming email if the identifier contains '@'
      userField = user._doc.email;
    } else {
      // Assuming username for other cases
      userField = user._doc.username;
    }

    const payload = { _id: user._doc._id, email: userField, role: user._doc.role };
    return this.jwtService.sign(payload);
  }




  async generateAccessToken2(restaurant: any): Promise<string> {


    const payload = { _id: restaurant._doc._id, name: restaurant._doc.name, role: restaurant._doc.role };
    return this.jwtService.sign(payload);
  }
}


