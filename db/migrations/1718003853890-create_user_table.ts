import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1718003853890 implements MigrationInterface {
    name = 'CreateUserTable1718003853890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
