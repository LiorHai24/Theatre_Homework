import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { CreateTheaterDto } from './dto/create-theater.dto';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let service: ShowtimesService;

  const mockShowtimesService = {
    create: jest.fn(),
    findUpcoming: jest.fn(),
    findByMovie: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createTheater: jest.fn(),
    getTheaters: jest.fn(),
    getTheaterById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    service = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a showtime', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        theater: 'Theater 1',
        startTime: '2024-03-20T18:00:00.000Z',
        endTime: '2024-03-20T20:16:00.000Z',
        price: 12.99,
      };
      const expectedResult = { id: 1, ...createShowtimeDto };
      mockShowtimesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createShowtimeDto);

      expect(result).toEqual(expectedResult);
      expect(mockShowtimesService.create).toHaveBeenCalledWith(createShowtimeDto);
    });
  });


  describe('findByMovie', () => {
    it('should return showtimes for a specific movie', async () => {
      const expectedResult = [
        { id: 1, movie: 1, theater: 1 },
        { id: 2, movie: 1, theater: 2 },
      ];
      mockShowtimesService.findByMovie.mockResolvedValue(expectedResult);

      const result = await controller.findByMovie('1');

      expect(result).toEqual(expectedResult);
      expect(mockShowtimesService.findByMovie).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a single showtime', async () => {
      const expectedResult = { id: 1, movie: 1, theater: 1 };
      mockShowtimesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedResult);
      expect(mockShowtimesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a showtime', async () => {
      const updateShowtimeDto: UpdateShowtimeDto = {
        price: 14.99,
      };
      const expectedResult = { id: 1, ...updateShowtimeDto };
      mockShowtimesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateShowtimeDto);

      expect(result).toEqual(expectedResult);
      expect(mockShowtimesService.update).toHaveBeenCalledWith(1, updateShowtimeDto);
    });
  });

  describe('remove', () => {
    it('should remove a showtime', async () => {
      const expectedResult = { message: 'Showtime with ID 1 has been successfully deleted' };
      mockShowtimesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('1');

      expect(result).toEqual(expectedResult);
      expect(mockShowtimesService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('createTheater', () => {
    it('should create a theater', async () => {
      const createTheaterDto: CreateTheaterDto = {
        name: 'Theater 1',
        rows: 10,
        seatsPerRow: 15,
      };
      const expectedResult = { id: 1, ...createTheaterDto, capacity: 150 };
      mockShowtimesService.createTheater.mockResolvedValue(expectedResult);

      const result = await controller.createTheater(createTheaterDto);

      expect(result).toEqual(expectedResult);
      expect(mockShowtimesService.createTheater).toHaveBeenCalledWith(createTheaterDto);
    });
  });

  describe('getTheaters', () => {
    it('should return all theaters', async () => {
      const expectedResult = [
        { id: 1, rows: 10, seatsPerRow: 15 },
        { id: 2, rows: 8, seatsPerRow: 12 },
      ];
      mockShowtimesService.getTheaters.mockResolvedValue(expectedResult);

      const result = await controller.getTheaters();

      expect(result).toEqual(expectedResult);
      expect(mockShowtimesService.getTheaters).toHaveBeenCalled();
    });
  });

  describe('getTheaterById', () => {
    it('should return a single theater', async () => {
      const expectedResult = { id: 1, rows: 10, seatsPerRow: 15 };
      mockShowtimesService.getTheaterById.mockResolvedValue(expectedResult);

      const result = await controller.getTheaterById('1');

      expect(result).toEqual(expectedResult);
      expect(mockShowtimesService.getTheaterById).toHaveBeenCalledWith(1);
    });
  });
});
