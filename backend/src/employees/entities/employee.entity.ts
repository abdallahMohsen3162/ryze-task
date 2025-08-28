import { Department } from '../../departments/entities/department.entity';
import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';

@Entity('Employees') 
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Index()
  @Column({ length: 100, unique: true }) 
  email: string;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' }) 
  hireDate: Date;


  // No departmentId column defined
  @ManyToOne(() => Department, (department) => department.employees, { 
    nullable: true, 
    onDelete: 'SET NULL' 
  })
  @JoinColumn({ name: 'departmentId' })
  department: Department | null;

}