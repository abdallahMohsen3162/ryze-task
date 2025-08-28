import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1756324579781 implements MigrationInterface {
    name = 'CreateUsersTable1756324579781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Users" ("id" int NOT NULL IDENTITY(1,1), "userName" nvarchar(100) NOT NULL, "password" nvarchar(100) NOT NULL, "role" nvarchar(20) NOT NULL CONSTRAINT "DF_a8fa87b58ffe43f6dd82ee6ef24" DEFAULT 'User', CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Users"`);
    }

}
