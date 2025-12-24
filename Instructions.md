## About Me

Hi, I'm Lior, a 27-year-old software developer passionate about building scalable and efficient systems. This project includes enhancements and hooks for AI agent testing to facilitate automated testing workflows, along with linting descriptors to help identify and correct code quality issues.

# Popcorn Palace - Movie Theater Booking System

## Development Tools & Quality Assurance

### AI Agent Testing Hooks
Hooks for AI agent testing enable automated code review and testing workflows. These hooks allow AI agents to:
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

Popcorn Palace is a movie theater booking system that enables users to manage movies, showtimes, and bookings. The system provides comprehensive seat validation, ensures showtime durations match movie durations, and manages theater capacity automatically.

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
- Update and delete operations return HTTP status code 200 with a descriptive message object
- All responses follow consistent JSON formatting for improved API consumer experience

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
- **Description**: Retrieves all movies.
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
- **Description**: Retrieves all theaters.
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

**1. Showtime Duration Validation**:
   - The duration between `start_time` and `end_time` must match the movie's duration
   - A 5-minute tolerance is allowed for small discrepancies (e.g., cleanup time)
   - Calculation: `(end_time - start_time) in minutes ≈ movie.duration ± 5 minutes`
   - If the duration doesn't match, a `BadRequestException` (400) is thrown
   - **Example**: Movie duration 120 minutes, showtime must be 115-125 minutes

**2. Theater Capacity Management**:
   - Theater capacity is automatically calculated as `rows × seatsPerRow`
   - Capacity must match the provided value in create theater request
   - Showtimes cannot be created if the theater has no available seats
   - Available seats are tracked per showtime and decremented on booking
   - Available seats are incremented when bookings are cancelled

**3. Theater Name Constraints**:
   - Theater names must be unique across the system
   - Theater names are used as primary keys (case-sensitive)
   - Duplicate theater names result in `ConflictException` (409)
   - **Example**: "Theater 1" and "theater 1" are considered different

**4. Showtime Overlap Prevention**:
   - No overlapping showtimes are allowed in the same theater
   - Overlap detection: `start_time < existing.end_time AND end_time > existing.start_time`
   - A `BadRequestException` (400) is thrown if there's an overlap
   - Overlap check is performed before creating or updating showtimes

**5. Seat Booking Validation**:
   - Seat numbers must be between 1 and theater capacity (inclusive)
   - No duplicate bookings for the same seat in a showtime
   - Available seats count is automatically updated when bookings are made/cancelled
   - Seat validation occurs before database transaction to prevent race conditions
   - Invalid seat numbers result in `BadRequestException` (400)

## Error Handling

The API follows RESTful conventions for error responses. All errors return a JSON object with a consistent structure, making it easy for clients to handle errors programmatically.

### HTTP Status Codes

**400 Bad Request** - Invalid input data or validation failures:
- **Common Scenarios**:
  - Invalid seat number (out of range)
  - Missing required fields in request body
  - Invalid UUID format for userId
  - Invalid date format for showtime times
  - Duration mismatch between showtime and movie
  - Overlapping showtimes in the same theater
- **Response Format**:
  ```json
  {
    "statusCode": 400,
    "message": ["Seat 150 is already booked for this showtime"],
    "error": "Bad Request",
    "timestamp": "2024-03-20T14:30:00.000Z"
  }
  ```
- **Client Handling**: Validate input data before sending requests. Parse the `message` array to display specific validation errors to users.

**404 Not Found** - Resource not found:
- **Common Scenarios**:
  - Movie, showtime, or booking with specified ID does not exist
  - Theater with specified name does not exist
  - Invalid resource identifier format
- **Response Format**:
  ```json
  {
    "statusCode": 404,
    "message": "Showtime with ID 999 not found",
    "error": "Not Found",
    "timestamp": "2024-03-20T14:30:00.000Z"
  }
  ```
- **Client Handling**: Verify resource existence before operations. Display user-friendly "not found" messages.

**409 Conflict** - Resource already exists or conflict with existing data:
- **Common Scenarios**:
  - Duplicate movie title
  - Theater name already in use
  - Attempting to create conflicting resources
- **Response Format**:
  ```json
  {
    "statusCode": 409,
    "message": "A movie with title \"The Matrix\" already exists",
    "error": "Conflict",
    "timestamp": "2024-03-20T14:30:00.000Z"
  }
  ```
- **Client Handling**: Check for existing resources before creation. Provide options to update existing resources.

**500 Internal Server Error** - Unexpected server-side error:
- **Common Scenarios**:
  - Database connection failures
  - Unexpected exceptions in business logic
  - External service failures
  - Configuration errors
- **Response Format**:
  ```json
  {
    "statusCode": 500,
    "message": "Internal server error",
    "error": "Internal Server Error",
    "timestamp": "2024-03-20T14:30:00.000Z"
  }
  ```
- **Client Handling**: Implement retry logic with exponential backoff. Log errors for debugging. Notify users of temporary service issues.

### Error Response Structure

All error responses follow this consistent format:
- **`statusCode`** (number): HTTP status code (400, 404, 409, 500)
- **`message`** (string | string[]): Human-readable error description(s)
- **`error`** (string): Error type name matching HTTP status text
- **`timestamp`** (string, optional): ISO 8601 timestamp of when the error occurred

### Error Handling Best Practices

**Client-Side**:
- Always check the `statusCode` field to determine error type
- Parse `message` array to extract specific validation errors
- Implement user-friendly error messages based on error type
- Log errors with full response for debugging
- Implement retry logic for 500 errors (with exponential backoff)
- Handle network errors separately from API errors

**Server-Side**:
- Use appropriate exception types (BadRequestException, NotFoundException, ConflictException)
- Provide detailed error messages for validation failures
- Never expose sensitive information in error messages
- Log errors with full context for debugging
- Use global exception filters for consistent error formatting

## Quick Start

This section provides a quick overview of how to get the application running. For detailed setup instructions, see the Prerequisites and Installation sections below.

**Basic Setup Steps:**
1. Ensure Node.js (LTS) and Docker are installed
2. Clone the repository and install dependencies
3. Start PostgreSQL using Docker Compose
4. Run the application in development mode
5. Access the API at `http://localhost:3000`

> **Note**: Make sure Docker Desktop is running before executing `docker-compose` commands.

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
# Development mode (single run)
$ npm run start

# Watch mode (auto-reload on file changes - recommended for development)
$ npm run start:dev

# Production mode (compiled JavaScript)
$ npm run start:prod
```

> **Tip**: Use `npm run start:dev` during development for automatic reloading when you make code changes.

## Testing

The system uses **Jest** as the testing framework with comprehensive test coverage for all endpoints and business logic. The testing strategy follows a multi-layered approach to ensure reliability and correctness.

### Testing Framework

- **Jest**: Primary testing framework for unit and integration tests
- **Supertest**: HTTP assertion library for API endpoint testing
- **TypeORM Testing**: Mock repositories for isolated unit testing
- **Coverage Tools**: Built-in Jest coverage reporting

### Test Coverage

Tests cover the following areas:
- **Successful Operations**: All CRUD operations for movies, theaters, showtimes, and bookings
- **Error Handling**: Exception scenarios and error responses (400, 404, 409, 500)
- **Validation Rules**: Business logic validation and constraint enforcement
- **Edge Cases**: Boundary conditions, concurrent operations, and race conditions
- **Data Integrity**: Entity relationships, foreign key constraints, and cascading operations
- **Integration**: End-to-end workflows and cross-module interactions

### Running Tests

```bash
# Run all unit tests
$ npm run test

# Run tests in watch mode (for development)
$ npm run test:watch

# Run end-to-end tests
$ npm run test:e2e

# Generate test coverage report
$ npm run test:cov

# Run tests with verbose output
$ npm run test -- --verbose

# Run specific test file
$ npm run test -- movies.service.spec.ts
```

### Test Structure

Tests are organized by feature module following NestJS testing conventions:

**Unit Tests** (`*.service.spec.ts`):
- `movies.service.spec.ts` - Movie service business logic tests
- `showtimes.service.spec.ts` - Showtime service business logic tests
- `bookings.service.spec.ts` - Booking service business logic tests

**Test Suite Organization**:
Each test suite includes:
- **Positive Test Cases**: Successful CRUD operations, valid data scenarios
- **Negative Test Cases**: Error scenarios, invalid input handling
- **Validation Tests**: Business rule enforcement, constraint validation
- **Integration Tests**: Entity relationships, cross-module interactions
- **Mock Setup**: Repository mocking, dependency injection testing

### Example Test Cases

**Unit Test Example** (Booking Service):
```typescript
describe('BookingsService', () => {
  it('should create a booking successfully', async () => {
    // Test successful booking creation
  });

  it('should throw BadRequestException for duplicate seat booking', async () => {
    // Test duplicate booking prevention
  });

  it('should throw NotFoundException for invalid showtime', async () => {
    // Test error handling
  });
});
```

**Integration Test Example**:
```typescript
describe('Booking Workflow (e2e)', () => {
  it('should complete full booking workflow', async () => {
    // Create movie -> Create theater -> Create showtime -> Create booking
  });
});
```

### Test Best Practices

- **Isolation**: Each test is independent and can run in any order
- **Mocking**: External dependencies (repositories, services) are mocked
- **Assertions**: Clear and descriptive assertions for better failure messages
- **Coverage**: Aim for >80% code coverage across all modules
- **Naming**: Descriptive test names that explain what is being tested

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

**Base URL**:
- **Development**: `http://localhost:3000`
- **Production**: Configure according to your deployment environment

**API Versioning**: The current API version is **v1.0**. Future versions will be indicated in the URL path (e.g., `/v2/movies`) to maintain backward compatibility. Breaking changes will trigger new version releases with migration documentation.

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
- Showtime ID does not exist
- Concurrent booking attempts for the same seat

**Solutions**:
1. **Validate UUID Format**: Use a UUID validation library before sending requests
   ```typescript
   import { validate as isUuid } from 'uuid';
   if (!isUuid(userId)) {
     throw new Error('Invalid UUID format');
   }
   ```

2. **Check Theater Capacity**: Retrieve showtime details first to verify capacity
   ```bash
   GET /showtimes/{id}
   # Check the theater.capacity field before selecting seat number
   ```

3. **Verify Availability**: Check available seats before booking
   ```bash
   GET /showtimes/{id}
   # Verify availableSeats > 0
   ```

4. **Handle Concurrent Bookings**: Implement retry logic for race conditions
   - If booking fails due to seat already taken, fetch updated showtime and retry
   - Use optimistic locking or database transactions to prevent double bookings

5. **Error Recovery**: Implement proper error handling
   - Parse error response to extract specific validation message
   - Display user-friendly error messages
   - Provide alternative seat selection options

### Common Error Scenarios

**Database Connection Timeout**:
- **Problem**: Application cannot connect to PostgreSQL
- **Solution**: Check Docker container status, verify network connectivity, check firewall rules

**TypeORM Query Errors**:
- **Problem**: Database queries fail or return unexpected results
- **Solution**: Verify entity relationships, check query syntax, review database logs

**Validation Pipe Errors**:
- **Problem**: DTO validation fails with unclear messages
- **Solution**: Review DTO decorators, check class-validator configuration, verify request body format

## Best Practices

This section outlines recommended practices for working with the Popcorn Palace API:

### API Usage

**Request Handling**:
- Include `Content-Type: application/json` header for POST/PUT requests
- Validate input data client-side before sending requests
- Handle all HTTP status codes appropriately, especially error responses (400, 404, 409, 500)
- Implement retry logic with exponential backoff for transient failures (500 errors)

**Error Handling**:
- Parse error responses to extract meaningful messages for user feedback
- Log error responses for debugging
- Display user-friendly messages based on the `message` field
- Use the `statusCode` field to determine error type

**Performance Optimization**:

**Caching Strategies**:
- Implement Redis or in-memory caching for frequently accessed data
- Cache movie lists, theater information, and showtime data
- Use cache invalidation strategies to maintain data consistency
- Implement HTTP caching headers (ETag, Last-Modified) for GET requests
- Cache database query results for read-heavy operations

**Database Query Optimization**:
- Use database indexes on frequently queried fields (movie titles, theater names, showtime IDs)
- Implement query optimization with TypeORM query builders
- Use eager loading strategically to reduce N+1 query problems
- Implement database connection pooling for better resource management
- Use database transactions efficiently to minimize lock contention
- Monitor slow queries and optimize them using EXPLAIN ANALYZE

**API Performance**:
- Implement response compression (gzip) for large payloads
- Use pagination for large result sets to reduce response size
- Minimize API calls by batching operations when possible
- Implement request/response caching at the API gateway level
- Use appropriate HTTP methods (GET for retrieval, POST for creation, DELETE for removal)
- Implement async processing for long-running operations

**Application-Level Optimization**:
- Use connection pooling for database connections
- Implement lazy loading for entity relationships where appropriate
- Optimize TypeORM entity relationships to reduce unnecessary queries
- Use database views for complex queries
- Implement background jobs for non-critical operations
- Monitor application performance with APM (Application Performance Monitoring) tools

### Data Validation

**Before Creating Resources**:
- Verify movie titles are unique before attempting creation
- Check theater capacity matches rows × seatsPerRow
- Validate showtime durations match movie durations (within 5-minute tolerance)
- Ensure no overlapping showtimes exist in the same theater

**Before Booking**:
- Validate UUID format for `userId` (must be valid UUID v4)
- Check seat availability using `GET /showtimes/{id}` before booking
- Verify seat number is within valid range (1 to theater capacity)
- Confirm showtime has available seats

### Security Considerations

**Authentication & Authorization**:
- Implement JWT (JSON Web Tokens) or OAuth2 for user authentication
- Use role-based access control (RBAC) for different user permissions
- Secure API endpoints with authentication middleware
- Implement session management and token refresh mechanisms
- Use HTTPS in production to encrypt data in transit
- Store sensitive credentials in environment variables (never in code)

**Input Validation & Sanitization**:
- Validate all input data on both client and server side
- Sanitize user inputs to prevent injection attacks (SQL, NoSQL, XSS)
- Use DTOs (Data Transfer Objects) with class-validator for automatic validation
- Implement rate limiting to prevent abuse and DDoS attacks
- Validate UUID formats and data types before processing

**Data Protection**:
- Encrypt sensitive data at rest (database encryption)
- Use parameterized queries to prevent SQL injection
- Implement proper error handling without exposing sensitive information
- Log security events without exposing user credentials
- Follow GDPR/privacy regulations for user data handling
- Implement data retention and deletion policies

**Secure Coding Practices**:
- Never expose database credentials or API keys in code
- Use environment variables for configuration
- Implement CORS (Cross-Origin Resource Sharing) policies
- Use Content Security Policy (CSP) headers
- Regularly update dependencies to patch security vulnerabilities
- Implement security headers (X-Content-Type-Options, X-Frame-Options)
- Use secure password hashing algorithms (bcrypt, Argon2) if implementing authentication

**Vulnerability Prevention**:
- Protect against common vulnerabilities (OWASP Top 10)
- Implement CSRF (Cross-Site Request Forgery) protection
- Validate file uploads if implementing file storage
- Use prepared statements for database queries
- Implement proper logging and monitoring for security incidents

### Development Workflow

**Testing**:
- Write unit tests for business logic
- Create integration tests for API endpoints
- Test error scenarios and edge cases
- Verify data relationships and constraints

**Code Quality**:
- Follow TypeScript and NestJS best practices
- Use TypeORM decorators correctly for entity definitions
- Implement error handling in services
- Maintain consistent formatting with ESLint and Prettier

**Database Management**:
- Use migrations in production (not `synchronize: true`)
- Regularly backup database data
- Monitor performance and optimize queries
- Keep database schema in sync with entity definitions

## Cleanup

```bash
# Stop the database container
$ docker-compose down
```