import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  showtimeId: number;

  @IsNumber()
  seatNumber: number;

  @IsUUID('4')
  userId: string;
} 