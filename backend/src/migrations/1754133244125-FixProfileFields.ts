import { MigrationInterface, QueryRunner } from "typeorm";

export class FixProfileFields1754133244125 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Делаем поля в ClientProfile nullable
        await queryRunner.query(`
            ALTER TABLE "client_profile" 
            ALTER COLUMN "firstName" DROP NOT NULL,
            ALTER COLUMN "lastName" DROP NOT NULL
        `);
        
        // Делаем поля в ServiceProfile nullable  
        await queryRunner.query(`
            ALTER TABLE "service_profile" 
            ALTER COLUMN "name" DROP NOT NULL,
            ALTER COLUMN "address" DROP NOT NULL
        `);
        
        // Делаем city_id nullable в обеих таблицах
        await queryRunner.query(`
            ALTER TABLE "client_profile" 
            ALTER COLUMN "city_id" DROP NOT NULL
        `);
        
        await queryRunner.query(`
            ALTER TABLE "service_profile" 
            ALTER COLUMN "city_id" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Возвращаем NOT NULL ограничения
        await queryRunner.query(`
            ALTER TABLE "client_profile" 
            ALTER COLUMN "firstName" SET NOT NULL,
            ALTER COLUMN "lastName" SET NOT NULL
        `);
        
        await queryRunner.query(`
            ALTER TABLE "service_profile" 
            ALTER COLUMN "name" SET NOT NULL,
            ALTER COLUMN "address" SET NOT NULL
        `);
        
        await queryRunner.query(`
            ALTER TABLE "client_profile" 
            ALTER COLUMN "city_id" SET NOT NULL
        `);
        
        await queryRunner.query(`
            ALTER TABLE "service_profile" 
            ALTER COLUMN "city_id" SET NOT NULL
        `);
    }

}
