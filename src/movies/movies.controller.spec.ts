import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

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
        genre: 'Action',
        duration: 120,
        rating: 4.5,
        release_year: 2024,
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
    it('should return a single movie', async () => {
      const expectedResult = { id: 1, title: 'Test Movie' };
      mockMoviesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(1);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Movie',
      };
      const expectedResult = { id: 1, ...updateMovieDto };
      mockMoviesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(1, updateMovieDto);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.update).toHaveBeenCalledWith(1, updateMovieDto);
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      const expectedResult = { message: 'Movie with ID 1 has been successfully deleted' };
      mockMoviesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(1);

      expect(result).toEqual(expectedResult);
      expect(mockMoviesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
