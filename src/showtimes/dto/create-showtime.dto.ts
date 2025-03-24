import { IsNumber, IsString, IsDateString, Min } from 'class-validator';

export class CreateShowtimeDto {
  @IsNumber()
  movieId: number;

  @IsString()
  theater: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
} 