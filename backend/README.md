# Library Management System Backend

Node.js Express TypeScript backend with SQLite database and Prisma ORM.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma client:
```bash
npm run db:generate
```

3. Push database schema:
```bash
npm run db:push
```

4. Seed database:
```bash
npm run db:seed
```

5. Start development server:
```bash
npm run dev
```

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get group by ID
- `POST /api/groups` - Create new group
- `POST /api/groups/:id/members` - Add member to group

### Borrowings
- `GET /api/borrowings` - Get all borrowings
- `POST /api/borrowings` - Create new borrowing
- `PUT /api/borrowings/:id/return` - Return book
- `GET /api/borrowings/user/:userId` - Get borrowings by user

## Features

- Express.js with TypeScript
- SQLite database with Prisma ORM
- CORS enabled
- Security middleware (Helmet)
- Rate limiting
- Request logging (Morgan)
- Proper error handling