// employees/pipes/unique-email.pipe.ts
import {
  PipeTransform,
  Injectable,
  ConflictException,
  ArgumentMetadata,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';



@Injectable()
export class UniqueEmailPipe implements PipeTransform {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {
    
  }

  async transform(value: any) {
    
    if (!value.email) return value;

    const id = value.id; 
    const employee = await this.employeeRepo.findOneBy({ email: value.email });

    if (employee && employee.id !== id) {
      throw new ConflictException('Email already exists');
    }

    return value;
  }


}
