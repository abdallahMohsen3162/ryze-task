import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDepartments1756318220582 implements MigrationInterface {
    name = 'CreateDepartments1756318220582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Departments" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(100) NOT NULL, CONSTRAINT "UQ_0b0f21ff0ddda5676ab476a2e4b" UNIQUE ("name"), CONSTRAINT "PK_bc2db2043c7e4f09f6965b50186" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD "departmentId" int`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD CONSTRAINT "FK_b5f1697d1fb8e0ab1c84a1f34bf" FOREIGN KEY ("departmentId") REFERENCES "Departments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" DROP CONSTRAINT "FK_b5f1697d1fb8e0ab1c84a1f34bf"`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP COLUMN "departmentId"`);
        await queryRunner.query(`DROP TABLE "Departments"`);
    }

}
