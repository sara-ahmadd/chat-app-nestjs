import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConversationMetaDataEntity1756833450025 implements MigrationInterface {
    name = 'AddConversationMetaDataEntity1756833450025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`conversation_meta_data\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`conversationId\` varchar(36) NULL, \`lastReadMessageId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`conversation_meta_data\` ADD CONSTRAINT \`FK_02b48052661a00a14b30d936b19\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversation_meta_data\` ADD CONSTRAINT \`FK_6072511b245ad19ca738e38636a\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`conversation_meta_data\` ADD CONSTRAINT \`FK_0db8ac34277340c05c5c33c09f8\` FOREIGN KEY (\`lastReadMessageId\`) REFERENCES \`message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conversation_meta_data\` DROP FOREIGN KEY \`FK_0db8ac34277340c05c5c33c09f8\``);
        await queryRunner.query(`ALTER TABLE \`conversation_meta_data\` DROP FOREIGN KEY \`FK_6072511b245ad19ca738e38636a\``);
        await queryRunner.query(`ALTER TABLE \`conversation_meta_data\` DROP FOREIGN KEY \`FK_02b48052661a00a14b30d936b19\``);
        await queryRunner.query(`DROP TABLE \`conversation_meta_data\``);
    }

}
