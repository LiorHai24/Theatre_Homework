import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { ShowtimesModule } from '../showtimes/showtimes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    ShowtimesModule
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
