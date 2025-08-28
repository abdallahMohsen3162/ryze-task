import { Controller, Post, Body, Put, Param, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/loginDto.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from './entities/auth.entity';
import { Roles } from '../common/decorators/roles.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  register(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  edit(@Param('id') id: number, @Body() dto: CreateUserDto) {
    return this.authService.editUser(id, dto);
  }


  @Get('')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  profile() {
    return this.authService.find();
  }


}
