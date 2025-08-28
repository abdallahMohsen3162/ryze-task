import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UniqueEmailPipe } from './validators/unique-email.pipe';
import { EmployeeSearchDto } from './dto/search-query.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/auth.entity';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';



@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body(UniqueEmailPipe) createEmployeeDto: CreateEmployeeDto,
  ) {
    return this.employeesService.create(createEmployeeDto);
  }


  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll(@Query() query: EmployeeSearchDto) {
    return this.employeesService.findAll(query);
  }

  
  @Get("analyses")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10000)
  getAnalysis(@Query('take') take: number) {
    return this.employeesService.getAnalysis(take || 5);
  }
  
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: number, @Body(UniqueEmailPipe) updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }
  
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.employeesService.remove(id);
  }

}
