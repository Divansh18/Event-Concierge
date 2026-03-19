import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('event_searches')
export class EventSearch {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'text', name: 'user_query' })
  userQuery: string;

  @Column({ type: 'varchar', length: 255, name: 'venue_name' })
  venueName: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'varchar', length: 100, name: 'estimated_cost' })
  estimatedCost: string;

  @Column({ type: 'text', name: 'why_it_fits' })
  whyItFits: string;

  @Column({ type: 'json', nullable: true })
  amenities: string[];

  @Column({ type: 'json', nullable: true, name: 'raw_response' })
  rawResponse: object;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
