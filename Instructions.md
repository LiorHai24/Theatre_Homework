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

#### Theater Management
- Theaters are modeled as first-class objects with configurable capacity, rows, and seats per row
- Each theater receives a unique identifier upon creation
- Theater details can be viewed through dedicated API endpoints (see Theater API section below)

#### Entity Modeling
- Movies, theaters, and showtimes are implemented as distinct entities with clear relationships
- Showtime objects contain all necessary details including movie reference, theater assignment, pricing, and availability
- Entity relationships ensure data integrity and enable complex queries

#### API Response Format
- Update and delete operations return both HTTP status code 200 (success) and a descriptive message object
- This provides clear feedback about the operation result for better API consumer experience

## API Endpoints

> **API Version**: v1.0  
> **Base URL**: `http://localhost:3000` (development)  
> All endpoints return JSON responses. Error responses follow the standard error format documented in the Error Handling section.

### Movies

#### Create Movie
- **Endpoint**: `POST /movies`
- **Description**: Creates a new movie entry. Movie titles must be unique.
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
- **Response** (200 OK): Created movie object with auto-generated ID
    ```json
    {
      "id": 1,
      "title": "The Matrix",
      "genre": "Action",
      "duration": 120,
      "rating": 8.5,
      "release_year": 2024,
      "showtimes": []
    }
    ```
- **Error Responses**:
  - `409 Conflict`: Movie with the same title already exists
  - `400 Bad Request`: Invalid input data or missing required fields

#### Get All Movies
- **Endpoint**: `GET /movies/all`
- **Description**: Retrieves all movies in the system.
- **Response** (200 OK): Array of movie objects
    ```json
    [
      {
        "id": 1,
        "title": "The Matrix",
        "genre": "Action",
        "duration": 120,
        "rating": 8.5,
        "release_year": 2024
      }
    ]
    ```
- **Error Responses**:
  - `500 Internal Server Error`: Database connection issues

#### Get Movie by ID
- **Endpoint**: `GET /movies/{id}`
- **Description**: Retrieves a specific movie by its ID, including associated showtimes.
- **Path Parameters**:
  - `id` (number): The unique identifier of the movie
- **Response** (200 OK): Movie object with showtimes relation
    ```json
    {
      "id": 1,
      "title": "The Matrix",
      "genre": "Action",
      "duration": 120,
      "rating": 8.5,
      "release_year": 2024,
      "showtimes": []
    }
    ```
- **Error Responses**:
  - `404 Not Found`: Movie with the specified ID does not exist
  - `400 Bad Request`: Invalid ID format

#### Update Movie
- **Endpoint**: `POST /movies/update/{movieTitle}`
- **Description**: Updates an existing movie identified by title. Cannot update title if movie has existing showtimes with mismatched duration.
- **Path Parameters**:
  - `movieTitle` (string): The title of the movie to update
- **Request Body**: Partial movie object (all fields optional)
    ```json
    {
      "genre": "Sci-Fi",
      "rating": 9.0
    }
    ```
- **Response** (200 OK): Success message object
    ```json
    {
      "message": "Movie \"The Matrix\" has been successfully updated"
    }
    ```
- **Error Responses**:
  - `404 Not Found`: Movie with the specified title does not exist
  - `409 Conflict`: New title conflicts with an existing movie
  - `400 Bad Request`: Invalid input data or duration mismatch with existing showtimes

#### Delete Movie
- **Endpoint**: `DELETE /movies/{movieTitle}`
- **Description**: Deletes a movie by title. Cannot delete movies with existing showtimes.
- **Path Parameters**:
  - `movieTitle` (string): The title of the movie to delete
- **Response** (200 OK): Success message object
    ```json
    {
      "message": "Movie \"The Matrix\" has been successfully deleted"
    }
    ```
- **Error Responses**:
  - `404 Not Found`: Movie with the specified title does not exist
  - `400 Bad Request`: Movie cannot be deleted because it has existing showtimes

### Theater

#### Create Theater
- **Endpoint**: `POST /showtimes/theater`
- **Description**: Creates a new theater with specified capacity, rows, and seats per row. Theater names must be unique.
- **Request Body**:
    ```json
    {
      "name": "Theater 1",
      "capacity": 100,
      "rows": 10,
      "seatsPerRow": 10
    }
    ```
- **Response** (200 OK): Created theater object with capacity automatically calculated
    ```json
    {
      "name": "Theater 1",
      "capacity": 100,
      "rows": 10,
      "seatsPerRow": 10
    }
    ```
- **Validation**:
  - Theater name must be unique
  - Capacity must equal rows × seatsPerRow
  - All fields are required
- **Error Responses**:
  - `409 Conflict`: Theater with the same name already exists
  - `400 Bad Request`: Invalid input data, missing required fields, or capacity mismatch

#### Get All Theaters
- **Endpoint**: `GET /showtimes/theater/all`
- **Description**: Retrieves all theaters in the system.
- **Response** (200 OK): Array of theater objects
    ```json
    [
      {
        "name": "Theater 1",
        "capacity": 100,
        "rows": 10,
        "seatsPerRow": 10
      }
    ]
    ```
- **Error Responses**:
  - `500 Internal Server Error`: Database connection issues

#### Get Theater by Name
- **Endpoint**: `GET /showtimes/theater/{theaterName}`
- **Description**: Retrieves a specific theater by its name (case-sensitive).
- **Path Parameters**:
  - `theaterName` (string): The name of the theater (case-sensitive)
- **Response** (200 OK): Theater object
    ```json
    {
      "name": "Theater 1",
      "capacity": 100,
      "rows": 10,
      "seatsPerRow": 10
    }
    ```
- **Error Responses**:
  - `404 Not Found`: Theater with the specified name does not exist

### Showtimes

#### Create Showtime
- **Endpoint**: `POST /showtimes`
- **Description**: Creates a new showtime for a movie in a specific theater. Validates movie existence, theater availability, duration matching, and prevents overlapping showtimes.
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
- **Response** (200 OK): Created showtime object with `availableSeats` initialized to theater capacity
    ```json
    {
      "id": 1,
      "movie": { "id": 1, "title": "The Matrix" },
      "theater": { "name": "Theater 1", "capacity": 100 },
      "start_time": "2024-03-20T14:00:00",
      "end_time": "2024-03-20T16:00:00",
      "price": 12.99,
      "availableSeats": 100
    }
    ```
- **Validation**:
  - `movie` must reference an existing movie
  - `theater` must reference an existing theater
  - `start_time` and `end_time` must be valid ISO 8601 date strings
  - Duration between `start_time` and `end_time` must match movie duration (within 5-minute tolerance)
  - No overlapping showtimes allowed in the same theater
  - `price` must be a positive number
- **Error Responses**:
  - `404 Not Found`: Movie or theater does not exist
  - `400 Bad Request`: Invalid input data, duration mismatch, overlapping showtime, or invalid price

#### Get Showtime by ID
- **Endpoint**: `GET /showtimes/{id}`
- **Description**: Retrieves a specific showtime by its ID.
- **Path Parameters**:
  - `id` (number): The unique identifier of the showtime
- **Response** (200 OK): Showtime object
    ```json
    {
      "id": 1,
      "movie": { "id": 1, "title": "The Matrix" },
      "theater": { "name": "Theater 1", "capacity": 100 },
      "start_time": "2024-03-20T14:00:00",
      "end_time": "2024-03-20T16:00:00",
      "price": 12.99,
      "availableSeats": 95
    }
    ```
- **Error Responses**:
  - `404 Not Found`: Showtime with the specified ID does not exist
  - `400 Bad Request`: Invalid ID format

#### Get Showtimes by Movie
- **Endpoint**: `GET /showtimes/movie/{id}`
- **Description**: Retrieves all showtimes for a specific movie.
- **Path Parameters**:
  - `id` (number): The unique identifier of the movie
- **Response** (200 OK): Array of showtime objects
    ```json
    [
      {
        "id": 1,
        "start_time": "2024-03-20T14:00:00",
        "end_time": "2024-03-20T16:00:00",
        "price": 12.99,
        "availableSeats": 95,
        "theater": { "name": "Theater 1" }
      }
    ]
    ```
- **Error Responses**:
  - `404 Not Found`: Movie with the specified ID does not exist
  - `400 Bad Request`: Invalid ID format

#### Update Showtime
- **Endpoint**: `POST /showtimes/update/{id}`
- **Description**: Updates an existing showtime. Validates duration and overlap constraints.
- **Path Parameters**:
  - `id` (number): The unique identifier of the showtime to update
- **Request Body**: Partial showtime object (all fields optional)
    ```json
    {
      "price": 14.99,
      "start_time": "2024-03-20T15:00:00"
    }
    ```
- **Response** (200 OK): Success message object
    ```json
    {
      "message": "Showtime with ID 1 has been successfully updated"
    }
    ```
- **Error Responses**:
  - `404 Not Found`: Showtime with the specified ID does not exist
  - `400 Bad Request`: Invalid input data, duration mismatch, or overlapping showtime

#### Delete Showtime
- **Endpoint**: `DELETE /showtimes/{id}`
- **Description**: Deletes a showtime by ID. Cannot delete showtimes with existing bookings.
- **Path Parameters**:
  - `id` (number): The unique identifier of the showtime to delete
- **Response** (200 OK): Success message object
    ```json
    {
      "message": "Showtime with ID 1 has been successfully deleted"
    }
    ```
- **Error Responses**:
  - `404 Not Found`: Showtime with the specified ID does not exist
  - `400 Bad Request`: Showtime cannot be deleted because it has existing bookings
  - `400 Bad Request`: Invalid ID format

### Bookings

#### Create Booking
- **Endpoint**: `POST /bookings`
- **Description**: Creates a new booking for a showtime. Validates seat availability, seat number range, and user ID format.
- **Request Body**:
    ```json
    {
      "showtimeId": 1,
      "seatNumber": 15,
      "userId": "84438967-f68f-4fa0-b620-0f08217e76af"
    }
    ```
- **Response** (200 OK): Booking ID object
    ```json
    {
      "bookingId": "d1a6423b-4469-4b00-8c5f-e3cfc42eacae"
    }
    ```
- **Validation**:
  - `showtimeId` must reference an existing showtime
  - `seatNumber` must be between 1 and theater capacity
  - `userId` must be a valid UUID format
  - Seat must not already be booked for the specified showtime
  - Showtime must have available seats
- **Error Responses**:
  - `404 Not Found`: Showtime with the specified ID does not exist
  - `400 Bad Request`: Invalid seat number, invalid UUID format, seat already booked, or no available seats

#### Delete Booking
- **Endpoint**: `DELETE /bookings/{id}`
- **Description**: Cancels and deletes a booking by its UUID. Automatically increments available seats count for the associated showtime.
- **Path Parameters**:
  - `id` (string): The UUID of the booking to delete
- **Response** (200 OK): Success message object
    ```json
    {
      "message": "Booking with ID d1a6423b-4469-4b00-8c5f-e3cfc42eacae has been successfully deleted"
    }
    ```
- **Error Responses**:
  - `404 Not Found`: Booking with the specified ID does not exist
  - `400 Bad Request`: Invalid UUID format

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

## Quick Start

This section provides a quick overview of how to get the application running. For detailed setup instructions, see the Prerequisites and Installation sections below.

**Basic Setup Steps:**
1. Ensure Node.js and Docker are installed
2. Clone the repository and install dependencies
3. Start PostgreSQL using Docker Compose
4. Run the application in development mode
5. Access the API at `http://localhost:3000`

**Example Workflow:**
```bash
# 1. Start the database
docker-compose up -d

# 2. Install dependencies
npm install

# 3. Run the application
npm run start:dev

# 4. Test the API
curl http://localhost:3000/movies/all
```

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

The system includes comprehensive tests for all endpoints and business logic. Tests cover:
- Successful operations
- Error cases and exception handling
- Validation rules and constraints
- Edge cases and boundary conditions
- Data integrity and relationships

### Running Tests

```bash
# Unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

### Test Structure

Tests are organized by feature module:
- `movies.service.spec.ts` - Movie service unit tests
- `showtimes.service.spec.ts` - Showtime service unit tests
- `bookings.service.spec.ts` - Booking service unit tests

Each test suite includes:
- Positive test cases for successful operations
- Negative test cases for error scenarios
- Validation tests for business rules
- Integration tests for entity relationships

## Project Structure

The project follows NestJS conventions with a modular architecture:

```
popcorn_palace_typescript/
├── src/
│   ├── app.module.ts           # Root application module
│   ├── main.ts                # Application entry point
│   ├── movies/                # Movies feature module
│   │   ├── entities/
│   │   │   └── movie.entity.ts
│   │   ├── dto/
│   │   │   ├── create-movie.dto.ts
│   │   │   └── update-movie.dto.ts
│   │   ├── movies.controller.ts
│   │   ├── movies.service.ts
│   │   └── movies.module.ts
│   ├── showtimes/             # Showtimes feature module
│   │   ├── entities/
│   │   │   ├── showtime.entity.ts
│   │   │   └── theater.entity.ts
│   │   ├── dto/
│   │   │   ├── create-showtime.dto.ts
│   │   │   ├── update-showtime.dto.ts
│   │   │   └── create-theater.dto.ts
│   │   ├── showtimes.controller.ts
│   │   ├── showtimes.service.ts
│   │   └── showtimes.module.ts
│   └── bookings/              # Bookings feature module
│       ├── entities/
│       │   └── booking.entity.ts
│       ├── dto/
│       │   └── create-booking.dto.ts
│       ├── bookings.controller.ts
│       ├── bookings.service.ts
│       └── bookings.module.ts
├── test/                      # End-to-end tests
├── compose.yml                # Docker Compose configuration
├── package.json               # Dependencies and scripts
└── Instructions.md            # Project documentation
```

### Module Organization

Each feature module follows the same structure:
- **entities/**: TypeORM entity definitions representing database tables
- **dto/**: Data Transfer Objects for request/response validation
- **controller.ts**: HTTP endpoint handlers
- **service.ts**: Business logic implementation
- **module.ts**: NestJS module configuration

### Key Files

- `src/app.module.ts`: Configures TypeORM connection and imports feature modules
- `src/main.ts`: Bootstrap function that creates and configures the NestJS application
- `compose.yml`: Docker Compose configuration for PostgreSQL database
- `package.json`: Project dependencies and npm scripts

## Usage Examples

This section provides practical examples of common API workflows:

### Complete Booking Workflow

```bash
# 1. Create a movie
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "genre": "Sci-Fi",
    "duration": 148,
    "rating": 8.8,
    "release_year": 2010
  }'

# 2. Create a theater
curl -X POST http://localhost:3000/showtimes/theater \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Screen 1",
    "rows": 10,
    "seatsPerRow": 15
  }'

# 3. Create a showtime
curl -X POST http://localhost:3000/showtimes \
  -H "Content-Type: application/json" \
  -d '{
    "movie": 1,
    "theater": "Screen 1",
    "start_time": "2024-12-25T19:00:00",
    "end_time": "2024-12-25T21:28:00",
    "price": 15.99
  }'

# 4. Create a booking
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "showtimeId": 1,
    "seatNumber": 42,
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }'

# 5. View all movies
curl http://localhost:3000/movies/all

# 6. Get showtimes for a movie
curl http://localhost:3000/showtimes/movie/1

# 7. Cancel a booking
curl -X DELETE http://localhost:3000/bookings/{bookingId}
```

### Error Handling Examples

```bash
# Attempting to book an already booked seat
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "showtimeId": 1,
    "seatNumber": 42,
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }'
# Response: 400 Bad Request - "Seat 42 is already booked for this showtime"

# Attempting to create a duplicate movie
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "genre": "Sci-Fi",
    "duration": 148,
    "rating": 8.8,
    "release_year": 2010
  }'
# Response: 409 Conflict - "A movie with title \"Inception\" already exists"

# Accessing non-existent resource
curl http://localhost:3000/movies/999
# Response: 404 Not Found - "Movie with ID 999 not found"
```

### Base URL and Versioning

All API endpoints are relative to the base URL:
- **Development**: `http://localhost:3000`
- **Production**: Configure according to your deployment environment

**API Versioning**: The current API version is **v1.0**. Future versions will be indicated in the URL path (e.g., `/v2/movies`) to maintain backward compatibility. When breaking changes are introduced, a new version will be released with migration documentation.

## Troubleshooting

This section addresses common issues and their solutions:

### Database Connection Issues

**Problem**: Application fails to connect to PostgreSQL database.

**Solutions**:
1. Verify Docker container is running:
   ```bash
   docker ps
   ```
   If the container is not running, start it:
   ```bash
   docker-compose up -d
   ```

2. Check database credentials in `src/app.module.ts`:
   - Ensure username, password, and database name match `compose.yml` configuration
   - Default credentials: `popcorn-palace` / `popcorn-palace`

3. Verify PostgreSQL is listening on port 5432:
   ```bash
   docker-compose logs db
   ```

### Port Already in Use

**Problem**: Error message indicating port 3000 is already in use.

**Solutions**:
1. Find and stop the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

2. Change the application port in `src/main.ts`:
   ```typescript
   await app.listen(3001); // Use a different port
   ```

### TypeORM Synchronization Warnings

**Problem**: Database schema synchronization warnings or errors.

**Solutions**:
1. Ensure `synchronize: true` is set in development (see `src/app.module.ts`)
2. For production, use migrations instead of synchronization
3. Verify entity decorators are correctly defined
4. Check that all required relations are properly configured

### Test Failures

**Problem**: Tests are failing or not running correctly.

**Solutions**:
1. Clear Jest cache:
   ```bash
   npm test -- --clearCache
   ```

2. Ensure database is running before executing tests:
   ```bash
   docker-compose up -d
   npm test
   ```

3. Check that mock repositories are properly configured in test files
4. Verify all required dependencies are installed:
   ```bash
   npm install
   ```

### Module Import Errors

**Problem**: TypeScript errors related to module imports or missing dependencies.

**Solutions**:
1. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Verify TypeScript configuration in `tsconfig.json`
3. Check that all required NestJS modules are properly imported in feature modules
4. Ensure entity relationships are correctly defined with proper imports

### Booking Validation Errors

**Problem**: Booking creation fails with validation errors.

**Common Causes**:
- Invalid UUID format for `userId` (must be valid UUID v4)
- Seat number exceeds theater capacity
- Showtime has no available seats
- Seat is already booked for the specified showtime

**Solutions**:
1. Validate UUID format before sending requests
2. Check theater capacity before selecting seat numbers
3. Verify showtime availability before attempting to book
4. Use `GET /showtimes/{id}` to check current available seats

## Cleanup

```bash
# Stop the database container
$ docker-compose down
```