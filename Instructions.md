# Popcorn Palace - Movie Theater Booking System

## Overview
Popcorn Palace is a movie theater booking system that allows users to manage movies, showtimes, and bookings. The system supports creating and managing movies, theaters, showtimes, and handling bookings with seat validation.

## API Endpoints

### Movies

#### Get All Movies
- **Endpoint**: `GET /movies/all`
- **Description**: Retrieves all movies in the system
- **Response**: Array of movie objects
```json
[
  {
    "id": 1,
    "title": "Sample Movie",
    "genre": "Action",
    "duration": 120,
    "rating": 8.5,
    "release_year": 2024
  }
]
```

#### Add Movie
- **Endpoint**: `POST /movies`
- **Description**: Adds a new movie to the system
- **Request Body**:
```json
{
  "title": "Sample Movie",
  "genre": "Action",
  "duration": 120,
  "rating": 8.5,
  "release_year": 2024
}
```
- **Response**: Created movie object

#### Update Movie
- **Endpoint**: `POST /movies/update/{movieTitle}`
- **Description**: Updates an existing movie by title
- **Request Body**:
```json
{
  "title": "Updated Movie Title",
  "genre": "Action",
  "duration": 120,
  "rating": 8.5,
  "release_year": 2024
}
```
- **Response**: Updated movie object

#### Delete Movie
- **Endpoint**: `DELETE /movies/{movieTitle}`
- **Description**: Deletes a movie by title
- **Response**: Success message

### Theaters

#### Create Theater
- **Endpoint**: `POST /showtimes/theaters`
- **Description**: Creates a new theater
- **Request Body**:
```json
{
  "name": "Sample Theater",
  "rows": 10,
  "seatsPerRow": 15
}
```
- **Response**: Created theater object

#### Get All Theaters
- **Endpoint**: `GET /showtimes/theaters`
- **Description**: Retrieves all theaters
- **Response**: Array of theater objects
```json
[
  {
    "id": 1,
    "name": "Sample Theater",
    "rows": 10,
    "seatsPerRow": 15,
    "capacity": 150
  }
]
```

#### Get Theater by ID
- **Endpoint**: `GET /showtimes/theaters/{id}`
- **Description**: Retrieves a specific theater by ID
- **Response**: Theater object

### Showtimes

#### Get Showtime by ID
- **Endpoint**: `GET /showtimes/{id}`
- **Description**: Retrieves a specific showtime by ID
- **Response**: Showtime object with movie and theater details

#### Add Showtime
- **Endpoint**: `POST /showtimes`
- **Description**: Creates a new showtime
- **Request Body**:
```json
{
  "movieId": 1,
  "price": 20.2,
  "theater": "Sample Theater",
  "startTime": "2024-02-14T11:47:46.125405Z",
  "endTime": "2024-02-14T13:47:46.125405Z"
}
```
- **Response**: Created showtime object

#### Update Showtime
- **Endpoint**: `POST /showtimes/update/{id}`
- **Description**: Updates an existing showtime
- **Request Body**:
```json
{
  "movieId": 1,
  "price": 20.2,
  "theater": "Sample Theater",
  "startTime": "2024-02-14T11:47:46.125405Z",
  "endTime": "2024-02-14T13:47:46.125405Z"
}
```
- **Response**: Updated showtime object

#### Delete Showtime
- **Endpoint**: `DELETE /showtimes/{id}`
- **Description**: Deletes a showtime by ID
- **Response**: Success message

### Bookings

#### Create Booking
- **Endpoint**: `POST /bookings`
- **Description**: Creates a new booking for a showtime
- **Request Body**:
```json
{
  "showtimeId": 1,
  "seatNumber": 15,
  "userId": "84438967-f68f-4fa0-b620-0f08217e76af"
}
```
- **Response**: Booking ID
```json
{
  "bookingId": "d1a6423b-4469-4b00-8c5f-e3cfc42eacae"
}
```

## Data Models

### Movie
```typescript
{
  id: number;
  title: string;
  genre: string;
  duration: number;
  rating: number;
  release_year: number;
}
```

### Theater
```typescript
{
  id: number;
  name: string;
  rows: number;
  seatsPerRow: number;
  capacity: number;
}
```

### Showtime
```typescript
{
  id: number;
  movie: Movie;
  theater: Theater;
  start_time: Date;
  end_time: Date;
  price: number;
  availableSeats: number;
}
```

### Booking
```typescript
{
  id: string; // UUID
  showtime: Showtime;
  seatNumber: number;
  userId: string; // UUID
}
```

## Validation Rules
1. Movie duration must match showtime duration (within 5 minutes tolerance)
2. Showtimes cannot overlap in the same theater
3. Seat numbers must be valid (between 1 and theater capacity)
4. Seats cannot be double-booked
5. User IDs must be valid UUIDs
6. Theater names must be unique
7. Movie titles must be unique

## Error Handling
- 400 Bad Request: Invalid input data
- 404 Not Found: Resource not found
- 409 Conflict: Resource already exists or conflict with existing data
- 500 Internal Server Error: Server-side error

## Testing
The system includes comprehensive tests for all endpoints and business logic. Tests cover:
- Successful operations
- Error cases
- Validation rules
- Edge cases
- Data integrity


## Prerequisites

Make sure you have the following installed on your system before proceeding:

- [Node.js (LTS version)](https://nodejs.org/) (includes npm)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop) (for running PostgreSQL locally)

Verify installation:

```bash
# Check Node.js and npm versions
$ node -v
$ npm -v

# Check Docker version (if using Docker)
$ docker --version
$ docker-compose --version

## Installation
# Clone the repository
$ git clone https://github.com/your-username/your-repo.git
$ cd your-repo

# Install dependencies
$ npm install

#import the postgres image to docker
$ docker pull postgres:latest
# Start PostgreSQL using docker-compose (as defined in compose.yml)

$ docker-compose up -d

##Running the app
# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod

##Test

# Unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov

# Stop the database container
$ docker-compose down