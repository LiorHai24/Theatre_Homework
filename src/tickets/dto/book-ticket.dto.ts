import { IsNumber, IsString, IsEmail, Min } from 'class-validator';

export class BookTicketDto {
  @IsNumber()
  @Min(1)
  showtime_id: number;

  @IsNumber()
  @Min(1)
  row_number: number;

  @IsNumber()
  @Min(1)
  seat_number: number;

  @IsString()
  customer_name: string;

  @IsEmail()
  customer_email: string;
} 