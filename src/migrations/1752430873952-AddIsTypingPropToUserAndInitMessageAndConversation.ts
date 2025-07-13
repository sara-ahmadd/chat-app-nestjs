import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsTypingPropToUserAndInitMessageAndConversation1752430873952 implements MigrationInterface {
    name = 'AddIsTypingPropToUserAndInitMessageAndConversation1752430873952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`_id\` varchar(255) NOT NULL, \`contentText\` varchar(255) NOT NULL, \`contentImgUrl\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`conversationId\` int NULL, \`sentById\` int NULL, UNIQUE INDEX \`IDX_89218ae505e42c9427af38727c\` (\`_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`conversation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`_id\` varchar(255) NOT NULL, \`isGroup\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_819476338ff7b81a323266a5dc\` (\`_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`conversation_participants_user\` (\`conversationId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_4928ef292e3fb48783034b82f7\` (\`conversationId\`), INDEX \`IDX_5d93fb1843f96fbdefea37dae8\` (\`userId\`), PRIMARY KEY (\`conversationId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`isTyping\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_7cf4a4df1f2627f72bf6231635f\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_16dc5617e9947f29b7bb1cb2410\` FOREIGN KEY (\`sentById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` ADD CONSTRAINT \`FK_4928ef292e3fb48783034b82f7a\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` ADD CONSTRAINT \`FK_5d93fb1843f96fbdefea37dae86\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` DROP FOREIGN KEY \`FK_5d93fb1843f96fbdefea37dae86\``);
        await queryRunner.query(`ALTER TABLE \`conversation_participants_user\` DROP FOREIGN KEY \`FK_4928ef292e3fb48783034b82f7a\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_16dc5617e9947f29b7bb1cb2410\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_7cf4a4df1f2627f72bf6231635f\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isTyping\``);
        await queryRunner.query(`DROP INDEX \`IDX_5d93fb1843f96fbdefea37dae8\` ON \`conversation_participants_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_4928ef292e3fb48783034b82f7\` ON \`conversation_participants_user\``);
        await queryRunner.query(`DROP TABLE \`conversation_participants_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_819476338ff7b81a323266a5dc\` ON \`conversation\``);
        await queryRunner.query(`DROP TABLE \`conversation\``);
        await queryRunner.query(`DROP INDEX \`IDX_89218ae505e42c9427af38727c\` ON \`message\``);
        await queryRunner.query(`DROP TABLE \`message\``);
    }

}
