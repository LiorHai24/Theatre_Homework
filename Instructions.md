# Popcorn Palace Movie Ticket Booking System - API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Movies

#### Get All Movies
```http
GET /movies
```
**Response (200 OK)**
```json
[
  {
    "id": 1,
    "title": "The Matrix",
    "duration": 136,
    "genre": "Sci-Fi",
    "release_year": 1999,
    "rating": 8.7
  },
  {
    "id": 2,
    "title": "Inception",
    "duration": 148,
    "genre": "Sci-Fi",
    "release_year": 2010,
    "rating": 8.8
  },
  {
    "id": 3,
    "title": "The Dark Knight",
    "duration": 152,
    "genre": "Action",
    "release_year": 2008,
    "rating": 9.0
  }
]
```

#### Get Movie by ID
```http
GET /movies/:id
```
**Response (200 OK)**
```json
{
  "id": 1,
  "title": "The Matrix",
  "duration": 136,
  "genre": "Sci-Fi",
  "release_year": 1999,
  "rating": 8.7
}
```

#### Create Movie
```http
POST /movies
```
**Request Body**
```json
{
  "title": "The Matrix",
  "duration": 136,
  "genre": "Sci-Fi",
  "release_year": 1999,
  "rating": 8.7
}
```
**Response (201 Created)**
```json
{
  "id": 1,
  "title": "The Matrix",
  "duration": 136,
  "genre": "Sci-Fi",
  "release_year": 1999,
  "rating": 8.7
}
```

#### Update Movie
```http
POST /movies/update/:movieTitle
```
**Request Body**
```json
{
  "title": "The Matrix Reloaded",
  "duration": 138,
  "genre": "Sci-Fi",
  "release_year": 2003,
  "rating": 7.2
}
```
**Response (200 OK)**
```json
{
  "id": 1,
  "title": "The Matrix Reloaded",
  "duration": 138,
  "genre": "Sci-Fi",
  "release_year": 2003,
  "rating": 7.2
}
```
**Note**: If the movie duration is updated and it causes any showtime overlaps, those showtimes will be deleted and a 404 error will be returned with a message indicating which showtimes were affected.

#### Delete Movie
```http
DELETE /movies/:movieTitle
```
**Response (200 OK)**
```json
{
  "message": "Movie \"The Matrix\" has been successfully deleted"
}
```

### Showtimes
#### Create Showtime - time stamp must match movie time period.
```http
POST /showtimes
```
**Request Body**
```json
{
  "movieId": 1,
  "theaterId": 1,
  "startTime": "2024-03-20T18:00:00.000Z",
  "price": 12.99
}
```
**Response (201 Created)**
```json
{
  "id": 1,
  "movie": {
    "id": 1,
    "title": "The Matrix"
  },
  "theater": {
    "id": 1,
    "name": "Main Theater",
    "capacity": 150,
    "rows": 10,
    "seatsPerRow": 15
  },
  "startTime": "2024-03-20T18:00:00.000Z",
  "endTime": "2024-03-20T20:16:00.000Z",
  "price": 12.99,
  "availableSeats": 150
}
```

#### Get Showtime by ID
```http
GET /showtimes/:id
```
**Response (200 OK)**
```json
{
  "id": 1,
  "movie": {
    "id": 1,
    "title": "The Matrix"
  },
  "theater": {
    "id": 1,
    "name": "Main Theater",
    "capacity": 150,
    "rows": 10,
    "seatsPerRow": 15
  },
  "startTime": "2024-03-20T18:00:00.000Z",
  "endTime": "2024-03-20T20:16:00.000Z",
  "price": 12.99,
  "availableSeats": 100
}
```

#### Update Showtime
```http
PATCH /showtimes/:id
```
**Request Body**
```json
{
  "price": 14.99,
  "startTime": "2024-03-20T19:00:00.000Z"
}
```
**Response (200 OK)**
```json
{
  "id": 1,
  "movie": {
    "id": 1,
    "title": "The Matrix"
  },
  "theater": {
    "id": 1,
    "name": "Main Theater",
    "capacity": 150,
    "rows": 10,
    "seatsPerRow": 15
  },
  "startTime": "2024-03-20T19:00:00.000Z",
  "endTime": "2024-03-20T21:16:00.000Z",
  "price": 14.99,
  "availableSeats": 100
}
```

#### Delete Showtime
```http
DELETE /showtimes/:id
```
**Response (200 OK)**
```json
{
  "message": "Showtime with ID 1 has been successfully deleted"
}
```

### Tickets

#### Book Ticket
```http
POST /tickets
```
**Request Body**
```json
{
  "showtime_id": 1,
  "row_number": 5,
  "seat_number": 10,
  "customer_name": "John Doe",
  "customer_email": "john@example.com"
}
```
**Response (201 Created)**
```json
{
  "id": 1,
  "showtime": {
    "id": 1,
    "movie": {
      "id": 1,
      "title": "The Matrix"
    },
    "theater": {
      "id": 1,
      "name": "Main Theater"
    },
    "startTime": "2024-03-20T18:00:00.000Z",
    "endTime": "2024-03-20T20:16:00.000Z",
    "price": 12.99
  },
  "row_number": 5,
  "seat_number": 10,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "price": 12.99
}
```

#### Get Tickets by Showtime
```http
GET /tickets/showtime/:id
```
**Response (200 OK)**
```json
[
  {
    "id": 1,
    "showtime": {
      "id": 1,
      "movie": {
        "id": 1,
        "title": "The Matrix"
      },
      "theater": {
        "id": 1,
        "name": "Main Theater"
      },
      "startTime": "2024-03-20T18:00:00.000Z",
      "endTime": "2024-03-20T20:16:00.000Z",
      "price": 12.99
    },
    "row_number": 5,
    "seat_number": 10,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "price": 12.99
  }
]
```

#### Get Tickets by Customer(by email adress)
```http
GET /tickets/customer/:email
```
**Response (200 OK)**
```json
[
  {
    "id": 1,
    "showtime": {
      "id": 1,
      "movie": {
        "id": 1,
        "title": "The Matrix"
      },
      "theater": {
        "id": 1,
        "name": "Main Theater"
      },
      "startTime": "2024-03-20T18:00:00.000Z",
      "endTime": "2024-03-20T20:16:00.000Z",
      "price": 12.99
    },
    "row_number": 5,
    "seat_number": 10,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "price": 12.99
  }
]
```

#### Cancel Ticket
```http
DELETE /tickets/:id
```
**Response (200 OK)**
```json
{
  "message": "Ticket with ID 1 has been successfully cancelled"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Seat 10 in row 5 is already booked for this showtime.",
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Showtime with ID 1 not found",
  "error": "Not Found"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

## Data Validation

### Movie
- Title: Required, string
- Duration: Required, number (minutes)
- Genre: Required, string
- Release Year: Required, number
- Rating: Required, number (0-5)

### Showtime
- Movie ID: Required, number
- Theater ID: Required, number
- Start Time: Required, ISO date string
- Price: Required, number (decimal)

### Ticket
- Showtime ID: Required, number
- Row Number: Required, number
- Seat Number: Required, number
- Customer Name: Required, string
- Customer Email: Required, valid email format
