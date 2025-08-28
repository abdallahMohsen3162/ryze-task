import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { EmployeeSearchDto } from './dto/search-query.dto';
import { PaginationResponseDto } from '../common/pagination/pagination.dto';

@Injectable()
export class EmployeesService {
   constructor(
       @InjectRepository(Employee)
        private readonly employeeRepo: Repository<Employee>,
    ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeeRepo.create({
      ...createEmployeeDto,
      department: createEmployeeDto.department ? { id: createEmployeeDto.department } : undefined,
    });
    return this.employeeRepo.save(employee);
  }

async findAll(query: EmployeeSearchDto) : Promise<PaginationResponseDto<Employee>>{
  let { page = 1, limit = 10, sortBy, sortOrder, search } = query;


  sortOrder = sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const qb = this.employeeRepo.createQueryBuilder('employee')
    .leftJoinAndSelect('employee.department', 'department')
    .select([
      'employee.id',
      'employee.firstName',
      'employee.lastName',
      'employee.email',
      'employee.hireDate',
      'department.name',
      'department.id',
    ])
    .skip((page - 1) * limit)
    .take(limit);


  if (sortBy) {
    const allowedSortFields = ['firstName', 'lastName', 'hireDate', 'email'];
    const orderField = allowedSortFields.includes(sortBy) ? `employee.${sortBy}` : null;

    if (orderField) {
      qb.orderBy(orderField, sortOrder);
    }
  }

  if(search){
    qb.where('employee.firstName LIKE :search OR employee.lastName LIKE :search OR employee.email LIKE :search', { search: `%${search}%` });
  }

  const [employees, total] = await qb.getManyAndCount();

  return {
    data: employees,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
    },
  };
}


  async findOne(id: number) {
    const employee = await this.employeeRepo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .select([
        'employee.id',
        'employee.firstName', 
        'employee.lastName',
        'employee.email',
        'employee.hireDate',
        'department.name'
      ])
      .where('employee.id = :id', { id })
      .getOne();
      
    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {

    
    const employee = await this.employeeRepo.findOneBy({ id });
    if (!employee) {
      throw new Error(`Employee with id ${id} not found`);
    }

    Object.assign(employee, updateEmployeeDto);

    return this.employeeRepo.save(employee); 
  }

  async remove(id: number) {
    return this.employeeRepo.delete(id);
  }

  async getAnalysis(take: number) {
    
    const count = await this.employeeRepo.count();
    const receltHired = await this.employeeRepo.find({
      order: {
        hireDate: 'DESC',
      },
      take,
    })

    return { count, receltHired };
  }


}
