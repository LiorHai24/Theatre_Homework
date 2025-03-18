import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './entities/movie.entity';
import { Theater } from '../showtimes/entities/theater.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Movie | null> {
    return this.moviesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.moviesService.remove(+id);
  }

  // Theater endpoints
  @Post('theaters')
  createTheater(
    @Body('name') name: string,
    @Body('capacity') capacity: number,
  ): Promise<Theater> {
    return this.moviesService.createTheater(name, capacity);
  }

  @Get('theaters')
  getTheaters(): Promise<Theater[]> {
    return this.moviesService.getTheaters();
  }

  @Get('theaters/:id')
  getTheaterById(@Param('id') id: number): Promise<Theater> {
    return this.moviesService.getTheaterById(+id);
  }
}
