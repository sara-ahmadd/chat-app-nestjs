import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCredentialsLastUpdate1750870962612 implements MigrationInterface {
    name = 'AddCredentialsLastUpdate1750870962612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`changeCredentials\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`changeCredentials\``);
    }

}
