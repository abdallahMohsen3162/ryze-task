import { IsOptional, IsString, IsIn } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/pagination.dto';

export class EmployeeSearchDto extends PaginationQueryDto {

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'ASC';
}

