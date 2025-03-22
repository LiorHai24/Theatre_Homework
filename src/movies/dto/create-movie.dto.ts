import { IsString, IsInt, Min, Max, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty({ message: 'Movie title is required' })
  @IsString({ message: 'Movie title must be a text' })
  title: string;

  @IsNotEmpty({ message: 'Movie genre is required' })
  @IsString({ message: 'Movie genre must be a text' })
  genre: string;

  @IsInt({ message: 'Duration must be a whole number' })
  @Min(1, { message: 'Duration must be at least 1 minute' })
  duration: number;

  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(0, { message: 'Rating cannot be negative' })
  @Max(10, { message: 'Rating cannot be higher than 10' })
  rating: number;

  @IsInt({ message: 'Release year must be a whole number' })
  @Min(1895, { message: 'Release year cannot be before 1895' })
  @Max(new Date().getFullYear(), { message: 'Release year cannot be in the future' })
  release_year: number;
}