import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;
}



export class PaginationMetaDto {
  total: number;
  page: number;
  lastPage: number;
}

export class PaginationResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}