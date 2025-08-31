import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastReadMsgToUser1756658839815 implements MigrationInterface {
    name = 'AddLastReadMsgToUser1756658839815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`lastReadMsgId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_3e00b75d0373c2853cd6bb809c\` (\`lastReadMsgId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_3e00b75d0373c2853cd6bb809c\` ON \`user\` (\`lastReadMsgId\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_3e00b75d0373c2853cd6bb809c4\` FOREIGN KEY (\`lastReadMsgId\`) REFERENCES \`message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_3e00b75d0373c2853cd6bb809c4\``);
        await queryRunner.query(`DROP INDEX \`REL_3e00b75d0373c2853cd6bb809c\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_3e00b75d0373c2853cd6bb809c\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`lastReadMsgId\``);
    }

}
