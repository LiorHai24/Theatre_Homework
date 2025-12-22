## About Me

Hi, I'm Lior, a 27-year-old software developer passionate about building scalable and efficient systems. I'm excited to share this project I worked on, which includes enhancements and hooks for AI agent testing to facilitate automated testing workflows. In addition, added linting descriptor to find my mistakes.

# Popcorn Palace - Movie Theater Booking System

## Overview
Popcorn Palace is a movie theater booking system that allows users to manage movies, showtimes, and bookings. The system supports creating and managing movies, theaters, showtimes, and handling bookings with seat validation. The system ensures that showtime durations match their corresponding movie durations and handles theater capacity management.

I took it to my own personal direction with adding a theater as an object(you can see the api in this file for creation and view of the existing theaters)with number of rows, seats per row, and total capacity, getting a unique id upon creation.
I believed it would be more realistic to have objects in the code, also implemented movies and showtime, so for a showtime object you can see all the neccessary details.
Moreover, for updating and deletion, in addition to the status code 200 of success, there is also a matching message.

## API Endpoints

### Movies
- **Create Movie**
  - **Endpoint**: `POST /movies`
  - **Request Body**:
    ```json
    {
      "title": "The Matrix",
      "genre": "Action",
      "duration": 120,
      "rating": 8.5,
      "release_year": 2024
    }
    ```
  - **Response**: Created movie object

- **Get All Movies**
  - **Endpoint**: `GET /movies/all`
  - **Response**: Array of movie objects

- **Get Movie by ID**
  - **Endpoint**: `GET /movies/{id}`
  - **Response**: Movie object

- **Update Movie**
  - **Endpoint**: `POST /movies/update/{movieTitle}`
  - **Request Body**: Partial movie object
  - **Response**: Success message object
    ```json
    {
      "message": "Movie \"The Matrix\" has been successfully updated"
    }
    ```

- **Delete Movie**
  - **Endpoint**: `DELETE /movies/{movieTitle}`
  - **Response**: Success message object
    ```json
    {
      "message": "Movie \"The Matrix\" has been successfully deleted"
    }
    ```

### Theater
- **Create Theater**
  - **Endpoint**: `POST /showtimes/theater`
  - **Request Body**:
    ```json
    {
      "name": "Theater 1",
      "capacity": 100,
      "rows": 10,
      "seatsPerRow": 10
    }
    ```
  - **Response**: Created theater object

- **Get All Theaters**
  - **Endpoint**: `GET /showtimes/theater/all`
  - **Response**: Array of theater objects

- **Get Theater by Name**
  - **Endpoint**: `GET /showtimes/theater/{theaterName}`
  - **Response**: Theater object

### Showtimes
- **Create Showtime**
  - **Endpoint**: `POST /showtimes`
  - **Request Body**:
    ```json
    {
      "movie": 1,
      "theater": "Theater 1",
      "start_time": "2024-03-20T14:00:00",
      "end_time": "2024-03-20T16:00:00",
      "price": 12.99
    }
    ```
  - **Response**: Created showtime object

- **Get Showtime by ID**
  - **Endpoint**: `GET /showtimes/{id}`
  - **Response**: Showtime object

- **Get Showtimes by Movie**
  - **Endpoint**: `GET /showtimes/movie/{id}`
  - **Response**: Array of showtime objects

- **Update Showtime**
  - **Endpoint**: `POST /showtimes/update/{id}`
  - **Request Body**: Partial showtime object
  - **Response**: Success message objectf
    ```json
    {
      "message": "Showtime with ID 1 has been successfully updated"
    }
    ```

- **Delete Showtime**
  - **Endpoint**: `DELETE /showtimes/{id}`
  - **Response**: Success message object
    ```json
    {
      "message": "Showtime with ID 1 has been successfully deleted"
    }
    ```

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
  id: number;          // Primary key
  title: string;       // Used for update/delete operations
  genre: string;       // Movie genre
  duration: number;    // Duration in minutes
  rating: number;      // Movie rating
  release_year: number; // Year of release
}
```

### Theater
```typescript
{
  name: string;        // Primary key
  rows: number;        // Number of rows in the theater
  seatsPerRow: number; // Number of seats per row
  capacity: number;    // Automatically calculated as rows * seatsPerRow
}
```

### Showtime
```typescript
{
  id: number;          // Primary key
  movie: Movie;        // Reference to Movie entity
  theater: Theater;    // Reference to Theater entity
  start_time: Date;    // Showtime start
  end_time: Date;      // Must match movie duration (within 5 minutes tolerance)
  price: number;       // Ticket price
  availableSeats: number; // Number of available seats
}
```

### Booking
```typescript
{
  id: string;          // UUID primary key
  showtime: Showtime;  // Reference to Showtime entity
  seatNumber: number;  // Selected seat number
  userId: string;      // User identifier
  bookingTime: Date;   // Time of booking
}
```

## Validation Rules

1. Showtime Duration:
   - The duration between start_time and end_time must match the movie's duration
   - A 5-minute tolerance is allowed for small discrepancies
   - If the duration doesn't match, a BadRequestException is thrown

2. Theater Capacity:
   - Theater capacity is automatically calculated as rows * seatsPerRow
   - Showtimes cannot be created if the theater has no available seats
   - Available seats are tracked per showtime

3. Theater Names:
   - Theater names must be unique
   - Theater names are used as primary keys
   - Theater names are case-sensitive

4. Showtime Overlap:
   - No overlapping showtimes are allowed in the same theater
   - A BadRequestException is thrown if there's an overlap

5. Seat Validation:
   - Seat numbers must be valid for the theater's capacity
   - No duplicate bookings for the same seat in a showtime
   - Available seats count is updated when bookings are made

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