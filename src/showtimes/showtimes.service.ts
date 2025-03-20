import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Between, Not } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Theater } from './entities/theater.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { CreateTheaterDto } from './dto/create-theater.dto';

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
    const movie = await this.movieRepository.findOne({ where: { id: createShowtimeDto.movie } });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${createShowtimeDto.movie} not found`);
    }

    const theater = await this.theaterRepository.findOne({ where: { id: createShowtimeDto.theater } });
    if (!theater) {
      throw new NotFoundException(`Theater with ID ${createShowtimeDto.theater} not found`);
    }

    // Check for overlapping showtimes in the same theater
    const overlappingShowtime = await this.showtimeRepository.findOne({
      where: [
        {
          theater: { id: createShowtimeDto.theater },
          start_time: createShowtimeDto.start_time,
        },
        {
          theater: { id: createShowtimeDto.theater },
          end_time: createShowtimeDto.end_time,
        },
      ],
    });

    if (overlappingShowtime) {
      throw new BadRequestException('There is already a showtime scheduled for this time in this theater');
    }

    const showtime = this.showtimeRepository.create({
      movie,
      theater,
      start_time: createShowtimeDto.start_time,
      end_time: createShowtimeDto.end_time,
      price: createShowtimeDto.price,
      availableSeats: theater.capacity,
    });

    return this.showtimeRepository.save(showtime);
  }

  async findByMovie(movieId: number): Promise<Showtime[]> {
    return this.showtimeRepository.find({
      where: { movie: { id: movieId } },
      relations: ['theater'],
    });
  }

  async findUpcoming(): Promise<Showtime[]> {
    const now = new Date();
    return this.showtimeRepository.find({
      where: { start_time: now },
      relations: ['movie', 'theater'],
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

  async update(id: number, updateShowtimeDto: Partial<CreateShowtimeDto>): Promise<Showtime> {
    const showtime = await this.findOne(id);

    if (updateShowtimeDto.theater && updateShowtimeDto.theater !== showtime.theater.id) {
      const newTheater = await this.theaterRepository.findOne({ where: { id: updateShowtimeDto.theater } });
      if (!newTheater) {
        throw new NotFoundException(`Theater with ID ${updateShowtimeDto.theater} not found`);
      }

      // Check for overlapping showtimes in the new theater
      const overlappingShowtime = await this.showtimeRepository.findOne({
        where: [
          {
            theater: { id: updateShowtimeDto.theater },
            start_time: updateShowtimeDto.start_time || showtime.start_time,
          },
          {
            theater: { id: updateShowtimeDto.theater },
            end_time: updateShowtimeDto.end_time || showtime.end_time,
          },
        ],
      });

      if (overlappingShowtime) {
        throw new BadRequestException('There is already a showtime scheduled for this time in this theater');
      }
    }

    if (updateShowtimeDto.movie) {
      const movie = await this.movieRepository.findOne({ where: { id: updateShowtimeDto.movie } });
      if (!movie) {
        throw new NotFoundException(`Movie with ID ${updateShowtimeDto.movie} not found`);
      }
      showtime.movie = movie;
    }

    if (updateShowtimeDto.theater) {
      const theater = await this.theaterRepository.findOne({ where: { id: updateShowtimeDto.theater } });
      if (!theater) {
        throw new NotFoundException(`Theater with ID ${updateShowtimeDto.theater} not found`);
      }
      showtime.theater = theater;
    }

    if (updateShowtimeDto.start_time) {
      showtime.start_time = updateShowtimeDto.start_time;
    }

    if (updateShowtimeDto.end_time) {
      showtime.end_time = updateShowtimeDto.end_time;
    }

    if (updateShowtimeDto.price) {
      showtime.price = updateShowtimeDto.price;
    }

    return this.showtimeRepository.save(showtime);
  }

  async remove(id: number): Promise<void> {
    const result = await this.showtimeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }
  }

  async createTheater(createTheaterDto: CreateTheaterDto): Promise<Theater> {
    const capacity = createTheaterDto.rows * createTheaterDto.seatsPerRow;
    const theater = this.theaterRepository.create({
      ...createTheaterDto,
      capacity,
    });
    return this.theaterRepository.save(theater);
  }

  async getTheaters(): Promise<Theater[]> {
    return this.theaterRepository.find();
  }

  async getTheaterById(id: number): Promise<Theater> {
    const theater = await this.theaterRepository.findOne({ where: { id } });
    if (!theater) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }
    return theater;
  }
}
