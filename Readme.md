# Library Management System

A full-stack library management system built with React, Express.js, Prisma, and SQLite.

## Features

- User authentication and role-based access
- Book catalog management (Admin)
- Book browsing and borrowing (Users)
- Group management for collaborative borrowing
- Fine calculation system
- Real-time updates across interfaces

## Setup Instructions

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Generate Prisma client: `npx prisma generate`
4. Run database migrations: `npx prisma db push`
5. Seed the database: `npm run db:seed`
6. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Default Accounts

### Admin Account
- **Email**: admin@library.com
- **Password**: admin123
- **Role**: Administrator (Full access to book management, user management, and system settings)

### User Accounts
- **John Doe**
  - Email: john@example.com
  - Password: john123

- **Jane Smith**
  - Email: jane@example.com
  - Password: jane123

- **Mike Johnson**
  - Email: mike@example.com
  - Password: mike123

- **Sarah Wilson**
  - Email: sarah@example.com
  - Password: sarah123

- **Tom Brown**
  - Email: tom@example.com
  - Password: tom123

- **Lisa Davis**
  - Email: lisa@example.com
  - Password: lisa123

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: Role-based access control

## API Endpoints

- `/api/users` - User management
- `/api/books` - Book catalog operations
- `/api/borrowings` - Borrowing system
- `/api/groups` - Group management
- `/api/fine-settings` - Fine configuration

## Currency

The system uses Indian Rupee (₹) for all pricing and fine calculations.