import { MigrationInterface, QueryRunner } from 'typeorm';

export class FullSchema1749970457257 implements MigrationInterface {
  name = 'FullSchema1749970457257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            
            -- Таблица пользователей
            CREATE TABLE "user" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "email" varchar NOT NULL UNIQUE,
                "phone" varchar,
                "role" varchar NOT NULL CHECK (role IN ('client', 'service')),
                "password" varchar NOT NULL,
                "created_at" timestamp NOT NULL DEFAULT now()
            );
            
            -- Профиль клиента
            CREATE TABLE "client_profile" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "first_name" varchar NOT NULL,
                "last_name" varchar NOT NULL,
                "user_id" uuid UNIQUE NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
            );
            
            -- Профиль автосервиса
            CREATE TABLE "service_profile" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar NOT NULL,
                "address" varchar NOT NULL,
                "description" text,
                "user_id" uuid UNIQUE NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
            );
            
            -- Автомобили
            CREATE TABLE "car" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "make" varchar NOT NULL,
                "model" varchar NOT NULL,
                "year" integer NOT NULL,
                "vin" varchar UNIQUE,
                "mileage" integer,
                "owner_id" uuid NOT NULL REFERENCES "client_profile"(id) ON DELETE CASCADE,
                "created_at" timestamp NOT NULL DEFAULT now()
            );
            
            -- Услуги автосервисов
            CREATE TABLE "service" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar NOT NULL,
                "description" text,
                "price" numeric(10,2) NOT NULL,
                "duration_minutes" integer NOT NULL,
                "service_profile_id" uuid NOT NULL REFERENCES "service_profile"(id) ON DELETE CASCADE
            );
            
            -- Мастера
            CREATE TABLE "master" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "first_name" varchar NOT NULL,
                "last_name" varchar NOT NULL,
                "specialization" varchar NOT NULL,
                "experience_years" integer NOT NULL,
                "service_profile_id" uuid NOT NULL REFERENCES "service_profile"(id) ON DELETE CASCADE
            );
            
            -- Записи на услуги
            CREATE TABLE "appointment" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "start_time" timestamp NOT NULL,
                "end_time" timestamp NOT NULL,
                "status" varchar NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
                "notes" text,
                "car_id" uuid NOT NULL REFERENCES "car"(id) ON DELETE CASCADE,
                "service_id" uuid NOT NULL REFERENCES "service"(id) ON DELETE CASCADE,
                "master_id" uuid REFERENCES "master"(id) ON DELETE SET NULL,
                "created_at" timestamp NOT NULL DEFAULT now()
            );
            
            -- Индексы для ускорения поиска
            CREATE INDEX "IDX_APPOINTMENT_CAR" ON "appointment" ("car_id");
            CREATE INDEX "IDX_APPOINTMENT_SERVICE" ON "appointment" ("service_id");
            CREATE INDEX "IDX_APPOINTMENT_MASTER" ON "appointment" ("master_id");
            CREATE INDEX "IDX_APPOINTMENT_STATUS" ON "appointment" ("status");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "appointment";
            DROP TABLE "master";
            DROP TABLE "service";
            DROP TABLE "car";
            DROP TABLE "service_profile";
            DROP TABLE "client_profile";
            DROP TABLE "user";
        `);
  }
}
