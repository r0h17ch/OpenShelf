# OpenShelf Frontend

React 18 + Vite + TailwindCSS + Redux Toolkit single-page application.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`. The Vite dev server proxies `/api` requests to `http://localhost:3000`.

For Vercel deployments, set `VITE_API_BASE_URL` to your Railway backend URL so the browser calls the correct API origin.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000` | Backend API URL |

## Tech Stack

- **React 18** — UI framework
- **Vite 6** — Build tool with HMR
- **TailwindCSS 3** — Utility-first CSS (dark theme)
- **Redux Toolkit** — State management
- **React Router 7** — Client-side routing
- **Axios** — HTTP client with JWT interceptor
- **React Toastify** — Toast notifications
- **Lucide React** — Icon library

## Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── axios.js           # Axios client with auth interceptor
│   ├── components/
│   │   ├── Layout.jsx          # App shell with sidebar + navbar
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   └── Navbar.jsx          # Top navigation bar
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Dashboard.jsx       # Admin stats / user overview
│   │   ├── Books.jsx           # Book catalog with search
│   │   ├── AddBook.jsx         # Add new book (admin)
│   │   ├── BorrowedBooks.jsx   # User's borrowed books
│   │   ├── AllBorrowedBooks.jsx# Admin: all active borrows
│   │   ├── MyReservations.jsx  # User's reservations
│   │   ├── MyFines.jsx         # User's fines
│   │   ├── ManageFines.jsx     # Admin: fine management
│   │   ├── MyTransactions.jsx  # User's transaction history
│   │   ├── AllTransactions.jsx # Admin: all transactions
│   │   ├── BookSuggestions.jsx # Suggestions with voting
│   │   ├── SuggestBook.jsx     # Submit new suggestion
│   │   ├── DonateBook.jsx      # Submit donation request
│   │   ├── MyDonations.jsx     # User's donation requests
│   │   ├── ManageDonations.jsx # Admin: donation management
│   │   ├── Reports.jsx         # Admin: 6 report types
│   │   ├── InventoryIssues.jsx # Admin: missing/stolen
│   │   ├── Users.jsx           # Admin: user management
│   │   ├── Profile.jsx         # User profile view/edit
│   │   └── RagChatbot.jsx      # AI library assistant
│   ├── store/
│   │   ├── store.js            # Redux store config
│   │   └── slices/
│   │       ├── authSlice.js    # Auth state & thunks
│   │       └── bookSlice.js    # Books state & thunks
│   ├── App.jsx                 # Routes & guards
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles & design system
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Design System

The frontend uses a **dark glassmorphism** theme with:
- `glass` / `glass-card` — blurred glass panels
- `gradient-text` — emerald-to-cyan gradient text
- `btn-primary` / `btn-secondary` / `btn-danger` — button styles
- `input-field` — consistent form inputs
- `badge-success` / `badge-warning` / `badge-danger` / `badge-info` — status badges
- `card-hover` — hover lift animation
- `animate-fade-in` — page transition animation

## Routes

### Public
| Route | Page |
|-------|------|
| `/login` | Login |
| `/register` | Register |

### Authenticated
| Route | Page | Admin Only |
|-------|------|------------|
| `/dashboard` | Dashboard | — |
| `/books` | Book catalog | — |
| `/books/add` | Add book | ✓ |
| `/borrowed` | My borrowed books | — |
| `/borrowed/all` | All active borrows | ✓ |
| `/reservations` | My reservations | — |
| `/fines` | My fines | — |
| `/fines/manage` | Manage fines | ✓ |
| `/transactions` | My transactions | — |
| `/transactions/all` | All transactions | ✓ |
| `/suggestions` | Book suggestions | — |
| `/suggestions/new` | Suggest a book | — |
| `/donations` | My donations | — |
| `/donations/new` | Donate a book | — |
| `/donations/manage` | Manage donations | ✓ |
| `/reports` | Reports | ✓ |
| `/inventory` | Inventory issues | ✓ |
| `/users` | Manage users | ✓ |
| `/profile` | Profile | — |
| `/rag` | AI assistant | — |

## Build

```bash
npm run build    # Production build to dist/
npm run preview  # Preview production build
```
