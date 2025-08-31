import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImagePublicIdToMessage1756053161597 implements MigrationInterface {
    name = 'AddImagePublicIdToMessage1756053161597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message\` ADD \`contentImgPublicId\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message\` DROP COLUMN \`contentImgPublicId\``);
    }

}
