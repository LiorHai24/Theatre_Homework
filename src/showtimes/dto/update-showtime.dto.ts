import { IsNumber, IsString, IsDateString, Min, IsOptional } from 'class-validator';

export class UpdateShowtimeDto {
  @IsOptional()
  @IsNumber()
  movieId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  theater?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
} 