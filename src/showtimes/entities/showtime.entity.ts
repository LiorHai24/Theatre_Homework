import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Theater } from './theater.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, movie => movie.showtimes)
  movie: Movie;

  @ManyToOne(() => Theater, theater => theater.showtimes)
  theater: Theater;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  availableSeats: number;
} 