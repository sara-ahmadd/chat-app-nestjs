import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConversationAndMessageRepositoryFilesAndUpdateId1752600116840 implements MigrationInterface {
    name = 'AddConversationAndMessageRepositoryFilesAndUpdateId1752600116840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_89218ae505e42c9427af38727c\` ON \`message\``);
        await queryRunner.query(`DROP INDEX \`IDX_819476338ff7b81a323266a5dc\` ON \`conversation\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP COLUMN \`_id\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP COLUMN \`_id\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_7cf4a4df1f2627f72bf6231635f\``);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`message\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`message\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`message\` DROP COLUMN \`conversationId\``);
        await queryRunner.query(`ALTER TABLE \`message\` ADD \`conversationId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` DROP FOREIGN KEY \`FK_4928ef292e3fb48783034b82f7a\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` ADD PRIMARY KEY (\`userId\`)`);
        await queryRunner.query(`DROP INDEX \`IDX_4928ef292e3fb48783034b82f7\` ON \`conversation_participants_user\``);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` DROP COLUMN \`conversationId\``);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` ADD \`conversationId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` ADD PRIMARY KEY (\`userId\`, \`conversationId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_4928ef292e3fb48783034b82f7\` ON \`conversation_participants_user\` (\`conversationId\`)`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_7cf4a4df1f2627f72bf6231635f\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` ADD CONSTRAINT \`FK_4928ef292e3fb48783034b82f7a\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` DROP FOREIGN KEY \`FK_4928ef292e3fb48783034b82f7a\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_7cf4a4df1f2627f72bf6231635f\``);
        await queryRunner.query(`DROP INDEX \`IDX_4928ef292e3fb48783034b82f7\` ON \`conversation_participants_user\``);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` ADD PRIMARY KEY (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` DROP COLUMN \`conversationId\``);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` ADD \`conversationId\` int NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_4928ef292e3fb48783034b82f7\` ON \`conversation_participants_user\` (\`conversationId\`)`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` ADD PRIMARY KEY (\`conversationId\`, \`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`conversation\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`conversation\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` ADD CONSTRAINT \`FK_4928ef292e3fb48783034b82f7a\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`message\` DROP COLUMN \`conversationId\``);
        await queryRunner.query(`ALTER TABLE \`message\` ADD \`conversationId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`message\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`message\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_7cf4a4df1f2627f72bf6231635f\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversation\` ADD \`_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD \`_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_819476338ff7b81a323266a5dc\` ON \`conversation\` (\`_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_89218ae505e42c9427af38727c\` ON \`message\` (\`_id\`)`);
    }

}
