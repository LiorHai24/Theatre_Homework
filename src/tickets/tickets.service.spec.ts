import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { BookTicketDto } from './dto/book-ticket.dto';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ShowtimesService } from '../showtimes/showtimes.service';

describe('TicketsService', () => {
  let service: TicketsService;
  let ticketRepository: Repository<Ticket>;
  let showtimeRepository: Repository<Showtime>;
  let showtimesService: ShowtimesService;

  const mockTicketRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  const mockShowtimeRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockShowtimesService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: mockTicketRepository,
        },
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockShowtimeRepository,
        },
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    ticketRepository = module.get<Repository<Ticket>>(getRepositoryToken(Ticket));
    showtimeRepository = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
    showtimesService = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('bookTicket', () => {
    const mockShowtime = {
      id: 1,
      movie: { id: 1, title: 'Test Movie' },
      theater: { id: 1, capacity: 150, rows: 10, seatsPerRow: 15 },
      start_time: new Date('2024-03-20T18:00:00.000Z'),
      end_time: new Date('2024-03-20T20:16:00.000Z'),
      price: 12.99,
      availableSeats: 100,
    };

    const mockTicket = {
      id: 1,
      showtime: mockShowtime,
      row_number: 5,
      seat_number: 10,
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      price: 12.99,
    };

    const bookTicketDto: BookTicketDto = {
      showtime_id: 1,
      row_number: 5,
      seat_number: 10,
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
    };

    it('should book a ticket successfully', async () => {
      mockShowtimeRepository.findOne.mockResolvedValue(mockShowtime);
      mockTicketRepository.create.mockReturnValue(mockTicket);
      mockTicketRepository.save.mockResolvedValue(mockTicket);
      mockShowtimesService.update.mockResolvedValue({
        ...mockShowtime,
        availableSeats: 99,
      });

      const result = await service.bookTicket(bookTicketDto);

      expect(result).toBeDefined();
      expect(result.showtime.id).toBe(1);
      expect(result.row_number).toBe(5);
      expect(result.seat_number).toBe(10);
      expect(mockShowtimesService.update).toHaveBeenCalledWith(1, {
        availableSeats: 99,
      });
    });

    it('should throw NotFoundException when showtime is not found', async () => {
      mockShowtimeRepository.findOne.mockResolvedValue(null);

      await expect(service.bookTicket(bookTicketDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when seat is already booked', async () => {
      mockShowtimeRepository.findOne.mockResolvedValue(mockShowtime);
      mockTicketRepository.findOne.mockResolvedValue(mockTicket);

      await expect(service.bookTicket(bookTicketDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTicketsByShowtime', () => {
    const mockShowtime = { id: 1 };
    const mockTickets = [
      { id: 1, showtime: mockShowtime, row_number: 5, seat_number: 10 },
      { id: 2, showtime: mockShowtime, row_number: 5, seat_number: 11 },
    ];

    it('should return tickets for a specific showtime', async () => {
      mockTicketRepository.find.mockResolvedValue(mockTickets);

      const result = await service.getTicketsByShowtime(1);

      expect(result).toEqual(mockTickets);
      expect(mockTicketRepository.find).toHaveBeenCalledWith({
        where: { showtime: { id: 1 } },
        relations: ['showtime'],
      });
    });
  });

  describe('getTicketsByCustomer', () => {
    const mockTickets = [
      { id: 1, customer_email: 'john@example.com' },
      { id: 2, customer_email: 'john@example.com' },
    ];

    it('should return tickets for a specific customer', async () => {
      mockTicketRepository.find.mockResolvedValue(mockTickets);

      const result = await service.getTicketsByCustomer('john@example.com');

      expect(result).toEqual(mockTickets);
      expect(mockTicketRepository.find).toHaveBeenCalledWith({
        where: { customer_email: 'john@example.com' },
        relations: ['showtime', 'showtime.movie', 'showtime.theater'],
      });
    });
  });

  describe('cancelTicket', () => {
    const mockShowtime = { id: 1, availableSeats: 98 };
    const mockTicket = {
      id: 1,
      showtime: mockShowtime,
    };

    it('should cancel a ticket and update showtime seats', async () => {
      mockTicketRepository.findOne.mockResolvedValue(mockTicket);
      mockTicketRepository.remove.mockResolvedValue(mockTicket);
      mockShowtimeRepository.save.mockResolvedValue({
        ...mockShowtime,
        availableSeats: 99,
      });

      const result = await service.cancelTicket(1);

      expect(result).toEqual({ message: 'Ticket with ID 1 has been successfully cancelled' });
      expect(mockShowtimeRepository.save).toHaveBeenCalledWith({
        ...mockShowtime,
        availableSeats: 99,
      });
    });

    it('should throw NotFoundException when ticket is not found', async () => {
      mockTicketRepository.findOne.mockResolvedValue(null);

      await expect(service.cancelTicket(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 