// create-user.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateUserDto {


  @IsOptional()
  @IsString()
  email: string;


}
