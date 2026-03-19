import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventSearch } from './event-search.entity';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * POST /api/events
   * Submit a new event query → AI generates venue proposal → saved to DB
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateEventDto): Promise<EventSearch> {
    return this.eventService.createSearch(dto);
  }

  /**
   * GET /api/events
   * Retrieve all past searches (newest first)
   */
  @Get()
  async findAll(): Promise<EventSearch[]> {
    return this.eventService.findAll();
  }

  /**
   * DELETE /api/events/:id
   * Remove a specific search record
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.eventService.deleteSearch(id);
  }
}
