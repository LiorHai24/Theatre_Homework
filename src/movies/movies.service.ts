import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }

  async findAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['showtimes'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async update(movieTitle: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { title: movieTitle },
      relations: ['showtimes'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with title "${movieTitle}" not found`);
    }

    // If duration is being updated, check all future showtimes
    if (updateMovieDto.duration && updateMovieDto.duration !== movie.duration) {
      const existingShowtimes = await this.showtimeRepository.find({
        where: {
          movie: { id: movie.id },
          start_time: new Date(),
        },
        order: {
          start_time: 'ASC',
        },
      });

      if (existingShowtimes && existingShowtimes.length > 0) {
        for (const showtime of existingShowtimes) {
          if (!showtime.id) continue; // Skip if showtime doesn't have an ID

          const startTime = new Date(showtime.start_time);
          const endTime = new Date(showtime.end_time);
          const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

          // If the new duration would make the showtime invalid, throw an error
          if (Math.abs(durationInMinutes - updateMovieDto.duration) > 5) {
            throw new BadRequestException(
              `Cannot update movie duration because there are existing showtimes that don't match the new duration`,
            );
          }
        }
      }
    }

    // Update the movie
    Object.assign(movie, updateMovieDto);
    return this.movieRepository.save(movie);
  }

  async remove(movieTitle: string): Promise<{ message: string }> {
    const movie = await this.movieRepository.findOne({
      where: { title: movieTitle },
      relations: ['showtimes'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with title "${movieTitle}" not found`);
    }

    if (movie.showtimes && movie.showtimes.length > 0) {
      throw new BadRequestException('Cannot delete movie with existing showtimes');
    }

    await this.movieRepository.remove(movie);
    return { message: `Movie "${movieTitle}" has been successfully deleted` };
  }
}
