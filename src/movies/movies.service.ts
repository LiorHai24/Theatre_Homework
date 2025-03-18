import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { Theater } from '../showtimes/entities/theater.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }

  findAll(): Promise<Movie[]> {
    return this.movieRepository.find({
      relations: ['showtimes'],
    });
  }

  findOne(id: number): Promise<Movie | null> {
    return this.movieRepository.findOne({
      where: { id },
      relations: ['showtimes'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.movieRepository.delete(id);
  }

  // Theater operations
  async createTheater(name: string, capacity: number): Promise<Theater> {
    const theater = this.theaterRepository.create({ name, capacity });
    return this.theaterRepository.save(theater);
  }

  async getTheaters(): Promise<Theater[]> {
    return this.theaterRepository.find({
      relations: ['showtimes'],
    });
  }

  async getTheaterById(id: number): Promise<Theater> {
    const theater = await this.theaterRepository.findOne({
      where: { id },
      relations: ['showtimes'],
    });

    if (!theater) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }

    return theater;
  }
}
