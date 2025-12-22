## About Me

Hi, I'm Lior, a 27-year-old software developer passionate about building scalable and efficient systems. I'm excited to share this project I worked on, which includes enhancements and hooks for AI agent testing to facilitate automated testing workflows. In addition, I've added linting descriptors to help identify and correct code quality issues.

# Popcorn Palace - Movie Theater Booking System

## Development Tools & Quality Assurance

### AI Agent Testing Hooks
This project includes hooks for AI agent testing that enable automated code review and testing workflows. These hooks allow AI agents to:
- Perform automated code quality checks
- Validate API endpoints and business logic
- Run comprehensive test suites
- Analyze code patterns and suggest improvements

### Linting Configuration
The project uses ESLint with Prettier for code formatting and quality assurance. The linting configuration helps maintain:
- Consistent code style across the codebase
- Early detection of potential bugs and code smells
- Adherence to TypeScript and NestJS best practices
- Automated formatting to reduce manual code review overhead

## Technical Stack

This project is built using modern web technologies and follows industry best practices for scalable backend development:

### Backend Framework
- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications. NestJS provides a modular architecture, dependency injection, and built-in support for TypeScript.

### Database & ORM
- **PostgreSQL**: A powerful, open-source relational database system used for persistent data storage. PostgreSQL provides ACID compliance, robust transaction support, and excellent performance for complex queries.
- **TypeORM**: An Object-Relational Mapping library that bridges TypeScript classes with database tables. TypeORM handles entity relationships, migrations, and provides type-safe database operations.

### Development Tools
- **TypeScript**: Provides static type checking and enhanced developer experience
- **Docker**: Containerization for consistent development and deployment environments
- **Jest**: Testing framework for unit and integration tests
- **ESLint & Prettier**: Code quality and formatting tools

### Architecture Decisions
The application follows a modular architecture pattern with clear separation of concerns:
- **Modules**: Each feature (movies, showtimes, bookings) is organized into its own NestJS module
- **Entities**: Database models are defined using TypeORM decorators for type safety
- **Services**: Business logic is encapsulated in service classes with dependency injection
- **Controllers**: HTTP endpoints are handled by controllers that delegate to services
- **DTOs**: Data Transfer Objects ensure request/response validation and type safety

## Overview
Popcorn Palace is a movie theater booking system that allows users to manage movies, showtimes, and bookings. The system supports creating and managing movies, theaters, showtimes, and handling bookings with seat validation. The system ensures that showtime durations match their corresponding movie durations and handles theater capacity management.

### Key Features

**Theater Management**
- Theaters are modeled as first-class objects with configurable capacity, rows, and seats per row
- Each theater receives a unique identifier upon creation
- Theater details can be viewed through dedicated API endpoints (see Theater API section below)

**Entity Modeling**
- Movies, theaters, and showtimes are implemented as distinct entities with clear relationships
- Showtime objects contain all necessary details including movie reference, theater assignment, pricing, and availability
- Entity relationships ensure data integrity and enable complex queries

**API Response Format**
- Update and delete operations return both HTTP status code 200 (success) and a descriptive message object
- This provides clear feedback about the operation result for better API consumer experience

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
  - **Response**: Success message object
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

#### Delete Booking
- **Endpoint**: `DELETE /bookings/{id}`
- **Description**: Cancels and deletes a booking by its UUID
- **Response**: Success message object
```json
{
  "message": "Booking with ID d1a6423b-4469-4b00-8c5f-e3cfc42eacae has been successfully deleted"
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
  userId: string;      // User identifier (must be valid UUID format)
  createdAt: Date;     // Timestamp when booking was created
  updatedAt: Date;     // Timestamp when booking was last updated
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

The API follows RESTful conventions for error responses. All errors return a JSON object with a consistent structure:

### HTTP Status Codes

- **400 Bad Request**: Invalid input data or validation failures
  - Example: Invalid seat number, missing required fields, invalid UUID format
  - Response format:
  ```json
  {
    "statusCode": 400,
    "message": ["Seat 150 is already booked for this showtime"],
    "error": "Bad Request"
  }
  ```

- **404 Not Found**: Resource not found
  - Example: Movie, showtime, or booking with specified ID does not exist
  - Response format:
  ```json
  {
    "statusCode": 404,
    "message": "Showtime with ID 999 not found",
    "error": "Not Found"
  }
  ```

- **409 Conflict**: Resource already exists or conflict with existing data
  - Example: Duplicate movie title, theater name already in use
  - Response format:
  ```json
  {
    "statusCode": 409,
    "message": "A movie with title \"The Matrix\" already exists",
    "error": "Conflict"
  }
  ```

- **500 Internal Server Error**: Unexpected server-side error
  - Example: Database connection issues, unexpected exceptions
  - Response format:
  ```json
  {
    "statusCode": 500,
    "message": "Internal server error",
    "error": "Internal Server Error"
  }
  ```

### Error Response Structure

All error responses follow this consistent format:
- `statusCode`: HTTP status code number
- `message`: String or array of strings describing the error
- `error`: Error type name

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
```

## Installation

```bash
# Clone the repository
$ git clone https://github.com/your-username/your-repo.git
$ cd your-repo

# Install dependencies
$ npm install

# Import the postgres image to Docker
$ docker pull postgres:latest

# Start PostgreSQL using docker-compose (as defined in compose.yml)
$ docker-compose up -d
```

## Running the App

```bash
# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Testing

```bash
# Unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov

# Stop the database container
$ docker-compose down