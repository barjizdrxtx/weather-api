// local-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  
  handleRequest(err, user, info, context) {
    // Handle the request after Passport's local strategy pipes the user through here
    
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    
    return user;
  }
}

