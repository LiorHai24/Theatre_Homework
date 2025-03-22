import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { BookTicketDto } from './dto/book-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('book')
  bookTicket(@Body() bookTicketDto: BookTicketDto) {
    return this.ticketsService.bookTicket(bookTicketDto);
  }

  @Get('showtime/:showtimeId')
  getTicketsByShowtime(@Param('showtimeId') showtimeId: string) {
    return this.ticketsService.getTicketsByShowtime(+showtimeId);
  }

  @Get('customer/:email')
  getTicketsByCustomer(@Param('email') email: string) {
    return this.ticketsService.getTicketsByCustomer(email);
  }

  @Delete(':id')
  cancelTicket(@Param('id') id: string) {
    return this.ticketsService.cancelTicket(+id);
  }
} 