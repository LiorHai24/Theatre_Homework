import { IsString, IsInt, Min, Max, IsNumber, IsOptional } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString({ message: 'Movie title must be a text' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Movie genre must be a text' })
  genre?: string;

  @IsOptional()
  @IsInt({ message: 'Duration must be a whole number' })
  @Min(1, { message: 'Duration must be at least 1 minute' })
  duration?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(0, { message: 'Rating cannot be negative' })
  @Max(5, { message: 'Rating cannot be higher than 5' })
  rating?: number;

  @IsOptional()
  @IsInt({ message: 'Release year must be a whole number' })
  @Min(1895, { message: 'Release year cannot be before 1895' })
  @Max(new Date().getFullYear(), { message: 'Release year cannot be in the future' })
  release_year?: number;
} 