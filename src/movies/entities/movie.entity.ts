import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column()
  duration: number; // Duration in minutes

  @Column({ type: 'float' })
  rating: number; // Rating out of 5

  @Column()
  releaseYear: number;

  @OneToMany(() => Showtime, showtime => showtime.movie)
  showtimes: Showtime[];
}
