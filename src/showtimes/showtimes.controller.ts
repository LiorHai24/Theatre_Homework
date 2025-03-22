import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { Showtime } from './entities/showtime.entity';
import { Theater } from './entities/theater.entity';

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

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<Showtime> {
    try {
      return await this.showtimesService.update(+id, updateShowtimeDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to update showtime',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  @Delete(':id')
  remove(@Param('id') id: number): Promise<{ message: string }> {
    return this.showtimesService.remove(+id);
  }

  @Post('theater')
  createTheater(@Body() createTheaterDto: CreateTheaterDto): Promise<Theater> {
    return this.showtimesService.createTheater(createTheaterDto);
  }

  @Get('theaters')
  getTheaters(): Promise<Theater[]> {
    return this.showtimesService.getTheaters();
  }

  @Get('theater/:id')
  getTheaterById(@Param('id') id: string): Promise<Theater> {
    return this.showtimesService.getTheaterById(+id);
  }
}
