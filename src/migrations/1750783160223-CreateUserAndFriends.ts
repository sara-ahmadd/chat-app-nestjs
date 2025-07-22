import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndFriends1750783160223 implements MigrationInterface {
  name = 'CreateUserAndFriends1750783160223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`user_friends\` (
        \`userId\` int NOT NULL,
        \`friendId\` int NOT NULL,
        INDEX \`IDX_user_friends_userId\` (\`userId\`),
        INDEX \`IDX_user_friends_friendId\` (\`friendId\`),
        PRIMARY KEY (\`userId\`, \`friendId\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      ALTER TABLE \`user_friends\`
      ADD CONSTRAINT \`FK_user_friends_userId\`
      FOREIGN KEY (\`userId\`)
      REFERENCES \`user\`(\`id\`)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`user_friends\`
      ADD CONSTRAINT \`FK_user_friends_friendId\`
      FOREIGN KEY (\`friendId\`)
      REFERENCES \`user\`(\`id\`)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`user_friends\` DROP FOREIGN KEY \`FK_user_friends_friendId\`
    `);
    await queryRunner.query(`
      ALTER TABLE \`user_friends\` DROP FOREIGN KEY \`FK_user_friends_userId\`
    `);
    await queryRunner.query(`
      DROP INDEX \`IDX_user_friends_friendId\` ON \`user_friends\`
    `);
    await queryRunner.query(`
      DROP INDEX \`IDX_user_friends_userId\` ON \`user_friends\`
    `);
    await queryRunner.query(`DROP TABLE \`user_friends\``);
  }
}
