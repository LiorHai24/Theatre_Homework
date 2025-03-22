import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './entities/showtime.entity';
import { Theater } from './entities/theater.entity';
import { Movie } from '../movies/entities/movie.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let showtimeRepository: Repository<Showtime>;
  let theaterRepository: Repository<Theater>;
  let movieRepository: Repository<Movie>;

  const mockShowtimeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockTheaterRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockMovieRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockShowtimeRepository,
        },
        {
          provide: getRepositoryToken(Theater),
          useValue: mockTheaterRepository,
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<ShowtimesService>(ShowtimesService);
    showtimeRepository = moduleRef.get<Repository<Showtime>>(getRepositoryToken(Showtime));
    theaterRepository = moduleRef.get<Repository<Theater>>(getRepositoryToken(Theater));
    movieRepository = moduleRef.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new showtime', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movie: 1,
        theater: 1,
        start_time: new Date('2024-03-20T18:00:00.000Z'),
        end_time: new Date('2024-03-20T20:16:00.000Z'),
        price: 12.99,
      };

      const movie = { id: 1, duration: 136 };
      const theater = { id: 1, capacity: 150, rows: 10, seatsPerRow: 15 };
      const showtime = { 
        id: 1, 
        ...createShowtimeDto, 
        theater,
        movie,
        availableSeats: theater.capacity 
      };

      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockTheaterRepository.findOne.mockResolvedValue(theater);
      mockShowtimeRepository.findOne.mockResolvedValue(null);
      mockShowtimeRepository.create.mockReturnValue(showtime);
      mockShowtimeRepository.save.mockResolvedValue(showtime);

      const result = await service.create(createShowtimeDto);

      expect(result).toEqual(showtime);
      expect(mockMovieRepository.findOne).toHaveBeenCalledWith({ where: { id: createShowtimeDto.movie } });
      expect(mockTheaterRepository.findOne).toHaveBeenCalledWith({ where: { id: createShowtimeDto.theater } });
      expect(mockShowtimeRepository.create).toHaveBeenCalledWith({
        ...createShowtimeDto,
        movie,
        theater,
        availableSeats: theater.capacity,
      });
      expect(mockShowtimeRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when movie is not found', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movie: 1,
        theater: 1,
        start_time: new Date('2024-03-20T18:00:00.000Z'),
        end_time: new Date('2024-03-20T20:16:00.000Z'),
        price: 12.99,
      };

      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createShowtimeDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when theater is not found', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movie: 1,
        theater: 1,
        start_time: new Date('2024-03-20T18:00:00.000Z'),
        end_time: new Date('2024-03-20T20:16:00.000Z'),
        price: 12.99,
      };

      const movie = { id: 1, duration: 136 };
      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockTheaterRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createShowtimeDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when duration does not match movie duration', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movie: 1,
        theater: 1,
        start_time: new Date('2024-03-20T18:00:00.000Z'),
        end_time: new Date('2024-03-20T20:00:00.000Z'),
        price: 12.99,
      };

      const movie = { id: 1, duration: 136 };
      const theater = { id: 1, capacity: 150, rows: 10, seatsPerRow: 15 };

      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockTheaterRepository.findOne.mockResolvedValue(theater);

      await expect(service.create(createShowtimeDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when there are overlapping showtimes', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movie: 1,
        theater: 1,
        start_time: new Date('2024-03-20T18:00:00.000Z'),
        end_time: new Date('2024-03-20T20:16:00.000Z'),
        price: 12.99,
      };

      const movie = { id: 1, duration: 136 };
      const theater = { id: 1, capacity: 150, rows: 10, seatsPerRow: 15 };
      const existingShowtime = {
        id: 1,
        start_time: new Date('2024-03-20T17:00:00.000Z'),
        end_time: new Date('2024-03-20T19:00:00.000Z'),
      };

      mockMovieRepository.findOne.mockResolvedValue(movie);
      mockTheaterRepository.findOne.mockResolvedValue(theater);
      mockShowtimeRepository.findOne.mockResolvedValue(existingShowtime);

      await expect(service.create(createShowtimeDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByMovie', () => {
    it('should return showtimes for a specific movie', async () => {
      const showtimes = [
        {
          id: 1,
          movie: 1,
          theater: 1,
          start_time: new Date('2024-03-20T18:00:00.000Z'),
          end_time: new Date('2024-03-20T20:16:00.000Z'),
          price: 12.99,
          availableSeats: 150,
        },
      ];
      mockShowtimeRepository.find.mockResolvedValue(showtimes);

      const result = await service.findByMovie(1);

      expect(result).toEqual(showtimes);
      expect(mockShowtimeRepository.find).toHaveBeenCalledWith({
        where: { movie: { id: 1 } },
        relations: ['theater'],
      });
    });
  });

  describe('findUpcoming', () => {
    it('should return upcoming showtimes', async () => {
      const showtimes = [
        {
          id: 1,
          movie: 1,
          theater: 1,
          start_time: new Date('2024-03-20T18:00:00.000Z'),
          end_time: new Date('2024-03-20T20:16:00.000Z'),
          price: 12.99,
          availableSeats: 150,
        },
      ];
      mockShowtimeRepository.find.mockResolvedValue(showtimes);

      const result = await service.findUpcoming();

      expect(result).toEqual(showtimes);
      expect(mockShowtimeRepository.find).toHaveBeenCalledWith({
        where: { start_time: expect.any(Date) },
        relations: ['movie', 'theater'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single showtime', async () => {
      const showtime = {
        id: 1,
        movie: 1,
        theater: 1,
        start_time: new Date('2024-03-20T18:00:00.000Z'),
        end_time: new Date('2024-03-20T20:16:00.000Z'),
        price: 12.99,
        availableSeats: 150,
      };
      mockShowtimeRepository.findOne.mockResolvedValue(showtime);

      const result = await service.findOne(1);

      expect(result).toEqual(showtime);
      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['movie', 'theater'],
      });
    });

    it('should throw NotFoundException when showtime is not found', async () => {
      mockShowtimeRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a showtime', async () => {
      const updateShowtimeDto: UpdateShowtimeDto = {
        price: 14.99,
      };

      const existingShowtime = {
        id: 1,
        movie: { id: 1, duration: 136 },
        theater: { id: 1 },
        start_time: new Date('2024-03-20T18:00:00.000Z'),
        end_time: new Date('2024-03-20T20:16:00.000Z'),
        price: 12.99,
        availableSeats: 150,
      };
      const updatedShowtime = { ...existingShowtime, ...updateShowtimeDto };

      mockShowtimeRepository.findOne.mockResolvedValue(existingShowtime);
      mockShowtimeRepository.save.mockResolvedValue(updatedShowtime);

      const result = await service.update(1, updateShowtimeDto);

      expect(result).toEqual(updatedShowtime);
      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['movie', 'theater'],
      });
      expect(mockShowtimeRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating non-existent showtime', async () => {
      mockShowtimeRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { price: 14.99 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a showtime and return success message', async () => {
      const showtime = {
        id: 1,
        movie: 1,
        theater: 1,
        start_time: new Date('2024-03-20T18:00:00.000Z'),
        end_time: new Date('2024-03-20T20:16:00.000Z'),
        price: 12.99,
        availableSeats: 150,
      };
      mockShowtimeRepository.findOne.mockResolvedValue(showtime);
      mockShowtimeRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Showtime with ID 1 has been successfully deleted' });
      expect(mockShowtimeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['movie', 'theater']
      });
      expect(mockShowtimeRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when deleting non-existent showtime', async () => {
      mockShowtimeRepository.findOne.mockResolvedValue(null);
      mockShowtimeRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Theater Operations', () => {
    describe('createTheater', () => {
      it('should create a new theater', async () => {
        const createTheaterDto: CreateTheaterDto = {
          rows: 10,
          seatsPerRow: 15,
        };

        const theater = { id: 1, ...createTheaterDto, capacity: 150 };
        mockTheaterRepository.create.mockReturnValue(theater);
        mockTheaterRepository.save.mockResolvedValue(theater);

        const result = await service.createTheater(createTheaterDto);

        expect(result).toEqual(theater);
        expect(mockTheaterRepository.create).toHaveBeenCalledWith({
          ...createTheaterDto,
          capacity: 150,
        });
        expect(mockTheaterRepository.save).toHaveBeenCalled();
      });
    });

    describe('getTheaters', () => {
      it('should return an array of theaters', async () => {
        const theaters = [
          { id: 1, capacity: 150, rows: 10, seatsPerRow: 15 },
          { id: 2, capacity: 200, rows: 12, seatsPerRow: 17 },
        ];
        mockTheaterRepository.find.mockResolvedValue(theaters);

        const result = await service.getTheaters();

        expect(result).toEqual(theaters);
        expect(mockTheaterRepository.find).toHaveBeenCalled();
      });
    });

    describe('getTheaterById', () => {
      it('should return a single theater', async () => {
        const theater = { id: 1, capacity: 150, rows: 10, seatsPerRow: 15 };
        mockTheaterRepository.findOne.mockResolvedValue(theater);

        const result = await service.getTheaterById(1);

        expect(result).toEqual(theater);
        expect(mockTheaterRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      });

      it('should throw NotFoundException when theater is not found', async () => {
        mockTheaterRepository.findOne.mockResolvedValue(null);

        await expect(service.getTheaterById(1)).rejects.toThrow(NotFoundException);
      });
    });
  });
});
