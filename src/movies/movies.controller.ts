import { Controller, Get, Post, Body, Param, Delete, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      return await this.moviesService.create(createMovieDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create movie',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('all')
  async findAll(): Promise<Movie[]> {
    try {
      return await this.moviesService.findAll();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch movies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Movie> {
    try {
      const movie = await this.moviesService.findOne(+id);
      if (!movie) {
        throw new HttpException(
          `Movie with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return movie;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to fetch movie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('update/:movieTitle')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('movieTitle') movieTitle: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<{message: string}> {
    try {
      return await this.moviesService.update(movieTitle, updateMovieDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to update movie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':movieTitle')
  async remove(@Param('movieTitle') movieTitle: string): Promise<{ message: string }> {
    try {
      await this.moviesService.remove(movieTitle);
      return { message: `Movie "${movieTitle}" has been successfully deleted` };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to delete movie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
