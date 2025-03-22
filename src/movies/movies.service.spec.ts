import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: Repository<Movie>;
  let showtimeRepository: Repository<Showtime>;

  const mockMovieRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockShowtimeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<MoviesService>(MoviesService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    showtimeRepository = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
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
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
      ];
      mockMovieRepository.find.mockResolvedValue(movies);

      const result = await service.findAll();

      expect(result).toEqual(movies);
      expect(mockMovieRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a movie', async () => {
      const movie = { id: 1, title: 'Test Movie' };
      mockMovieRepository.findOne.mockResolvedValue(movie);

      const result = await service.findOne(1);

      expect(result).toEqual(movie);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['showtimes'],
      });
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
        duration: 150,
      };

      const movie = { id: 1, title: 'Test Movie', duration: 120, showtimes: [] };
      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockMovieRepository.save.mockResolvedValue({ ...movie, ...updateMovieDto });

      const result = await service.update('Test Movie', updateMovieDto);

      expect(result).toEqual({ message: 'Movie Test Movie has been successfully updated' });
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { title: 'Test Movie' },
        relations: ['showtimes'],
      });
      expect(mockMovieRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when movie is not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.update('Non-existent Movie', {})).rejects.toThrow(NotFoundException);
    });

    it('should validate showtime durations when updating movie duration', async () => {
      const updateMovieDto: UpdateMovieDto = {
        duration: 150,
      };

      const movie = {
        id: 1,
        title: 'Test Movie',
        duration: 120,
        showtimes: [],
      };

      const showtimes = [
        {
          id: 1,
          start_time: new Date(),
          end_time: new Date(Date.now() + 120 * 60000), // 120 minutes
        },
      ];

      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockShowtimeRepository.find.mockResolvedValue(showtimes);

      await expect(service.update('Test Movie', updateMovieDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      const movie = { id: 1, title: 'Test Movie', showtimes: [] };
      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockMovieRepository.remove.mockResolvedValue(movie);

      const result = await service.remove('Test Movie');

      expect(result).toEqual({ message: 'Movie "Test Movie" has been successfully deleted' });
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { title: 'Test Movie' },
        relations: ['showtimes'],
      });
      expect(mockMovieRepository.remove).toHaveBeenCalledWith(movie);
    });

    it('should throw NotFoundException when movie is not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('Non-existent Movie')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when movie has showtimes', async () => {
      const movie = {
        id: 1,
        title: 'Test Movie',
        showtimes: [{ id: 1 }],
      };
      mockMovieRepository.findOne.mockResolvedValue(movie);

      await expect(service.remove('Test Movie')).rejects.toThrow(BadRequestException);
    });
  });
});
