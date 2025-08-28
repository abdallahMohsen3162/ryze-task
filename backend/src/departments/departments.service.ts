import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { ILike, Repository } from 'typeorm';
import { SearchDepartmentDto } from './dto/Search-department.dto';
import { PaginationResponseDto } from 'src/common/pagination/pagination.dto';
import { Employee } from '../employees/entities/employee.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,

    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}
 async create(createDepartmentDto: CreateDepartmentDto) {
    return await this.departmentRepo.save(createDepartmentDto);
  }



    async findAll(query: SearchDepartmentDto): Promise<PaginationResponseDto<Department>> {
      const { search, limit, page, order, sortBy } = query;

      const qb = this.departmentRepo
        .createQueryBuilder('department')
        .select(['department.id', 'department.name'])
        .loadRelationCountAndMap('department.employeeCount', 'department.employees');
      
      if (search) {
        qb.where('LOWER(department.name) LIKE LOWER(:name)', { name: `%${search}%` });
      }

    
      if (sortBy && order) {
        qb.orderBy(`department.${sortBy}`, order.toUpperCase() as 'ASC' | 'DESC');
      }

 
      qb.skip((page - 1) * limit).take(limit);

      const [data, total] = await qb.getManyAndCount();
      const lastPage = Math.ceil(total / limit);

      return {
        data,
        meta: {
          total,
          page,
          lastPage,
        },
      };
    }



  findOne(id: number) {
    return `This action returns a #${id} department`;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.departmentRepo.findOneBy({ id });
    
    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return this.departmentRepo.save({ ...department, ...updateDepartmentDto });
  }

  async getAnalysis() {
    const query = await this.departmentRepo
      .createQueryBuilder('department')
      .loadRelationCountAndMap(
        'department.employeeCount', // 👈 will add `employeeCount` property
        'department.employees'
      )
      .getMany();

    return query;
}


  remove(id: number) {
    return this.departmentRepo.delete(id);
  }
}
