import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventSearch } from './event-search.entity';
import { AiService } from './ai.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectRepository(EventSearch)
    private readonly repo: Repository<EventSearch>,
    private readonly aiService: AiService,
  ) {}

  /**
   * Process a new event query:
   * 1. Call OpenAI for a venue proposal
   * 2. Persist to MySQL
   * 3. Return the saved record
   */
  async createSearch(dto: CreateEventDto): Promise<EventSearch> {
    this.logger.log(`Processing query: "${dto.query}"`);

    const proposal = await this.aiService.generateVenueProposal(dto.query);

    const record = this.repo.create({
      userQuery: dto.query,
      venueName: proposal.venueName,
      location: proposal.location,
      estimatedCost: proposal.estimatedCost,
      whyItFits: proposal.whyItFits,
      amenities: proposal.amenities,
      rawResponse: proposal as unknown as object,
    });

    const saved = await this.repo.save(record);
    this.logger.log(`Saved search #${saved.id}`);
    return saved;
  }

  /**
   * Retrieve all past searches, newest first
   */
  async findAll(): Promise<EventSearch[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      take: 50, // cap at 50 for performance
    });
  }

  /**
   * Delete a single search by ID
   */
  async deleteSearch(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
