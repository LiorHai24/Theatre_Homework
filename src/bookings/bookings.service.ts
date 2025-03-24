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
    console.log('Creating booking with data:', createBookingDto);
  
    // First check if showtime exists
    const showtime = await this.showtimeRepository.findOne({
      where: { id: createBookingDto.showtimeId },
      relations: ['theater', 'bookings'],  // Load bookings relation
    });
  
    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${createBookingDto.showtimeId} not found`);
    }
  
    // Log the bookings array (if any bookings exist for the showtime)
    console.log('Bookings for this showtime:', showtime.bookings);
    
    // Optionally log details of each booking
    if (showtime.bookings && showtime.bookings.length > 0) {
      showtime.bookings.forEach((booking, index) => {
        console.log(`Booking #${index + 1}:`, {
          id: booking.id,
          seatNumber: booking.seatNumber,
          userId: booking.userId,
          showtime: booking.showtime?.id,
        });
      });
    } else {
      console.log('No bookings found for this showtime.');
    }
  
    // Validate userId exists and is valid
    if (!isUuid(createBookingDto.userId)) {
      throw new BadRequestException('Invalid userId format');
    }
  
    // Check if seat number is within valid range
    if (createBookingDto.seatNumber < 1 || createBookingDto.seatNumber > showtime.theater.capacity) {
      throw new BadRequestException(`Invalid seat number. Theater capacity is ${showtime.theater.capacity}`);
    }
  
    // Check if there are any available seats
    if (showtime.availableSeats <= 0) {
      throw new BadRequestException('No available seats for this showtime');
    }
  
    // Check if the seat is already booked
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        showtime: { id: createBookingDto.showtimeId },
        seatNumber: createBookingDto.seatNumber,
      },
      relations: ['showtime'],
    });
  
    console.log('Checking for existing booking:', {
      showtimeId: createBookingDto.showtimeId,
      seatNumber: createBookingDto.seatNumber,
      existingBooking: existingBooking ? {
        id: existingBooking.id,
        seatNumber: existingBooking.seatNumber,
        userId: existingBooking.userId
      } : null
    });

    if (existingBooking) {
      throw new BadRequestException(`Seat ${createBookingDto.seatNumber} is already booked for this showtime`);
    }

    // Create and save booking
    const booking = this.bookingRepository.create({
      id: uuidv4(),
      seatNumber: createBookingDto.seatNumber,
      userId: createBookingDto.userId,
      showtime: showtime
    });
  
    console.log('Created booking object:', {
      booking
    });
    
    try {
      const savedBooking = await this.bookingRepository.save(booking);
      console.log('Successfully saved booking to database:', {
        id: savedBooking.id,
        seatNumber: savedBooking.seatNumber,
        userId: savedBooking.userId,
        showtime: savedBooking.showtime?.id
      });
      const newBooking = await this.bookingRepository.findOne({
        where: {
          id: booking.id
        }
      });
      console.log('New booking object:', newBooking);

      // Update available seats
      showtime.availableSeats -= 1;
      showtime.bookings.push(savedBooking);
      await this.showtimeRepository.save(showtime);
      console.log('Updated showtime available seats:', showtime.availableSeats);
    
      return { bookingId: savedBooking.id };
    } catch (error) {
      console.error('Error saving booking:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['showtime'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Increment available seats before removing the booking
    booking.showtime.availableSeats += 1;
    await this.showtimeRepository.save(booking.showtime);
    
    await this.bookingRepository.remove(booking);
    return { message: `Booking with ID ${id} has been successfully deleted` };
  }
}