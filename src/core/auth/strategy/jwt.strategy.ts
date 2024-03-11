import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from 'src/core/user/admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'world-best-pos', // Ensure this matches your secret key
    });
  }

  async validate(payload: any) {
    let entity;

    // Assuming payload has both email and username properties
    if (payload.email) {
      entity = await this.usersService.findOne(payload.email);
    } else if (payload.username) {
      entity = await this.usersService.findOne(payload.username);
    }

    if (!entity) {
      throw new UnauthorizedException();
    }

    return entity;
  }
}
