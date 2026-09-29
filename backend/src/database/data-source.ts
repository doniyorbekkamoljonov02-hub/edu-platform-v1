import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Used by the TypeORM CLI for generating/running migrations, e.g.:
 *   npx typeorm-ts-node-commonjs migration:generate -d src/database/data-source.ts src/database/migrations/Init
 *   npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts
 *
 * This is separate from the NestJS runtime connection configured in
 * app.module.ts, which is what the application actually uses when it boots.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'edu_platform',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
