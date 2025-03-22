import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Showtime } from './showtime.entity';

@Entity()
export class Theater {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column()
  rows: number;

  @Column()
  seatsPerRow: number;

  @OneToMany(() => Showtime, showtime => showtime.theater)
  showtimes: Showtime[];
}