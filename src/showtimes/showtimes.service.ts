import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOperator, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Theater } from './entities/theater.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    const movie = await this.movieRepository.findOne({
      where: { id: createShowtimeDto.movieId },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${createShowtimeDto.movieId} not found`);
    }

    const theater = await this.theaterRepository.findOne({
      where: { name: createShowtimeDto.theater },
    });

    if (!theater) {
      throw new NotFoundException(`Theater "${createShowtimeDto.theater}" not found`);
    }

    const startTime = new Date(createShowtimeDto.startTime);
    const endTime = new Date(createShowtimeDto.endTime);

    // Calculate duration in minutes
    const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    
    // Check if duration matches movie duration (with 5 minutes tolerance)
    if (Math.abs(durationInMinutes - movie.duration) > 5) {
      throw new BadRequestException(
        `Showtime duration (${durationInMinutes} minutes) does not match movie duration (${movie.duration} minutes)`,
      );
    }

    // Check for overlapping showtimes in the same theater
    const overlappingShowtime = await this.showtimeRepository.findOne({
      where: [
        {
          theater: { name: createShowtimeDto.theater },
          start_time: Between(startTime, endTime),
        },
        {
          theater: { name: createShowtimeDto.theater },
          end_time: Between(startTime, endTime),
        },
      ],
    });

    if (overlappingShowtime) {
      throw new BadRequestException(
        `There is already a showtime scheduled in this theater during the specified time period`,
      );
    }

    const showtime = this.showtimeRepository.create({
      ...createShowtimeDto,
      start_time: startTime,
      end_time: endTime,
      movie,
      theater,
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

  async findOne(id: number): Promise<Showtime> {
    // Validate that id is a valid number
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid showtime ID');
    }

    const showtime = await this.showtimeRepository.findOne({
      where: { id },
      relations: ['movie', 'theater', 'bookings'],
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }

    return showtime;
  }

  async update(id: number, updateShowtimeDto: UpdateShowtimeDto): Promise<{message: string}> {
    const showtime = await this.showtimeRepository.findOne({
      where: { id },
      relations: ['movie', 'theater'],
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }

    if (updateShowtimeDto.movieId) {
      const movie = await this.movieRepository.findOne({
        where: { id: updateShowtimeDto.movieId },
      });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${updateShowtimeDto.movieId} not found`);
      }

      showtime.movie = movie;
    }

    if (updateShowtimeDto.theater) {
      const theater = await this.theaterRepository.findOne({
        where: { name: updateShowtimeDto.theater },
      });

      if (!theater) {
        throw new NotFoundException(`Theater with name ${updateShowtimeDto.theater} not found`);
      }

      showtime.theater = theater;
    }

    if (updateShowtimeDto.startTime) {
      showtime.start_time = new Date(updateShowtimeDto.startTime);
    }

    if (updateShowtimeDto.endTime) {
      showtime.end_time = new Date(updateShowtimeDto.endTime);
    }

    if (updateShowtimeDto.price) {
      showtime.price = updateShowtimeDto.price;
    }
    await this.showtimeRepository.save(showtime);
    return { message: `Showtime with ID ${id} has been successfully updated` };
  }

  async remove(id: number): Promise<{ message: string }> {
    const showtime = await this.showtimeRepository.findOne({
      where: { id },
      relations: ['bookings'],
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }

    // Delete all bookings associated with this showtime
    if (showtime.bookings && showtime.bookings.length > 0) {
      await this.bookingRepository.remove(showtime.bookings);
    }

    // Now delete the showtime
    await this.showtimeRepository.remove(showtime);
    return { message: `Showtime with ID ${id} has been successfully deleted` };
  }

  async createTheater(createTheaterDto: CreateTheaterDto): Promise<Theater> {
    const theater = this.theaterRepository.create({
      ...createTheaterDto,
      capacity: createTheaterDto.rows * createTheaterDto.seatsPerRow,
    });

    return this.theaterRepository.save(theater);
  }

  async getTheaters(): Promise<Theater[]> {
    try {
      return await this.theaterRepository.find();
    } catch (error) {
      throw new BadRequestException('Failed to fetch theaters');
    }
  }

  async getTheaterById(id: number): Promise<Theater> {
    const theater = await this.theaterRepository.findOne({
      where: { id },
    });

    if (!theater) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }

    return theater;
  }
}
