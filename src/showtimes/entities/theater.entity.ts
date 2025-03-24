import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Showtime } from './showtime.entity';

@Entity()
export class Theater {
  @PrimaryColumn()
  name: string;

  @Column()
  capacity: number;

  @Column()
  rows: number;

  @Column()
  seatsPerRow: number;

  @OneToMany(() => Showtime, (showtime) => showtime.theater)
  showtimes: Showtime[];
}