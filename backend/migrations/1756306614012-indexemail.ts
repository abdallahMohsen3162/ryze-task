import { MigrationInterface, QueryRunner } from "typeorm";

export class Indexemail1756306614012 implements MigrationInterface {
    name = 'Indexemail1756306614012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_d759e52714d921c866f6fd299a" ON "Employees" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_d759e52714d921c866f6fd299a" ON "Employees"`);
    }

}
