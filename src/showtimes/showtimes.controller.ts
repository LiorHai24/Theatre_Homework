import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { CreateTheaterDto } from './dto/create-theater.dto';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }

  @Get('movie/:id')
  findByMovie(@Param('id') id: string) {
    return this.showtimesService.findByMovie(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShowtimeDto: UpdateShowtimeDto) {
    return this.showtimesService.update(+id, updateShowtimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showtimesService.remove(+id);
  }

  @Post('theater')
  createTheater(@Body() createTheaterDto: CreateTheaterDto) {
    return this.showtimesService.createTheater(createTheaterDto);
  }

  @Get('theater/all')
  getTheaters() {
    return this.showtimesService.getTheaters();
  }

  @Get('theater/:name')
  getTheaterByName(@Param('name') name: string) {
    return this.showtimesService.getTheaterByName(name);
  }
}
