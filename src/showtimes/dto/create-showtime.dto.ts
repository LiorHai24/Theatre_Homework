import { IsNumber, IsString, IsDateString, Min } from 'class-validator';

export class CreateShowtimeDto {
  @IsNumber()
  movieId: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  theater: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
} 