import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { v4 as uuidv4 } from 'uuid';
import { validate as isUuid } from 'uuid';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<{ bookingId: string }> {
    // First check if showtime exists
    const showtime = await this.showtimeRepository.findOne({
      where: { id: createBookingDto.showtimeId },
      relations: ['theater', 'bookings'],
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${createBookingDto.showtimeId} not found`);
    }

    // Validate userId exists and is valid
    try {
      //const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!isUuid(createBookingDto.userId)) {
        throw new BadRequestException('Invalid userId format');
      }
    } catch (error) {
      throw new BadRequestException('Invalid userId format');
    }

    // Check if seat is already booked
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        showtime: { id: createBookingDto.showtimeId },
        seatNumber: createBookingDto.seatNumber,
      },
    });

    if (existingBooking) {
      throw new BadRequestException(`Seat ${createBookingDto.seatNumber} is already booked for this showtime`);
    }

    // Check if seat number is valid
    if (createBookingDto.seatNumber < 1 || createBookingDto.seatNumber > showtime.theater.capacity) {
      throw new BadRequestException(`Invalid seat number. Theater capacity is ${showtime.theater.capacity}`);
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      id: uuidv4(),
      showtime,
    });

    await this.bookingRepository.save(booking);

    return { bookingId: booking.id };
  }

  async remove(id: string): Promise<{ message: string }> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    await this.bookingRepository.remove(booking);
    return { message: `Booking with ID ${id} has been successfully deleted` };
  }
} 