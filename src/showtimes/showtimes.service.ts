import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Between, Not } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Theater } from './entities/theater.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    const [movie, theater] = await Promise.all([
      this.movieRepository.findOne({
        where: { id: createShowtimeDto.movieId },
      }),
      this.theaterRepository.findOne({
        where: { id: createShowtimeDto.theaterId },
      }),
    ]);

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${createShowtimeDto.movieId} not found`);
    }

    if (!theater) {
      throw new NotFoundException(`Theater with ID ${createShowtimeDto.theaterId} not found`);
    }

    // Check for overlapping showtimes in the same theater
    const overlappingShowtime = await this.showtimeRepository.findOne({
      where: {
        theater: { id: theater.id },
        startTime: Between(createShowtimeDto.startTime, createShowtimeDto.endTime),
      },
    });

    if (overlappingShowtime) {
      throw new BadRequestException('There is already a showtime scheduled for this theater during this time period');
    }

    const showtime = this.showtimeRepository.create({
      ...createShowtimeDto,
      movie,
      theater,
    });

    return this.showtimeRepository.save(showtime);
  }

  async findByMovie(movieId: number): Promise<Showtime[]> {
    return this.showtimeRepository.find({
      where: { movie: { id: movieId } },
      relations: ['movie', 'theater'],
    });
  }

  async findUpcoming(): Promise<Showtime[]> {
    const now = new Date();
    return this.showtimeRepository.find({
      where: { startTime: MoreThan(now) },
      relations: ['movie', 'theater'],
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Showtime> {
    const showtime = await this.showtimeRepository.findOne({
      where: { id },
      relations: ['movie', 'theater'],
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }

    return showtime;
  }

  async update(id: number, updateData: Partial<CreateShowtimeDto>): Promise<Showtime> {
    const showtime = await this.findOne(id);

    if (updateData.theaterId) {
      const theater = await this.theaterRepository.findOne({
        where: { id: updateData.theaterId },
      });

      if (!theater) {
        throw new NotFoundException(`Theater with ID ${updateData.theaterId} not found`);
      }

      // Check for overlapping showtimes in the new theater
      const overlappingShowtime = await this.showtimeRepository.findOne({
        where: {
          theater: { id: theater.id },
          startTime: Between(updateData.startTime || showtime.startTime, updateData.endTime || showtime.endTime),
          id: Not(id), // Exclude current showtime
        },
      });

      if (overlappingShowtime) {
        throw new BadRequestException('There is already a showtime scheduled for this theater during this time period');
      }

      showtime.theater = theater;
    }

    Object.assign(showtime, updateData);
    return this.showtimeRepository.save(showtime);
  }

  async remove(id: number): Promise<void> {
    const result = await this.showtimeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }
  }
}
