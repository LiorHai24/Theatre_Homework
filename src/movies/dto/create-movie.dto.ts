import { IsString, IsInt, Min, Max, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsInt()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  release_year: number;
}