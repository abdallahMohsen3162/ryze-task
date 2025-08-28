import { User } from './src/auth/entities/auth.entity';
import { Department } from './src/departments/entities/department.entity';
import { Employee } from './src/employees/entities/employee.entity';
import { DataSource } from 'typeorm';


export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost',
  port: 11422,
  username: '',
  password: '',
  database: '',
  entities: [Employee, Department, User],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: true,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});
 