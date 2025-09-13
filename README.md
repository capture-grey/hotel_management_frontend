# Hotel Management System

A full-stack hotel management application built with React, Node.js, Express, and MongoDB. The system allows hotel administrators to manage rooms, bookings, and view booking analytics.

## Features

- Room management (CRUD operations)
- Booking management with check-in/check-out functionality
- Real-time room availability tracking
- Booking history and analytics
- Responsive design for mobile and desktop
- Conflict resolution for room updates and deletions

## Tech Stack

### Frontend
- React 19
- Redux Toolkit (RTK Query)
- React Router DOM
- Tailwind CSS
- Lucide React (icons)
- Vite (build tool)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Serverless deployment (Vercel)

## API Documentation

### Base URL
```
https://hmb-five.vercel.app/api
```

### Authentication Endpoints

#### Register Admin
```http
POST /auth/register
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

### Rooms Endpoints

#### Get All Rooms
```http
GET /rooms?page=1&limit=10&type=single&available=true&minBeds=1&maxPrice=100
```

Query Parameters:
- `page` (optional): Page number
- `limit` (optional): Results per page
- `type` (optional): Room type (single/double/suite)
- `available` (optional): Availability status
- `minBeds` (optional): Minimum number of beds
- `maxPrice` (optional): Maximum price per night

#### Get Single Room
```http
GET /rooms/:id
```

#### Create Room
```http
POST /rooms
Content-Type: application/json

{
  "roomNo": 101,
  "type": "single",
  "beds": 1,
  "pricePerNight": 100,
  "description": "A comfortable single room",
  "available": true
}
```

#### Update Room
```http
PUT /rooms/:id
Content-Type: application/json

{
  "roomNo": 101,
  "type": "double",
  "beds": 2,
  "pricePerNight": 150,
  "description": "Updated room description",
  "available": true
}
```

#### Delete Room
```http
DELETE /rooms/:id
```

### Bookings Endpoints

#### Get All Bookings
```http
GET /bookings?page=1&limit=10
```

#### Get Single Booking
```http
GET /bookings/:id
```

#### Create Booking
```http
POST /bookings
Content-Type: application/json

{
  "roomId": "room_id",
  "guestName": "John Doe",
  "nights": 2
}
```

#### Update Booking
```http
PUT /bookings/:id
Content-Type: application/json

{
  "guestName": "Jane Doe",
  "nights": 3
}
```

#### Delete Booking
```http
DELETE /bookings/:id
```

#### Checkout Booking
```http
POST /bookings/:id/checkout
```

### Booking History Endpoints

#### Get Booking History with Analytics
```http
GET /bookings/summary?page=1&limit=10
```

Response includes:
- Paginated booking history
- Total revenue
- Total bookings
- Average stay duration

## Installation and Setup

### Prerequisites
- Node.js 16+
- MongoDB
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Environment Variables

#### Frontend (.env)
```
VITE_API_BASE_URL=your_api_url
```

#### Backend (.env)
```
MONGO_CONNECTION_STRING=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

## Deployment

The application is deployed on Vercel:
- Frontend: [https://hotel-management-frontend-fawn.vercel.app](https://hotel-management-frontend-fawn.vercel.app)
- Backend: [https://hmb-five.vercel.app](https://hmb-five.vercel.app)

## License

MIT License - see LICENSE file for details
