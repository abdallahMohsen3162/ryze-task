import { IsOptional } from "class-validator";
import { PaginationQueryDto } from "src/common/pagination/pagination.dto";


export class SearchDepartmentDto extends PaginationQueryDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  search?: string

  @IsOptional()
  sortBy?: string

  @IsOptional()
  order?: 'ASC' | 'DESC'
}