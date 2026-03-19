import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { AiService } from './ai.service';
import { EventSearch } from './event-search.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventSearch])],
  controllers: [EventController],
  providers: [EventService, AiService],
})
export class EventModule {}
