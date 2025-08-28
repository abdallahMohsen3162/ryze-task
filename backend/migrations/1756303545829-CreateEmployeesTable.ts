import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeesTable1756303545829 implements MigrationInterface {
    name = 'CreateEmployeesTable1756303545829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Employees" ("id" int NOT NULL IDENTITY(1,1), "firstName" nvarchar(100) NOT NULL, "lastName" nvarchar(100) NOT NULL, "email" nvarchar(100) NOT NULL, "hireDate" date NOT NULL CONSTRAINT "DF_b1ecf72b879c0972b6a241a5707" DEFAULT getdate(), CONSTRAINT "UQ_d759e52714d921c866f6fd299aa" UNIQUE ("email"), CONSTRAINT "PK_42cbd69fa6c59f000fdc0c07bb9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Employees"`);
    }

}
