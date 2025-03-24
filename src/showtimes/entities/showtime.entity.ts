import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Theater } from './theater.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  availableSeats: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column()
  movieId: number;

  @ManyToOne(() => Theater, (theater) => theater.showtimes)
  @JoinColumn({ name: 'theaterName' })
  theater: Theater;

  @Column()
  theaterName: string;

  @OneToMany(() => Booking, (booking) => booking.showtime, { cascade: true })
  bookings: Booking[];
} 