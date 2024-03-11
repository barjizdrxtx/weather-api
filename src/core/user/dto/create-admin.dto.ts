// create-user.dto.ts
import { IsString, IsEmail, IsEnum, IsArray, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { UserRole } from '../admin.schema';

export class CreateAdminDto {


  @IsOptional()
  @IsString()
  email: string;


  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsString()
  password: string;



  phonenumber;

  role: string;




}
