import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1717748670369 implements MigrationInterface {
    name = 'CreateUserTable1717748670369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refrech_token\` \`refrech_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refrech_token\` \`refrech_token\` varchar(255) NOT NULL`);
    }

}
