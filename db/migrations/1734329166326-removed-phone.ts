import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedPhone1734329166326 implements MigrationInterface {
    name = 'RemovedPhone1734329166326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NOT NULL`);
    }

}