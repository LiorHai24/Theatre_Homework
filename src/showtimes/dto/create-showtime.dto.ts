import { IsNotEmpty, IsNumber, IsDate, Min, Max, IsPositive, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShowtimeDto {
  @IsNotEmpty({ message: 'Movie ID is required' })
  @IsNumber({}, { message: 'Movie ID must be a number' })
  @Min(1, { message: 'Movie ID must be a positive number' })
  movie: number;
  
  @IsNotEmpty({ message: 'Theater ID is required' })
  @IsNumber({}, { message: 'Theater ID must be a number' })
  @Min(1, { message: 'Theater ID must be a positive number' })
  theater: number;

  @IsNotEmpty({ message: 'Start time is required' })
  @Type(() => Date)
  @IsDate({ message: 'Start time must be a valid date' })
  start_time: Date;

  @IsNotEmpty({ message: 'End time is required' })
  @Type(() => Date)
  @IsDate({ message: 'End time must be a valid date' })
  @ValidateIf((o) => o.start_time !== undefined, {
    message: 'End time must be after start time'
  })
  end_time: Date;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number with up to 2 decimal places' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;
} 