import { IsNumber, IsString, IsDateString, Min, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateShowtimeDto } from './create-showtime.dto';

export class UpdateShowtimeDto extends PartialType(CreateShowtimeDto) {
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