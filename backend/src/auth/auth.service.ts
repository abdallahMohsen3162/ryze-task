import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from './entities/auth.entity';
import { CreateUserDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/loginDto.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}


   async onModuleInit() {
    const admin_username = this.configService.get('ROOT_ADMIN_USER');
    const password = this.configService.get('ROOT_ADMIN_PASSWORD');
    const sult = this.configService.get('PASSWORD_SALT');
    
    const admin = await this.userRepo.findOne({ where: { userName: admin_username } });
    if(!admin){
      const saltRounds = Number(sult); 
      const hashed = await bcrypt.hash(password, saltRounds);
      const user = this.userRepo.create({
        userName: admin_username,
        password: hashed,
        role: UserRole.ADMIN,
      });
      await this.userRepo.save(user);
    }
  }


  

  async createUser(dto: CreateUserDto): Promise<User> {
    const exists = await this.userRepo.findOne({ where: { userName: dto.userName } });
    const saltRounds = Number(this.configService.get('PASSWORD_SALT')); 
    if (exists) {
      throw new BadRequestException('Username already exists');
    }
    const hashed = await bcrypt.hash(dto.password, saltRounds);
    const user = this.userRepo.create({
      ...dto,
      password: hashed,
      role: dto.role || UserRole.USER,
    });
    return this.userRepo.save(user);
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    
    const user = await this.userRepo.findOne({ where: { userName: dto.userName } });
    if (!user) throw new NotFoundException('User not found');
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, role: user.role, username: user.userName };

    const token = this.jwtService.sign(payload);
    return {
      access_token: token
    };
  }


 
 
  async editUser(id: number, dto: Partial<CreateUserDto>): Promise<User> {
    // Fixed: Number() conversion and proper type handling
    const salt = Number(this.configService.get('PASSWORD_SALT'));

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, salt);
    }

    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async find(): Promise<User[]> {
    const users = await this.userRepo.find({
      select: ['id', 'userName', 'role'],
    });
    return users;
  }
}