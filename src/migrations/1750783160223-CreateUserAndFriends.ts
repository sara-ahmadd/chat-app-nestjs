import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAndFriends1750783160223 implements MigrationInterface {
    name = 'CreateUserAndFriends1750783160223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_friends\` (\`userId\` int NOT NULL, \`friendId\` int NOT NULL, INDEX \`IDX_a04bbd8154eb20c5138a38bb5a\` (\`userId\`), INDEX \`IDX_f51239b2835ec1196de5f885ab\` (\`friendId\`), PRIMARY KEY (\`userId\`, \`friendId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_friends\` ADD CONSTRAINT \`FK_a04bbd8154eb20c5138a38bb5aa\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_friends\` ADD CONSTRAINT \`FK_f51239b2835ec1196de5f885ab2\` FOREIGN KEY (\`friendId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_friends\` DROP FOREIGN KEY \`FK_f51239b2835ec1196de5f885ab2\``);
        await queryRunner.query(`ALTER TABLE \`user_friends\` DROP FOREIGN KEY \`FK_a04bbd8154eb20c5138a38bb5aa\``);
        await queryRunner.query(`DROP INDEX \`IDX_f51239b2835ec1196de5f885ab\` ON \`user_friends\``);
        await queryRunner.query(`DROP INDEX \`IDX_a04bbd8154eb20c5138a38bb5a\` ON \`user_friends\``);
        await queryRunner.query(`DROP TABLE \`user_friends\``);
    }

}
