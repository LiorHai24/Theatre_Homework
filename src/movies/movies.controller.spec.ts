import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMoviesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Test Movie',
        duration: 120,
        genre: 'Action',
        release_year: 2024,
        rating: 8.5,
      };

      const expectedResult = { id: 1, ...createMovieDto };
      mockMoviesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createMovieDto);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const expectedResult = [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
      ];
      mockMoviesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      const expectedResult = { id: 1, title: 'Test Movie' };
      mockMoviesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw HttpException when movie is not found', async () => {
      mockMoviesService.findOne.mockRejectedValue(new HttpException('Movie not found', HttpStatus.NOT_FOUND));

      await expect(controller.findOne('1')).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a movie by title', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Movie',
        duration: 150,
        genre: 'Sci-Fi',
        release_year: 2025,
        rating: 9.0,
      };

      const expectedResult = { message: 'Movie "Test Movie" has been successfully updated' };
      mockMoviesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('Test Movie', updateMovieDto);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.update).toHaveBeenCalledWith('Test Movie', updateMovieDto);
    });

    it('should throw HttpException when update fails', async () => {
      mockMoviesService.update.mockRejectedValue(new HttpException('Update failed', HttpStatus.NOT_FOUND));

      await expect(controller.update('Test Movie', {})).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a movie by title', async () => {
      const expectedResult = { message: 'Movie "Test Movie" has been successfully deleted' };
      mockMoviesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('Test Movie');

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.remove).toHaveBeenCalledWith('Test Movie');
    });

    it('should throw HttpException when deletion fails', async () => {
      mockMoviesService.remove.mockRejectedValue(new HttpException('Deletion failed', HttpStatus.NOT_FOUND));

      await expect(controller.remove('Test Movie')).rejects.toThrow(HttpException);
    });
  });
});
