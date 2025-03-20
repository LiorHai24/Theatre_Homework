import { IsNumber, Min } from 'class-validator';

export class CreateTheaterDto {
  @IsNumber()
  @Min(1, { message: 'Number of rows must be at least 1' })
  rows: number;

  @IsNumber()
  @Min(1, { message: 'Number of seats per row must be at least 1' })
  seatsPerRow: number;
} 