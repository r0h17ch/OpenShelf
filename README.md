# OpenShelf — Hybrid Digital & Traditional Library Management System

A production-ready full-stack library management system combining traditional library features with digital book management and AI-powered assistance.

## Architecture

```
OpenShelf/
├── backend/          # Node.js + Express + Prisma + PostgreSQL
├── frontend/         # React + Vite + TailwindCSS + Redux
├── docker-compose.yml
└── README.md
```

## Features

### Traditional Library Management
- **Book Catalog** — full CRUD with ISBN, genre, shelf location, digital/physical tracking
- **Circulation** — borrow, return, renew, rent, buy flow with availability checks
- **Fines** — automatic overdue calculation, fine payment, admin fine management
- **Reservations** — queue-based hold system with position tracking
- **Transactions** — comprehensive activity logging (borrow/return/fine/donation/renewal)
- **Book Donations** — user donation requests with admin approve/reject/complete lifecycle
- **Book Suggestions** — community-driven book requests with voting system
- **Inventory Issues** — missing/stolen book tracking and resolution
- **Reports** — 7 report types: library stats, borrowing trends, popular books, user activity, financial, overdue, category

### Digital Features
- **Digital Books** — PDF uploads, rent/buy model with pricing
- **RAG AI Chatbot** — ask questions about the library catalog (OpenAI + pgvector)
- **Organization Management** — premium domain-based access control

### Admin Dashboard
- Library stats (books, users, borrows, fines)
- User management (add users/admins)
- Full admin controls for circulation, fines, reservations, donations, suggestions, inventory

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)

### 1. Start Backend (Docker)
```bash
cp backend/.env.example backend/.env
docker compose up --build
```
This starts **PostgreSQL** + **Redis** + **Backend API** on port `3000`.

### 2. Run Database Migration & Seed
```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma db seed
```

### 3. Start Frontend (Local)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` with API proxy to `localhost:3000`.

### Default Credentials
| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@openshelf.dev  | admin123  |
| User  | ayan@iiitk.ac.in     | user123   |

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Backend   | Node.js, Express, Prisma ORM, PostgreSQL, pgvector, Redis |
| Frontend  | React 18, Vite, TailwindCSS 3, Redux Toolkit, React Router 7 |
| AI        | OpenAI API, pgvector embeddings |
| Container | Docker, Docker Compose |

## API Endpoints

| Prefix             | Description |
|---------------------|-------------|
| `/api/auth`        | Register, login, profile |
| `/api/books`       | Book CRUD |
| `/api/circulation` | Borrow, return, renew, buy, rent |
| `/api/fines`       | Fine management |
| `/api/reservations`| Reservation queue |
| `/api/transactions`| Activity logging |
| `/api/donations`   | Book donation lifecycle |
| `/api/suggestions` | Book suggestions & voting |
| `/api/inventory`   | Missing/stolen tracking |
| `/api/reports`     | 7 admin report endpoints |
| `/api/users`       | User management |
| `/api/rag`         | AI chatbot (embed, ask) |
| `/api/admin`       | Admin stats & org management |

## License

MIT
