import { Department } from '../../departments/entities/department.entity';
import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User'
}

@Entity('Users') 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  userName: string;

  @Column({ length: 100 })
  password: string;

 @Column({
    type: 'nvarchar',
    length: 20,
    default: UserRole.USER
  })
  role: UserRole;
}