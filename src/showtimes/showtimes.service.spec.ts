import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './entities/showtime.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Theater } from './entities/theater.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { Booking } from '../bookings/entities/booking.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let showtimeRepository: Repository<Showtime>;
  let movieRepository: Repository<Movie>;
  let theaterRepository: Repository<Theater>;
  let bookingRepository: Repository<Booking>;

  const mockShowtimeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  const mockMovieRepository = {
    findOne: jest.fn(),
  };

  const mockTheaterRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockBookingRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockShowtimeRepository,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
        {
          provide: getRepositoryToken(Theater),
          useValue: mockTheaterRepository,
        },
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    showtimeRepository = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    theaterRepository = module.get<Repository<Theater>>(getRepositoryToken(Theater));
    bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      const movie = { id: 1, duration: 180 };
      const theater = { id: 1, name: 'Sample Theater', capacity: 150 };
      const showtime = { id: 1, ...createShowtimeDto, movie, theater };

      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockTheaterRepository.findOne.mockResolvedValue(theater);
      mockShowtimeRepository.create.mockReturnValue(showtime);
      mockShowtimeRepository.save.mockResolvedValue(showtime);

      const result = await service.create(createShowtimeDto);

      expect(result).toEqual(showtime);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { id: createShowtimeDto.movieId },
      });
      expect(mockTheaterRepository.findOne).toHaveBeenCalledWith({
        where: { name: createShowtimeDto.theater },
      });
      expect(mockShowtimeRepository.create).toHaveBeenCalled();
      expect(mockShowtimeRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when movie is not found', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        price: 20.2,
        theater: 'Sample Theater',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createShowtimeDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when theater is not found', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        price: 20.2,
        theater: 'Sample Theater',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      const movie = { id: 1, duration: 180 };
      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockTheaterRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createShowtimeDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when duration does not match movie duration', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        price: 20.2,
        theater: 'Sample Theater',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      const movie = { id: 1, duration: 120 };
      const theater = { id: 1, name: 'Sample Theater', capacity: 150 };
      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockTheaterRepository.findOne.mockResolvedValue(theater);

      await expect(service.create(createShowtimeDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByMovie', () => {
    it('should return showtimes for a movie', async () => {
      const showtimes = [
        { id: 1, movie: { id: 1 } },
        { id: 2, movie: { id: 1 } },
      ];
      mockShowtimeRepository.find.mockResolvedValue(showtimes);

      const result = await service.findByMovie(1);

      expect(result).toEqual(showtimes);
      expect(mockShowtimeRepository.find).toHaveBeenCalledWith({
        where: { movie: { id: 1 } },
        relations: ['theater'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a showtime', async () => {
      const showtime = { id: 1 };
      mockShowtimeRepository.findOne.mockResolvedValue(showtime);

      const result = await service.findOne(1);

      expect(result).toEqual(showtime);
      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['movie', 'theater', 'bookings'],
      });
    });

    it('should throw NotFoundException when showtime is not found', async () => {
      mockShowtimeRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a showtime', async () => {
      const updateShowtimeDto: UpdateShowtimeDto = {
        movieId: 2,
        price: 25.2,
        theater: 'New Theater',
        startTime: '2025-02-14T12:47:46.125405Z',
        endTime: '2025-02-14T15:47:46.125405Z',
      };

      const existingShowtime = {
        id: 1,
        movie: { id: 1, duration: 180 },
        theater: { id: 1, name: 'Old Theater' },
      };
      const movie = { id: 2, duration: 180 };
      const theater = { id: 2, name: 'New Theater' };

      mockShowtimeRepository.findOne.mockResolvedValue(existingShowtime);
      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockTheaterRepository.findOne.mockResolvedValue(theater);
      mockShowtimeRepository.save.mockResolvedValue({ ...existingShowtime, ...updateShowtimeDto, movie, theater });

      const result = await service.update(1, updateShowtimeDto);

      expect(result).toEqual({ message: 'Showtime with ID 1 has been successfully updated' });
      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['movie', 'theater'],
      });
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { id: updateShowtimeDto.movieId },
      });
      expect(mockTheaterRepository.findOne).toHaveBeenCalledWith({
        where: { name: updateShowtimeDto.theater },
      });
      expect(mockShowtimeRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when showtime is not found', async () => {
      mockShowtimeRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a showtime and its bookings', async () => {
      const showtime = {
        id: 1,
        bookings: [
          { id: 'booking1' },
          { id: 'booking2' }
        ]
      };

      mockShowtimeRepository.findOne.mockResolvedValue(showtime);
      mockBookingRepository.remove.mockResolvedValue(showtime.bookings);
      mockShowtimeRepository.remove.mockResolvedValue(showtime);

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Showtime with ID 1 has been successfully deleted' });
      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['bookings'],
      });
      expect(mockBookingRepository.remove).toHaveBeenCalledWith(showtime.bookings);
      expect(mockShowtimeRepository.remove).toHaveBeenCalledWith(showtime);
    });

    it('should remove a showtime without bookings', async () => {
      const showtime = {
        id: 1,
        bookings: []
      };

      mockShowtimeRepository.findOne.mockResolvedValue(showtime);
      mockShowtimeRepository.remove.mockResolvedValue(showtime);

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Showtime with ID 1 has been successfully deleted' });
      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['bookings'],
      });
      expect(mockBookingRepository.remove).not.toHaveBeenCalled();
      expect(mockShowtimeRepository.remove).toHaveBeenCalledWith(showtime);
    });

    it('should throw NotFoundException when showtime is not found', async () => {
      mockShowtimeRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(mockBookingRepository.remove).not.toHaveBeenCalled();
      expect(mockShowtimeRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('booking validation', () => {
    it('should throw BadRequestException when attempting to book a showtime with no available seats', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        price: 20.2,
        theater: 'Sample Theater',
        startTime: '2025-02-14T11:47:46.125405Z',
        endTime: '2025-02-14T14:47:46.125405Z',
      };

      const movie = { id: 1, duration: 180 };
      const theater = { id: 1, name: 'Sample Theater', capacity: 100 };
      const showtime = {
        id: 1,
        availableSeats: 0,
        theater,
        movie,
        bookings: Array(100).fill({}).map((_, index) => ({
          id: `booking${index + 1}`,
          seatNumber: index + 1
        }))
      };

      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockTheaterRepository.findOne.mockResolvedValue(theater);
      mockShowtimeRepository.findOne.mockResolvedValue(showtime);

      await expect(service.create(createShowtimeDto)).rejects.toThrow(BadRequestException);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({
        where: { id: createShowtimeDto.movieId },
      });
      expect(mockTheaterRepository.findOne).toHaveBeenCalledWith({
        where: { name: createShowtimeDto.theater },
      });
      expect(mockShowtimeRepository.findOne).toHaveBeenCalled();
      expect(mockShowtimeRepository.create).not.toHaveBeenCalled();
      expect(mockShowtimeRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('createTheater', () => {
    it('should create a theater', async () => {
      const createTheaterDto: CreateTheaterDto = {
        name: 'Sample Theater',
        rows: 10,
        seatsPerRow: 15,
      };

      const theater = { id: 1, ...createTheaterDto, capacity: 150 };
      mockTheaterRepository.create.mockReturnValue(theater);
      mockTheaterRepository.save.mockResolvedValue(theater);

      const result = await service.createTheater(createTheaterDto);

      expect(result).toEqual(theater);
      expect(mockTheaterRepository.create).toHaveBeenCalledWith({
        ...createTheaterDto,
        capacity: 150,
      });
      expect(mockTheaterRepository.save).toHaveBeenCalled();
    });
  });

  describe('getTheaters', () => {
    it('should return all theaters', async () => {
      const theaters = [
        { id: 1, name: 'Theater 1' },
        { id: 2, name: 'Theater 2' },
      ];
      mockTheaterRepository.find.mockResolvedValue(theaters);

      const result = await service.getTheaters();

      expect(result).toEqual(theaters);
      expect(mockTheaterRepository.find).toHaveBeenCalled();
    });
  });

  describe('getTheaterById', () => {
    it('should return a theater', async () => {
      const theater = { id: 1, name: 'Sample Theater' };
      mockTheaterRepository.findOne.mockResolvedValue(theater);

      const result = await service.getTheaterById(1);

      expect(result).toEqual(theater);
      expect(mockTheaterRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when theater is not found', async () => {
      mockTheaterRepository.findOne.mockResolvedValue(null);

      await expect(service.getTheaterById(1)).rejects.toThrow(NotFoundException);
    });
  });
});
