import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Showtime } from '../showtimes/entities/showtime.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }

  findAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie & { message?: string }> {
    const movie = await this.findOne(id);

    // If duration is being updated, handle showtime adjustments
    if (updateMovieDto.duration !== undefined && updateMovieDto.duration !== movie.duration) {
      const existingShowtimes = await this.showtimeRepository.find({
        where: { movie: { id } },
        relations: ['theater'],
      });

      for (const showtime of existingShowtimes) {
        if (!showtime.id) continue; // Skip if showtime doesn't have an ID

        const startTime = new Date(showtime.start_time);
        const newEndTime = new Date(startTime.getTime() + updateMovieDto.duration * 60000); // Convert minutes to milliseconds

        if (updateMovieDto.duration < movie.duration) {
          // If duration is shortened, simply update the end_time
          showtime.end_time = newEndTime;
        } else {
          // If duration is lengthened, check for overlaps
          const overlappingShowtime = await this.showtimeRepository.findOne({
            where: {
              theater: { id: showtime.theater.id },
              start_time: Between(showtime.end_time, newEndTime),
            },
          });

          if (overlappingShowtime) {
            // If there's an overlap, delete the showtime
            const showtimeId = showtime.id; // Store the ID before deletion
            await this.showtimeRepository.remove(showtime);
            return {
              ...movie,
              ...updateMovieDto,
              message: `Showtime with ID ${showtimeId} has been deleted due to duration change causing overlap with another showtime. Please reschedule this showtime.`,
            };
          } else {
            // If no overlap, update the end_time
            showtime.end_time = newEndTime;
          }
        }
      }

      // Save all showtime changes
      await this.showtimeRepository.save(existingShowtimes);
    }

    // Update movie properties
    Object.assign(movie, updateMovieDto);
    return this.movieRepository.save(movie);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.movieRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return { message: `Movie with ID ${id} has been successfully deleted` };
  }
}
