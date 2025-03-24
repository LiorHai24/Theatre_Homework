import { IsString, IsNumber, Min } from 'class-validator';

export class CreateTheaterDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  rows: number;

  @IsNumber()
  @Min(1)
  seatsPerRow: number;
} 