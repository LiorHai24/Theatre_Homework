import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: Repository<Movie>;
  let showtimeRepository: Repository<Showtime>;

  const mockMovieRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockShowtimeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockShowtimeRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<MoviesService>(MoviesService);
    movieRepository = moduleRef.get<Repository<Movie>>(getRepositoryToken(Movie));
    showtimeRepository = moduleRef.get<Repository<Showtime>>(getRepositoryToken(Showtime));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Test Movie',
        genre: 'Action',
        duration: 120,
        rating: 4.5,
        release_year: 2024,
      };

      const movie = { id: 1, ...createMovieDto };
      mockMovieRepository.create.mockReturnValue(movie);
      mockMovieRepository.save.mockResolvedValue(movie);

      const result = await service.create(createMovieDto);

      expect(result).toEqual(movie);
      expect(mockMovieRepository.create).toHaveBeenCalledWith(createMovieDto);
      expect(mockMovieRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const movies = [
        { id: 1, title: 'Movie 1', genre: 'Action', duration: 120, rating: 4.5, release_year: 2024 },
        { id: 2, title: 'Movie 2', genre: 'Comedy', duration: 90, rating: 4.0, release_year: 2023 },
      ];
      mockMovieRepository.find.mockResolvedValue(movies);

      const result = await service.findAll();

      expect(result).toEqual(movies);
      expect(mockMovieRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single movie', async () => {
      const movie = { id: 1, title: 'Test Movie', genre: 'Action', duration: 120, rating: 4.5, release_year: 2024 };
      mockMovieRepository.findOne.mockResolvedValue(movie);

      const result = await service.findOne(1);

      expect(result).toEqual(movie);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when movie is not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Movie',
        rating: 5.0,
      };

      const existingMovie = { id: 1, title: 'Original Movie', rating: 4.0, genre: 'Action', duration: 120, release_year: 2024 };
      const updatedMovie = { ...existingMovie, ...updateMovieDto };

      mockMovieRepository.findOne.mockResolvedValue(existingMovie);
      mockMovieRepository.save.mockResolvedValue(updatedMovie);

      const result = await service.update(1, updateMovieDto);

      expect(result).toEqual(updatedMovie);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockMovieRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating non-existent movie', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { title: 'Updated Movie' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a movie and return success message', async () => {
      const movie = { id: 1, title: 'Test Movie', genre: 'Action', duration: 120, rating: 4.5, release_year: 2024 };
      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockMovieRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Movie with ID 1 has been successfully deleted' });
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockMovieRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when deleting non-existent movie', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);
      mockMovieRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
