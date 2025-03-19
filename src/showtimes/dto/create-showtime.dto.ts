import { IsNotEmpty, IsNumber, IsDate, Min, Max, IsPositive, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShowtimeDto {
  @IsNotEmpty({ message: 'Movie ID is required' })
  @IsNumber({}, { message: 'Movie ID must be a number' })
  @IsPositive({ message: 'Movie ID must be a positive number' })
  movieId: number;

  @IsNotEmpty({ message: 'Theater ID is required' })
  @IsNumber({}, { message: 'Theater ID must be a number' })
  @IsPositive({ message: 'Theater ID must be a positive number' })
  theaterId: number;

  @IsNotEmpty({ message: 'Start time is required' })
  @Type(() => Date)
  @IsDate({ message: 'Start time must be a valid date' })
  startTime: Date;

  @IsNotEmpty({ message: 'End time is required' })
  @Type(() => Date)
  @IsDate({ message: 'End time must be a valid date' })
  @ValidateIf((o) => o.startTime !== undefined, {
    message: 'End time must be after start time'
  })
  endTime: Date;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be a positive number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @IsNotEmpty({ message: 'Available seats is required' })
  @IsNumber({}, { message: 'Available seats must be a number' })
  @IsPositive({ message: 'Available seats must be a positive number' })
  @Min(0, { message: 'Available seats cannot be negative' })
  @Max(100, { message: 'Available seats cannot exceed 100' })
  availableSeats: number;
} 