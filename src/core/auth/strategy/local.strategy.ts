import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      emailField: 'identifier', // Assuming 'email' is used for user login
      passwordField: 'password',
      passReqToCallback: true, // this will pass the request to the validate function
    });
  }

  async validate(request: any, identifier: string, password: string): Promise<any> {
    const type = request.body.type; // get the type from the request body

    if (type === 'user') {
      const user = await this.authService.validateUser(identifier, password);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } else {
      throw new UnauthorizedException('Invalid login type');
    }
  }
}
