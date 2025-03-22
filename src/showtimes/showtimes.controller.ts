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
  findByMovie(@Param('movieId') movieId: string): Promise<Showtime[]> {
    return this.showtimesService.findByMovie(+movieId);
  }

  @Get('theaters')
  getTheaters(): Promise<Theater[]> {
    return this.showtimesService.getTheaters();
  }

  @Get('theaters/:id')
  getTheaterById(@Param('id') id: string): Promise<Theater> {
    return this.showtimesService.getTheaterById(+id);
  }

  @Post('theaters')
  createTheater(@Body() createTheaterDto: CreateTheaterDto): Promise<Theater> {
    return this.showtimesService.createTheater(createTheaterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Showtime> {
    return this.showtimesService.findOne(+id);
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateShowtimeDto: UpdateShowtimeDto): Promise<Showtime> {
    return this.showtimesService.update(+id, updateShowtimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.showtimesService.remove(+id);
  }
}
