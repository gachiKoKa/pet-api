import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTableWithPasswordField1677590568660
  implements MigrationInterface
{
  public name = 'UpdateUserTableWithPasswordField1677590568660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`password\` varchar(60) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
  }
}
