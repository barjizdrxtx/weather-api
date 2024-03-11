import { Controller,  Request, UseGuards, HttpException, HttpStatus,  } from '@nestjs/common';
import { UserRole } from './admin.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';


@Controller('user')
export class AdminController {
  constructor(private readonly userService: AdminService) { }


  @UseGuards(new JwtAuthGuard({ roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.POS, UserRole.KDS, UserRole.SUPPLIER] }))
  @Get('profile')
  async findProfile(@Request() req): Promise<any> {
    try {
      const userId = req.user._id;

      const role = req.user.role;

      const result = await this.userService.findProfile(userId, role);

      return result;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        success: false,
        result: null,
      };
    }
  }
}