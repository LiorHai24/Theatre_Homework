import { IsOptional, IsNumber, IsDate, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateShowtimeDto {
  @IsOptional()
  @IsNumber({}, { message: 'Movie ID must be a number' })
  @Min(1, { message: 'Movie ID must be a positive number' })
  movie?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Theater ID must be a number' })
  @Min(1, { message: 'Theater ID must be a positive number' })
  theater?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Start time must be a valid date' })
  start_time?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'End time must be a valid date' })
  end_time?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;
} 