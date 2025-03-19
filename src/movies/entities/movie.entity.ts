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

  @Column('decimal', { precision: 2, scale: 1 })
  rating: number; // Rating out of 5

  @Column()
  release_year: number;

  @OneToMany(() => Showtime, showtime => showtime.movie)
  showtimes: Showtime[];
}
