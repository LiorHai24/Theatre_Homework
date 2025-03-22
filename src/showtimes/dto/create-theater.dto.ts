import { IsNumber, Min, IsString, IsNotEmpty } from 'class-validator';

export class CreateTheaterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1, { message: 'Number of rows must be at least 1' })
  rows: number;

  @IsNumber()
  @Min(1, { message: 'Number of seats per row must be at least 1' })
  seatsPerRow: number;
} 