import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { Showtime } from './entities/showtime.entity';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  create(@Body() createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    return this.showtimesService.create(createShowtimeDto);
  }

  @Get('movie/:movieId')
  findByMovie(@Param('movieId') movieId: number): Promise<Showtime[]> {
    return this.showtimesService.findByMovie(+movieId);
  }

  @Get('upcoming')
  findUpcoming(): Promise<Showtime[]> {
    return this.showtimesService.findUpcoming();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Showtime> {
    return this.showtimesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateData: Partial<CreateShowtimeDto>,
  ): Promise<Showtime> {
    return this.showtimesService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.showtimesService.remove(+id);
  }
}
