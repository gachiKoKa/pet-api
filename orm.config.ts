import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';

dotenv.config();

export const ORM_CONFIG = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['dist/src/shared/dal/entities/**/*.entity.{js,ts}'],
  migrations: ['dist/src/shared/dal/migrations/*.{js,ts}'],
  subscribers: [],
  logging: 'all',
  logger: 'advanced-console',
});
