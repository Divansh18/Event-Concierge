import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from './event/event.module';
import { EventSearch } from './event/event-search.entity';

@Module({
  imports: [
    // Global config from .env
    ConfigModule.forRoot({ isGlobal: true }),

    // MySQL via TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'event_concierge'),
        entities: [EventSearch],
        synchronize: true, // auto-creates tables; disable in prod & use migrations
        logging: false,
        charset: 'utf8mb4',
      }),
    }),

    EventModule,
  ],
})
export class AppModule {}
