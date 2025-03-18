import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
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
}
