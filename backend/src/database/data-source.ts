import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Грузим .env по NODE_ENV: сначала .env.<env>, потом .env
const envName = process.env.NODE_ENV ?? 'development';
dotenv.config({ path: resolve(__dirname, `../../.env.${envName}`) });
dotenv.config({ path: resolve(__dirname, '../../.env') });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5435'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: true,
});
