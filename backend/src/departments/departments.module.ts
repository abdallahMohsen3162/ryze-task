import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { Department } from './entities/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniqueDepNameConstraint } from './validators/uniqieName.decorator';
import { CacheModule } from '@nestjs/cache-manager';
import { Employee } from '../employees/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department, Employee]),
    CacheModule.register(),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, UniqueDepNameConstraint],
  exports: [UniqueDepNameConstraint]
})
export class DepartmentsModule {}
