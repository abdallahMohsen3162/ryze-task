import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { Employee } from './employees/entities/employee.entity';
import { DepartmentsModule } from './departments/departments.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';



export const jwtFactory = async (configService: ConfigService) => {
  const secret = configService.get<string>('JWT_SECRET');
  return {
    secret,
    // signOptions: { expiresIn: '1h' },
  };
};



export const typeOrmFactory = (configService: ConfigService) => ({
  type: "mssql" as const,
  host: configService.get<string>('DATABASE_HOST'),
  port: parseInt(
    configService.get<string>('DATABASE_PORT') ??
      (() => {
        throw new Error('DATABASE_PORT is not defined');
      })(),
    10,
  ),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  extra: {
    instanceName: 'SQLEXPRESS',
  },
});



@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.dev`,
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtFactory,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmFactory,
    }),

    EmployeesModule,
    DepartmentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
