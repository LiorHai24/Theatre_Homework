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
    findByMovie: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createTheater: jest.fn(),
    getTheaters: jest.fn(),
    getTheaterByName: jest.fn(),
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
        price: 20.2,
        theater: 'Sample Theater',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      const expectedResult = { id: 1, ...createShowtimeDto };
      mockShowtimesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createShowtimeDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createShowtimeDto);
    });
  });

  describe('findByMovie', () => {
    it('should return showtimes for a movie', async () => {
      const expectedResult = [
        { id: 1, movieId: 1 },
        { id: 2, movieId: 1 },
      ];
      mockShowtimesService.findByMovie.mockResolvedValue(expectedResult);

      const result = await controller.findByMovie('1');

      expect(result).toEqual(expectedResult);
      expect(service.findByMovie).toHaveBeenCalledWith(1);
    });
  });

  describe('findOne', () => {
    it('should return a showtime', async () => {
      const expectedResult = { id: 1 };
      mockShowtimesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a showtime', async () => {
      const updateShowtimeDto: UpdateShowtimeDto = {
        price: 25.2,
        theater: 'New Theater',
      };

      const expectedResult = { message: 'Showtime with ID 1 has been successfully updated' };
      mockShowtimesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateShowtimeDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateShowtimeDto);
    });
  });

  describe('remove', () => {
    it('should remove a showtime', async () => {
      const expectedResult = { message: 'Showtime with ID 1 has been successfully deleted' };
      mockShowtimesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('1');

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('createTheater', () => {
    it('should create a theater', async () => {
      const createTheaterDto: CreateTheaterDto = {
        name: 'New Theater',
        rows: 10,
        seatsPerRow: 15,
      };

      const expectedResult = { ...createTheaterDto, capacity: 150 };
      mockShowtimesService.createTheater.mockResolvedValue(expectedResult);

      const result = await controller.createTheater(createTheaterDto);

      expect(result).toEqual(expectedResult);
      expect(service.createTheater).toHaveBeenCalledWith(createTheaterDto);
    });
  });

  describe('getTheaters', () => {
    it('should return all theaters', async () => {
      const expectedResult = [
        { name: 'Theater 1', capacity: 100 },
        { name: 'Theater 2', capacity: 150 },
      ];
      mockShowtimesService.getTheaters.mockResolvedValue(expectedResult);

      const result = await controller.getTheaters();

      expect(result).toEqual(expectedResult);
      expect(service.getTheaters).toHaveBeenCalled();
    });
  });

  describe('getTheaterByName', () => {
    it('should return a theater by name', async () => {
      const expectedResult = { name: 'Sample Theater', capacity: 150 };
      mockShowtimesService.getTheaterByName.mockResolvedValue(expectedResult);

      const result = await controller.getTheaterByName('Sample Theater');

      expect(result).toEqual(expectedResult);
      expect(service.getTheaterByName).toHaveBeenCalledWith('Sample Theater');
    });
  });
});
