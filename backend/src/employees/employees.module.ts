import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtMiddleware } from 'src/common/middlewares/verify.middleware';
import { JwtService } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    CacheModule.register(),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, JwtService],
})
export class EmployeesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(
        { path: 'employees/analyses', method: RequestMethod.GET },
        { path: 'employees', method: RequestMethod.GET },
        { path: 'employees', method: RequestMethod.POST }, 
        { path: 'employees/:id', method: RequestMethod.PATCH }, 
        { path: 'employees/:id', method: RequestMethod.DELETE },
      );
  }
}
