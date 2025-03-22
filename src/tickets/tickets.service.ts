import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { BookTicketDto } from './dto/book-ticket.dto';
import { ShowtimesService } from '../showtimes/showtimes.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    private showtimesService: ShowtimesService,
  ) {}

  async bookTicket(bookTicketDto: BookTicketDto): Promise<Ticket> {
    // Find the showtime
    const showtime = await this.showtimeRepository.findOne({
      where: { id: bookTicketDto.showtime_id },
      relations: ['theater', 'tickets'],
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${bookTicketDto.showtime_id} not found`);
    }

    // Check if the seat is within theater bounds
    if (bookTicketDto.row_number > showtime.theater.rows) {
      throw new BadRequestException(`Row number ${bookTicketDto.row_number} is out of bounds. Theater has ${showtime.theater.rows} rows.`);
    }

    if (bookTicketDto.seat_number > showtime.theater.seatsPerRow) {
      throw new BadRequestException(`Seat number ${bookTicketDto.seat_number} is out of bounds. Theater has ${showtime.theater.seatsPerRow} seats per row.`);
    }

    // Check if the seat is already booked
    const existingTicket = await this.ticketRepository.findOne({
      where: {
        showtime: { id: showtime.id },
        row_number: bookTicketDto.row_number,
        seat_number: bookTicketDto.seat_number,
      },
    });

    if (existingTicket) {
      throw new BadRequestException(`Seat ${bookTicketDto.seat_number} in row ${bookTicketDto.row_number} is already booked for this showtime.`);
    }

    // Check if there are available seats
    if (showtime.availableSeats <= 0) {
      throw new BadRequestException('No available seats for this showtime.');
    }

    // Create new ticket
    const ticket = this.ticketRepository.create({
      ...bookTicketDto,
      showtime,
      price: showtime.price, // Ensure price is a number
    });

    // Update available seats
    await this.showtimesService.update(showtime.id, {
      availableSeats: showtime.availableSeats - 1,
    });

    return this.ticketRepository.save(ticket);
  }

  async getTicketsByShowtime(showtimeId: number): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { showtime: { id: showtimeId } },
      relations: ['showtime'],
    });
  }

  async getTicketsByCustomer(customerEmail: string): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { customer_email: customerEmail },
      relations: ['showtime', 'showtime.movie', 'showtime.theater'],
    });
  }

  async cancelTicket(ticketId: number): Promise<{ message: string }> {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['showtime'],
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    // Update available seats
    ticket.showtime.availableSeats += 1;
    await this.showtimeRepository.save(ticket.showtime);

    // Delete the ticket
    await this.ticketRepository.remove(ticket);

    return { message: `Ticket with ID ${ticketId} has been successfully cancelled` };
  }
} 