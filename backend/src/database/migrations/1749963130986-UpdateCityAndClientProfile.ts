import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateCityAndClientProfile1749963130986
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns to City table
    await queryRunner.addColumn(
      'city',
      new TableColumn({
        name: 'clientProfileId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'city',
      new TableColumn({
        name: 'masterId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'city',
      new TableColumn({
        name: 'serviceProfileId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add city_id column to ClientProfile table
    await queryRunner.addColumn(
      'client_profile',
      new TableColumn({
        name: 'city_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add more major Russian cities
    await queryRunner.query(`
      INSERT INTO city (name) VALUES
        ('Новозыбков'),
        ('Нижний Новгород'),
        ('Самара'),
        ('Омск'),
        ('Казань'),
        ('Челябинск'),
        ('Воронеж'),
        ('Пермь'),
        ('Волгоград'),
        ('Красноярск'),
        ('Саратов'),
        ('Краснодар'),
        ('Тюмень'),
        ('Ижевск'),
        ('Барнаул'),
        ('Ульяновск'),
        ('Иркутск'),
        ('Хабаровск'),
        ('Ярославль'),
        ('Владивосток'),
        ('Махачкала')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove columns from City table
    await queryRunner.dropColumn('city', 'clientProfileId');
    await queryRunner.dropColumn('city', 'masterId');
    await queryRunner.dropColumn('city', 'serviceProfileId');

    // Remove city_id column from ClientProfile table
    await queryRunner.dropColumn('client_profile', 'city_id');
  }
}
