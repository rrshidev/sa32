import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddCities1749963130985 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'city',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    // Add initial cities
    await queryRunner.query(`
      INSERT INTO city (name) VALUES
        ('Москва'),
        ('Санкт-Петербург'),
        ('Новосибирск'),
        ('Екатеринбург'),
        ('Казань')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('city');
  }
}
