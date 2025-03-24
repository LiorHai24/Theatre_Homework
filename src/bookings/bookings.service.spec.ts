import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepository: Repository<Booking>;
  let showtimeRepository: Repository<Showtime>;

  const mockShowtimeRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockBookingRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockCreateBookingDto = {
    showtimeId: 1,
    seatNumber: 1,
    userId: '123e4567-e89b-12d3-a456-426614174000',
  };

  beforeEach(async () => {
    jest.clearAllMocks();  // ✅ Clears previous calls
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockShowtimeRepository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    showtimeRepository = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 1,
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const showtime = {
        id: 1,
        availableSeats: 100,
        theater: { capacity: 100 },
        bookings: [],
      };

      const booking = {
        id: 'd1a6423b-4469-4b00-8c5f-e3cfc42eacae',
        ...createBookingDto,
        showtime,
      };

      mockShowtimeRepository.findOne.mockResolvedValue(showtime);
      mockBookingRepository.findOne.mockResolvedValue(null);
      mockBookingRepository.create.mockReturnValue(booking);
      mockBookingRepository.save.mockResolvedValue(booking);

      const result = await service.create(createBookingDto);

      expect(result).toEqual({ bookingId: booking.id });
      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: createBookingDto.showtimeId },
        relations: ['theater', 'bookings'],
      });
      expect(mockBookingRepository.findOne).toHaveBeenCalledWith({
        where: {
          showtime: { id: createBookingDto.showtimeId },
          seatNumber: createBookingDto.seatNumber,
        },
        relations: ['showtime'],
      });
      expect(mockBookingRepository.create).toHaveBeenCalledWith({
        id: expect.any(String),
        seatNumber: createBookingDto.seatNumber,
        userId: createBookingDto.userId,
        showtime: showtime
      });
      expect(mockBookingRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when showtime is not found', async () => {
      mockShowtimeRepository.findOne.mockResolvedValue(null);

      await expect(service.create(mockCreateBookingDto)).rejects.toThrow(NotFoundException);
  
      expect(mockBookingRepository.create).not.toHaveBeenCalled();
      expect(mockBookingRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when seat is already booked', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 1,
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const showtime = {
        id: 1,
        theater: { capacity: 100 },
        availableSeats: 100,
      };

      const existingBooking = {
        id: 'existing-booking-id',
        seatNumber: 1,
      };

      mockShowtimeRepository.findOne.mockResolvedValue(showtime);
      mockBookingRepository.findOne.mockResolvedValue(existingBooking);

      await expect(service.create(createBookingDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when seat number exceeds theater capacity', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 101,
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const showtime = {
        id: 1,
        theater: { capacity: 100 },
      };

      mockShowtimeRepository.findOne.mockResolvedValue(showtime);
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createBookingDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when userId is not a valid UUID', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 1,
        userId: 'invalid-uuid',
      };

      const showtime = {
        id: 1,
        theater: { capacity: 100 },
        availableSeats: 100,
      };

      mockShowtimeRepository.findOne.mockResolvedValue(showtime);
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createBookingDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when attempting to book with no available seats', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 2,
        seatNumber: 1,
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const showtime = {
        id: 2,
        availableSeats: 0,
        theater: { capacity: 100 },
        bookings: Array(100).fill({}).map((_, index) => ({
          id: `booking${index + 1}`,
          seatNumber: index + 1,
          showtime: { id: 2 }
        }))
      };

      mockShowtimeRepository.findOne.mockResolvedValue(showtime);
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createBookingDto)).rejects.toThrow(BadRequestException);
      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: createBookingDto.showtimeId },
        relations: ['theater', 'bookings'],
      });
      expect(mockBookingRepository.findOne).not.toHaveBeenCalled();
      expect(mockBookingRepository.create).not.toHaveBeenCalled();
      expect(mockBookingRepository.save).not.toHaveBeenCalled();
      expect(mockShowtimeRepository.save).not.toHaveBeenCalled();
    });
  });
}); 