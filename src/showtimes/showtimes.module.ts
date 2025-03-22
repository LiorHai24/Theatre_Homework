import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './entities/showtime.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Theater } from './entities/theater.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime, Movie, Theater, Booking])],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  exports: [ShowtimesService, TypeOrmModule],
})
export class ShowtimesModule {}
