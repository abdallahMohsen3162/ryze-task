import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { InjectRepository } from '@nestjs/typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueDepNameConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  async validate(name: string, args: ValidationArguments): Promise<boolean> {
    const dto: any = args.object;

    const department = await this.departmentRepo.findOne({
      where: { name },
    });


    if (department && department.id !== dto.id) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `Department name "${args.value}" is already taken`;
  }
}

export function UniqueDepName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueDepNameConstraint,
    });
  };
}
