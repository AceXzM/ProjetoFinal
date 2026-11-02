import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize(
  process.env.DB_NAME ?? 'techforge',
  process.env.DB_USER ?? 'techforge',
  process.env.DB_PASSWORD ?? '',
  {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    dialect: 'mysql',
    logging: false,
  }
);
