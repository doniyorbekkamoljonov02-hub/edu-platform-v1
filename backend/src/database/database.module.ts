import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const prod = process.env.NODE_ENV === 'production';
        const databaseUrl = process.env.DATABASE_URL?.trim();

        // Local development must keep using the local edu_platform database.
        // DATABASE_URL is reserved for deployed/production environments so a
        // Supabase URL in .env cannot silently switch local demo accounts away.
        const connection = prod && databaseUrl
          ? { url: databaseUrl }
          : {
              host: config.get<string>('database.host'),
              port: config.get<number>('database.port'),
              username: config.get<string>('database.username'),
              password: config.get<string>('database.password'),
              database: config.get<string>('database.name'),
            };

        return {
          type: 'postgres' as const,
          ...connection,
          autoLoadEntities: true,
          synchronize: process.env.DB_SYNCHRONIZE === 'true' || !prod,
          ssl: prod && databaseUrl ? { rejectUnauthorized: false } : false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
