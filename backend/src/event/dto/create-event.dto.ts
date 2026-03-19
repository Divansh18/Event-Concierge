import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Event description cannot be empty.' })
  @MinLength(10, { message: 'Please describe your event in at least 10 characters.' })
  @MaxLength(1000, { message: 'Event description must not exceed 1000 characters.' })
  query: string;
}
