import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(private readonly options?: { roles: string[] }) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info: Error) {
    if (err || !user || !user.role || user.role.length === 0 || !user.isActive) {
      throw err || new UnauthorizedException('You are not authorized to perform the operation');
    }


    const requiredRoles = this.options?.roles || [];
    const hasRequiredRoles = requiredRoles.some(requiredRole => user.role.includes(requiredRole));

    if (!hasRequiredRoles) {
      throw new UnauthorizedException('You do not have the necessary role to perform the operation');
    }

    return user;
  }
}