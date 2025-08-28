import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from '../entities/auth.entity';


export class CreateUserDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either Admin or User' })
  role?: UserRole;
}