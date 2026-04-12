# OpenShelf Backend

Node.js + Express API server with Supabase-backed book storage, Prisma-backed legacy modules, and Redis.

## Setup

### Docker (Recommended)
```bash
cp .env.example .env
cd .. && docker compose up --build
```

### Local
```bash
cp .env.example .env
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SUPABASE_URL` | — | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | — | Supabase service role key |
| `CORS_ORIGIN` | `http://localhost:5173` | Comma-separated allowed frontend origins |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string for Prisma-backed legacy routes |
| `REDIS_URL` | `redis://redis:6379` | Redis connection string |
| `JWT_SECRET` | `super-secret-dev-key` | JWT signing secret |
| `PORT` | `3000` | Server port |
| `FINE_PER_DAY` | `5` | Fine amount per overdue day (₹) |
| `DEFAULT_BORROW_DAYS` | `14` | Default borrow period |
| `PREMIUM_DOMAINS` | `iiitk.ac.in` | Comma-separated premium email domains |
| `OPENAI_API_KEY` | — | OpenAI API key for RAG chatbot |

## Project Structure

```
backend/
├── controllers/        # Request handlers
│   ├── authController.js
│   ├── bookController.js
│   ├── circulationController.js
│   ├── fineController.js
│   ├── reservationController.js
│   ├── transactionController.js
│   ├── donationController.js
│   ├── suggestionController.js
│   ├── inventoryController.js
│   ├── reportController.js
│   ├── userController.js
│   ├── ragController.js
│   └── adminController.js
├── services/           # Business logic
├── routes/             # Express route definitions
├── middlewares/
│   ├── auth.js         # JWT authentication & admin guard
│   └── errorHandler.js # Global error handler
├── prisma/
│   ├── schema.prisma   # Database schema
│   ├── seed.js         # Seed data
│   └── migrations/     # Prisma migrations
├── server.js           # Express app entry point
└── package.json
```

## Database Models

| Model | Description |
|-------|-------------|
| `User` | Users with roles (USER/ADMIN), premium status, fine balance |
| `Book` | Physical & digital books with ISBN, inventory, pricing |
| `Circulation` | Borrow/rent/buy records with due dates and renewals |
| `Fine` | Overdue fines linked to circulations |
| `Reservation` | Queue-based hold system |
| `Transaction` | Activity log (borrow/return/fine/donation/renewal) |
| `BookDonation` | User donation requests with admin lifecycle |
| `BookSuggestion` | Community book requests with voting |
| `SuggestionVote` | Vote tracking (one vote per user per suggestion) |
| `InventoryIssue` | Missing/stolen book reports |
| `Org` | Premium domain organizations |
| `Embedding` | pgvector embeddings for RAG search |

## API Reference

### Auth (`/api/auth`)
- `POST /register` — Register new user
- `POST /login` — Login and get JWT token
- `GET /me` — Get current user profile

### Books (`/api/books`)
- `GET /` — List all books (supports search, filter)
- `POST /` — Add book (admin)
- `PUT /:id` — Update book (admin)
- `DELETE /:id` — Delete book (admin)
- `POST /upload` — Upload PDF + optional cover to Supabase and create a book

### Circulation (`/api/circulation`)
- `POST /borrow` — Borrow a physical book
- `POST /return` — Return a book
- `PUT /renew/:id` — Renew a borrow
- `POST /rent` — Rent a digital book
- `POST /buy` — Buy a digital book
- `GET /my` — User's circulations
- `GET /all` — All active borrows (admin)
- `POST /admin-borrow` — Borrow on behalf of user (admin)
- `PUT /admin-return/:id` — Return on behalf of user (admin)
- `POST /extend-due` — Extend due date (admin)

### Fines (`/api/fines`)
- `GET /my` — User's fines
- `POST /calculate` — Calculate all overdue fines
- `POST /:id/pay` — Pay a fine
- `GET /all` — All fines (admin)
- `PUT /mark-paid/:id` — Mark fine as paid (admin)

### Reservations (`/api/reservations`)
- `POST /` — Place a reservation
- `GET /my` — User's reservations
- `DELETE /:id` — Cancel a reservation
- `GET /all` — All reservations (admin)
- `POST /process/:bookId` — Process next reservation (admin)

### Transactions (`/api/transactions`)
- `GET /my` — User's transactions
- `GET /all` — All transactions (admin)
- `POST /record` — Record a transaction (admin)
- `GET /stats` — Transaction stats (admin)

### Donations (`/api/donations`)
- `POST /request` — Submit donation request
- `GET /my` — User's donations
- `GET /all` — All donations (admin)
- `PUT /approve/:id` — Approve (admin)
- `PUT /reject/:id` — Reject (admin)
- `PUT /complete/:id` — Complete and add book to inventory (admin)

### Suggestions (`/api/suggestions`)
- `POST /` — Create suggestion
- `GET /all` — All suggestions
- `GET /my` — User's suggestions
- `POST /vote/:id` — Toggle vote
- `POST /approve/:id` — Approve (admin)
- `POST /reject/:id` — Reject (admin)
- `DELETE /:id` — Delete (admin)

### Inventory (`/api/inventory`)
- `POST /` — Report issue (admin)
- `GET /` — List issues (admin)
- `PUT /resolve/:id` — Resolve issue (admin)

### Reports (`/api/reports`)
- `GET /library-stats` — Overall library statistics
- `GET /borrowing` — Borrowing trends by period
- `GET /popular-books` — Most borrowed books
- `GET /user-activity` — User activity analysis
- `GET /financial` — Revenue and fine analysis
- `GET /overdue` — Overdue books report
- `GET /category` — Books by genre/category

### Users (`/api/users`)
- `GET /all` — List all users (admin)
- `POST /add-user` — Add new user (admin)
- `POST /add-admin` — Add new admin (admin)
- `PUT /update-profile` — Update own profile

### RAG (`/api/rag`)
- `POST /embed` — Generate embeddings for a book
- `POST /ask` — Ask the AI assistant
