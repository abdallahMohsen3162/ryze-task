import { IsEmail, IsNotEmpty, Length, IsDateString, IsOptional, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';


export class CreateEmployeeDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @Length(2, 100)
  firstName: string;

  @IsNotEmpty()
  @Length(2, 100)
  lastName: string;

  @IsDateString({}, { message: 'Hire date must be a valid date (YYYY-MM-DD)' })
  hireDate: Date;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  department?: number;  // Changed from departmentId to department
}