import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvaterPublicIdToUserEntity1750874382655 implements MigrationInterface {
    name = 'AddAvaterPublicIdToUserEntity1750874382655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatarPublicId\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatarPublicId\``);
    }

}
