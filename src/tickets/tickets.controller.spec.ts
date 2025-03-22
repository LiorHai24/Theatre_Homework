import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { BookTicketDto } from './dto/book-ticket.dto';

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: TicketsService;

  const mockTicketsService = {
    bookTicket: jest.fn(),
    getTicketsByShowtime: jest.fn(),
    getTicketsByCustomer: jest.fn(),
    cancelTicket: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('bookTicket', () => {
    it('should book tickets successfully', async () => {
      const bookTicketDto: BookTicketDto = {
        showtime_id: 1,
        row_number: 5,
        seat_number: 10,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
      };
      const expectedResult = {
        id: 1,
        showtime_id: 1,
        row_number: 5,
        seat_number: 10,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
      };
      mockTicketsService.bookTicket.mockResolvedValue(expectedResult);

      const result = await controller.bookTicket(bookTicketDto);

      expect(result).toEqual(expectedResult);
      expect(mockTicketsService.bookTicket).toHaveBeenCalledWith(bookTicketDto);
    });
  });

  describe('getTicketsByShowtime', () => {
    it('should return tickets for a specific showtime', async () => {
      const expectedResult = [
        { id: 1, showtime_id: 1, row_number: 5, seat_number: 10 },
        { id: 2, showtime_id: 1, row_number: 5, seat_number: 11 },
      ];
      mockTicketsService.getTicketsByShowtime.mockResolvedValue(expectedResult);

      const result = await controller.getTicketsByShowtime('1');

      expect(result).toEqual(expectedResult);
      expect(mockTicketsService.getTicketsByShowtime).toHaveBeenCalledWith(1);
    });
  });

  describe('getTicketsByCustomer', () => {
    it('should return tickets for a specific customer', async () => {
      const expectedResult = [
        { id: 1, customer_email: 'john@example.com' },
        { id: 2, customer_email: 'john@example.com' },
      ];
      mockTicketsService.getTicketsByCustomer.mockResolvedValue(expectedResult);

      const result = await controller.getTicketsByCustomer('john@example.com');

      expect(result).toEqual(expectedResult);
      expect(mockTicketsService.getTicketsByCustomer).toHaveBeenCalledWith('john@example.com');
    });
  });

  describe('cancelTicket', () => {
    it('should cancel a ticket', async () => {
      const expectedResult = { message: 'Ticket with ID 1 has been successfully cancelled' };
      mockTicketsService.cancelTicket.mockResolvedValue(expectedResult);

      const result = await controller.cancelTicket('1');

      expect(result).toEqual(expectedResult);
      expect(mockTicketsService.cancelTicket).toHaveBeenCalledWith(1);
    });
  });
}); 