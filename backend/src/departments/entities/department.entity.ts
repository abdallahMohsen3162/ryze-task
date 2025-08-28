import { Employee } from '../../employees/entities/employee.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('Departments') 
export class Department {
  @PrimaryGeneratedColumn()
  id: number;


  @Column({ length: 100, unique: true }) 
  name: string;


  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];

}
