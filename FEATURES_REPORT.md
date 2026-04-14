# OpenShelf Feature Report: Implementation & Technical Architecture

**Date:** April 14, 2026  
**Project:** OpenShelf - Library Management System  
**Report Scope:** My Fines, Suggestions, Admin, Add Books, Manage Fines

---

## 1. MY FINES

### Overview
Displays a user's outstanding library fines based on overdue book returns. Users can view fine details and pay individual fines.

### Features & Functionalities
- **View Personal Fines**: Display all fines associated with the logged-in user
- **Fine Details**: Shows fine amount, associated book, circulation details
- **Pay Fines**: Single-click payment option for each fine
- **Real-time Updates**: Fine list refreshes after payment
- **Status Tracking**: Visual indication of paid vs. unpaid fines

### Tech Stack

#### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **API Client**: Axios (custom configured)
- **UI**: Tailwind CSS
- **Notifications**: React-Toastify
- **State Management**: React hooks (useState, useEffect)

#### Backend
- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT tokens with requireAuth middleware
- **API Response**: RESTful JSON endpoints

### Implementation Approach

#### Database Schema
```
Fine {
  id: UUID
  circularationId: UUID (foreign key)
  amount: Decimal
  isPaid: Boolean
  createdAt: DateTime
  paidAt: DateTime (nullable)
}

Circulation (related) {
  id: UUID
  userId: UUID
  bookId: UUID
  dueDate: DateTime
  returnDate: DateTime (nullable)
  type: ENUM (BORROW/RENT)
}
```

#### API Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/fines/my` | ✅ Required | Fetch user's fines |
| POST | `/fines/:id/pay` | ✅ Required | Mark fine as paid |
| POST | `/fines/calculate` | ✅ Required | Trigger recalculation |

#### Data Flow
1. Component mounts → `useEffect` triggers `fetchData()`
2. Frontend calls `GET /fines/my` with JWT token
3. Backend queries `prisma.fine.findMany()` for user's fines
4. Response includes circulation & book details
5. User clicks "Pay" → `POST /fines/:id/pay`
6. Backend validates ownership, marks as paid
7. User balance decremented, list refreshes

#### Key Functions (Backend)

**getUserFines(userId)**
```javascript
- Query fine table filtered by userId
- Include circulation & book details
- Sort by createdAt (DESC)
- Return array with enriched data
```

**payFine(fineId, userId)**
```javascript
- Verify fine exists & belongs to user
- Check if already paid
- Update isPaid = true
- Decrement user.fineBalance
- Increment user.totalFinesPaid
- Return updated fine record
```

### Frontend Component Structure (`MyFines.jsx`)

```
MyFines
├── State: fines[], loading
├── fetchData() → API call
├── handlePay(id) → Pay endpoint
├── useEffect → Initial load
└── UI:
    ├── Loading spinner
    ├── Fines table:
    │  ├── Amount
    │  ├── Book title
    │  ├── Status badge
    │  └── Pay button
    └── Empty state message
```

### Working Flow
1. User navigates to "My Fines" page
2. Component fetches `GET /fines/my`
3. Fines displayed in table format
4. User reviews amount and book title
5. Clicks "Pay" button for any fine
6. Payment processes via `POST /fines/:id/pay`
7. Fine marked as paid, balance updated
8. Table refreshes showing updated status

---

## 2. SUGGESTIONS / SUGGEST BOOK

### Overview
Community-driven book suggestion system allowing users to propose new books for the library. Includes voting and admin approval workflow.

### Features & Functionalities

#### User Features
- **Submit Suggestions**: Create new book suggestions with title, author, category, ISBN, description
- **Vote on Suggestions**: Upvote suggestions from other users
- **View All Suggestions**: Browse community suggestions with vote counts
- **View My Suggestions**: Track personal suggestions and their approval status
- **Real-time Voting**: Vote count updates immediately

#### Admin Features
- **Approve Suggestions**: Create book from approved suggestion
- **Reject Suggestions**: Decline suggestions with admin notes
- **Delete Suggestions**: Remove inappropriate suggestions
- **Voting Statistics**: View analytics on suggestion popularity
- **Admin Notes**: Add feedback when rejecting

### Tech Stack

#### Frontend
- **Framework**: React 18
- **Form Handling**: React hooks (useState)
- **Routing**: React Router for navigation
- **Styling**: Tailwind CSS
- **Notifications**: React-Toastify
- **Icons**: Lucide React (for visual feedback)

#### Backend
- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT with requireAdmin middleware
- **Business Logic**: Service pattern (suggestionService)

### Implementation Approach

#### Database Schema
```
Suggestion {
  id: UUID
  userId: UUID (foreign key)
  title: String
  author: String
  category: String
  isbn: String (nullable)
  description: Text
  status: ENUM (PENDING/APPROVED/REJECTED)
  voteCount: Integer (default: 0)
  adminNotes: Text (nullable)
  approvedBy: UUID (nullable)
  createdAt: DateTime
  updatedAt: DateTime
}

SuggestionVote {
  id: UUID
  suggestionId: UUID
  userId: UUID
  createdAt: DateTime
  UNIQUE(suggestionId, userId) // One vote per user per suggestion
}
```

#### API Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/suggestions` | ✅ Required | Create new suggestion |
| GET | `/suggestions/all` | ✅ Required | Fetch all suggestions |
| GET | `/suggestions/my` | ✅ Required | Fetch user's suggestions |
| POST | `/suggestions/vote/:id` | ✅ Required | Vote for suggestion |
| POST | `/suggestions/approve/:id` | ✅ Admin | Approve suggestion |
| POST | `/suggestions/reject/:id` | ✅ Admin | Reject suggestion |
| DELETE | `/suggestions/:id` | ✅ Admin | Delete suggestion |
| GET | `/suggestions/stats` | ✅ Admin | Get voting stats |

#### Data Flow

**Create Suggestion**
1. User fills form: title, author, category, description
2. Form validation (required fields)
3. Frontend calls `POST /suggestions` with form data
4. Backend creates Suggestion record with `status: PENDING`
5. Toast notification + redirect to suggestions list

**Vote on Suggestion**
1. User clicks vote button
2. System checks if user already voted (UNIQUE constraint)
3. Creates SuggestionVote record OR removes if toggling off
4. Vote count updated in real-time
5. UI reflects new vote count

**Admin Approval**
1. Admin navigates to suggestion
2. Reviews suggestion details & vote count
3. Clicks "Approve" with optional admin notes
4. System:
   - Updates suggestion.status = APPROVED
   - Creates book from suggestion data
   - Stores approvalBy = adminId
   - Notification to original suggester

### Frontend Components

**SuggestBook.jsx**
```
SuggestBook
├── Form state: title, author, description, isbn, category
├── Validation: Required fields
├── handleSubmit():
│  ├── POST /suggestions
│  ├── Toast success/error
│  └── Redirect to /suggestions
└── UI:
   ├── Input fields (title, author, category, isbn)
   ├── Textarea (why add this book)
   └── Submit button
```

**BookSuggestions.jsx**
```
BookSuggestions
├── State: suggestions[], myVotes[], loading
├── fetchSuggestions() → GET /suggestions/all
├── handleVote(id) → POST /suggestions/vote/:id
├── UI:
│  ├── Suggestion cards:
│  │  ├── Title & Author
│  │  ├── Category badge
│  │  ├── Description
│  │  ├── Vote count & button
│  │  ├── Status badge (PENDING/APPROVED)
│  │  └── Admin actions (approve/reject/delete)
│  └── Filter by status
```

### Working Flow
1. User clicks "Suggest Book"
2. Fills in suggestion form
3. Submits → `/suggestions` endpoint
4. Redirected to suggestions list
5. Community members vote on suggestion
6. Admin reviews suggestions with vote count
7. Admin approves → Creates book in catalog
8. Original suggester notified

---

## 3. ADMIN FEATURES (ADMIN PANEL)

### Overview
Central administrative control panel for managing library operations, users, content, and statistics.

### Features & Functionalities

#### Dashboard/Statistics
- **Library Statistics**: Total books, users, fines, circulation
- **Circulation Metrics**: Active borrows, overdue books
- **User Management**: View all users, create new users/admins
- **Fine Management**: View all fines, mark paid, halt accumulation

#### Core Admin Features
- **Book Management**: Add, edit, delete books
- **User Management**: Create users, assign admin roles
- **Organization Management**: Add/manage multiple library branches
- **Suggestion Approval**: Review and approve/reject suggestions
- **Fine Administration**: Override fine statuses

### Tech Stack

#### Frontend (Admin Pages)
- **React 18** with modern hooks
- **Tailwind CSS** for responsive design
- **React Router** for navigation
- **Lucide React** icons
- **Axios** for API calls

#### Backend
- **Express.js** routing
- **JWT Authentication** with requireAdmin middleware
- **Role-based Access Control (RBAC)**
- **Prisma ORM** for transactions

### Implementation Approach

#### Authentication & Authorization
```javascript
// Middleware chain for admin routes:
authenticate → requireAdmin → controller

authenticate: Verifies JWT token
requireAdmin: Checks user.role === 'ADMIN'
```

#### Admin Routes (`admin.js`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/admin/stats` | Dashboard statistics |
| GET | `/admin/orgs` | List organizations |
| POST | `/admin/orgs` | Create organization |

#### Admin Workflows

**User Creation**
- Admin navigates to "Manage Users"
- Fills form: name, email, password, role
- Backend creates user with hashed password
- Role assigned: USER or ADMIN
- New user can login immediately

**Fine Override**
- Admin views "Manage Fines"
- Can mark fine as paid manually
- Can halt fine accumulation for specific circulation
- Updates reflected in user's fine balance

**Book Management**
- Add digital book: PDF upload + metadata
- Add physical book: Shelf location + copy count
- Edit: All book properties (title, author, description, etc.)
- Delete: Remove from circulation
- PDF replacement: Upload new PDF for digital books

### Admin Features (`Users.jsx`)
```
Users Panel
├── User List Table:
│  ├── Name
│  ├── Email
│  ├── Role (USER/ADMIN)
│  ├── Fine Balance
│  └── Join Date
├── Add User Form:
│  ├── Name, Email, Password inputs
│  ├── Role checkbox (admin or user)
│  └── Create button
└── State: users[], loading, showForm
```

### Working Flow
1. Admin logs in (JWT token with role: ADMIN)
2. Access to admin panel
3. Views dashboard with statistics
4. Can manage users, books, fines
5. Approve/reject suggestions
6. Modify fine status
7. All changes logged & persisted

---

## 4. ADD BOOKS

### Overview
Feature for administrators to add new books to the library catalog. Supports both digital (PDF) and physical book formats.

### Features & Functionalities

#### Digital Books
- **PDF Upload**: Upload PDF file during book creation
- **Cover Image**: Optional cover image upload
- **Metadata**: Title, author, description, ISBN
- **Search**: Digital books indexed and searchable
- **PDF Viewing**: Users can read PDFs if borrowed

#### Physical Books
- **Copy Management**: Track available copies
- **Shelf Location**: Organize by shelf/section
- **ISBN Tracking**: Unique identifier
- **Metadata**: Full book information

### Tech Stack

#### Frontend
- **React 18** with form state management
- **React Router** for navigation
- **Tailwind CSS** with drag-drop UI
- **File Input**: Drag-drop or click-to-upload
- **FormData**: For multipart file upload

#### Backend
- **Multer**: File upload middleware
- **Supabase Storage**: Cloud file storage (PDFs, covers)
- **Sharp** (optional): Image resizing
- **Prisma**: Database persistence

### Implementation Approach

#### Upload Architecture

**Digital Book Upload Flow**
```
Frontend:
  FormData {
    title: String
    author: String
    description: String
    pdf: File (multipart)
    cover: File (optional)
  }
  ↓
POST /books/upload
  ↓
Backend:
  1. Validate file types
  2. Upload PDF to Supabase 'pdfs' bucket
  3. Upload cover to Supabase 'book-covers' bucket
  4. Generate public URLs
  5. Create book record in database
  ↓
Response:
  {
    id: UUID
    title: String
    pdfUrl: String (Supabase URL)
    coverUrl: String (Supabase URL)
    format: 'digital'
  }
```

**Physical Book Flow**
```
POST /books
  {
    title: String
    author: String
    format: 'physical'
    shelf_location: String
    available_copies: Number
  }
  ↓
Creates book without file upload
Tracks copy count
```

#### File Upload Middleware (`upload.js`)
```javascript
uploadBookAssets = multer({
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'pdf') {
      // Accept .pdf only
      if (file.mimetype === 'application/pdf') cb(null, true);
    } else if (file.fieldname === 'cover') {
      // Accept images
      if (file.mimetype.startsWith('image/')) cb(null, true);
    } else cb(new Error('Invalid file'));
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});
```

#### Supabase Integration
```javascript
// Upload to Supabase
const { data, error } = await supabaseAdmin.storage
  .from('pdfs')
  .upload(storagePath, fileBuffer, {
    contentType: 'application/pdf',
    upsert: false
  });

// Generate public URL
const publicUrl = supabaseAdmin.storage
  .from('pdfs')
  .getPublicUrl(storagePath).data.publicUrl;
```

### Database Schema
```
Book {
  id: UUID
  title: String
  author: String
  description: Text
  isbn: String
  format: ENUM (digital, physical, hybrid)
  pdfUrl: String (nullable)
  coverUrl: String (nullable)
  shelfLocation: String (nullable)
  availableCopies: Integer
  digitalCount: Integer (for hybrid)
  physicalCount: Integer (for hybrid)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Frontend Component (`AddBook.jsx`)

```
AddBook
├── State:
│  ├── bookType: 'digital' | 'physical'
│  ├── form: { title, author, description, ... }
│  ├── pdfFile, coverImage
│  ├── loading, isDragging
├── Methods:
│  ├── handleSubmit(e):
│  │  ├── If physical: POST /books with form
│  │  ├── If digital: FormData with files + POST /books/upload
│  │  ├── Show toast notification
│  │  └── Redirect to /books
│  ├── handleDrop(): Drag-drop file handling
│  └── handleFileSelect(): Click-to-select file
└── UI:
   ├── Book type toggle (Digital/Physical)
   ├── Form fields:
   │  ├── Title input
   │  ├── Author input
   │  ├── Description textarea
   │  ├── (Physical only) Shelf location, copy count
   │  └── (Digital only) PDF & Cover upload zones
   └── Submit button
```

### API Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/books` | ✅ Admin | Create physical book |
| POST | `/books/upload` | ✅ Admin | Upload digital book |
| PUT | `/books/:id/pdf` | ✅ Admin | Update book PDF |
| PUT | `/books/:id/cover` | ✅ Admin | Update book cover |

### Working Flow
1. Admin clicks "Add Book"
2. Selects book type (Digital/Physical)
3. For Digital:
   - Fills metadata (title, author, description)
   - Drags PDF file into upload zone
   - Optionally uploads cover image
   - Clicks Submit
4. Frontend validates files
5. Sends FormData to `/books/upload`
6. Backend uploads to Supabase
7. Creates book record with URLs
8. Redirects to book list
9. Book immediately available for borrowing

---

## 5. MANAGE FINES

### Overview
Comprehensive fine management system for administrators to view, control, and modify user fines.

### Features & Functionalities

#### Fine Overview
- **View All Fines**: List of all fines in system with details
- **User Fine Summary**: Outstanding fines grouped by user
- **Fine Details**: Amount, book, circulation dates, status

#### Fine Administration
- **Mark as Paid**: Override fine payment status (for manual payments)
- **Halt Fine Accumulation**: Stop charging daily fine for specific circulation
- **Fine Status**: Visual indicators for paid/unpaid
- **User Fine Balance**: Total outstanding fine amount per user

#### Fine Calculation
- **Automatic Recalculation**: Background job to compute daily fines
- **Configurable Rate**: Fine per day set via environment variable
- **Overdue Detection**: Auto-detects unreturned, overdue books
- **Fine Accumulation**: Updates fine amount daily

### Tech Stack

#### Frontend
- **React 18** hooks
- **Tailwind CSS** styling
- **Lucide React** icons
- **React-Toastify** notifications
- **Axios** HTTP client

#### Backend
- **Node.js + Express.js**
- **Prisma ORM** with transactions
- **PostgreSQL** database
- **Environment Variables**: Fine rate configuration

### Implementation Approach

#### Fine Calculation System

**Environment Configuration**
```
FINE_PER_DAY=5  # ₹5 per day overdue
```

**Calculation Algorithm**
```javascript
const finePerDay = parseFloat(process.env.FINE_PER_DAY) || 5;

// Find all unreturned, overdue borrows
const overdueCirculations = await prisma.circulation.findMany({
  where: {
    type: 'BORROW',
    returnDate: null,          // Not yet returned
    dueDate: { lt: now }       // Past due date
  }
});

// Calculate fine for each overdue borrow
for (const circ of overdueCirculations) {
  const daysOverdue = Math.ceil((now - circ.dueDate) / MS_PER_DAY);
  const expectedAmount = daysOverdue * finePerDay;
  
  // Update existing or create new fine
  if (existingFine) {
    update amount
  } else {
    create new fine
  }
}
```

#### Fine States & Transitions
```
ACTIVE (Unpaid)
  ↓
MARKED_PAID (Admin override)
  ↓
PAID (User payment)

Or:

ACTIVE → HALTED (No more accumulation)
```

#### Fine Service Functions

**getAllFines()**
```javascript
- Query all fine records
- Include circulation, book, user details
- Group by user
- Return:
  {
    fines: [ { id, amount, isPaid, circulation { ... } } ],
    usersWithFines: [ { id, name, fineBalance, totalFines } ]
  }
```

**markFinePaid(fineId, adminId)**
```javascript
- Find fine by ID
- Update isPaid = true
- Update user.fineBalance (decrement)
- Log admin action
- Return updated fine
```

**haltFine(circulationId)**
```javascript
- Find circulation record
- Mark as halted
- Stop future fine recalculation
- Return updated circulation
```

**calculateOverdueFines()**
```javascript
- Find all overdue, unreturned books
- For each:
  - Calculate days overdue
  - Compute fine amount
  - Update or create fine record
- Return results summary
```

#### API Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/fines/all` | ✅ Admin | Get all fines |
| PUT | `/fines/mark-paid/:id` | ✅ Admin | Mark fine as paid |
| PUT | `/fines/halt/:id` | ✅ Admin | Halt fine accumulation |
| POST | `/fines/calculate` | ✅ Admin | Trigger fine calculation |

### Frontend Component (`ManageFines.jsx`)

```
ManageFines
├── State:
│  ├── data: { fines, usersWithFines }
│  └── loading
├── Methods:
│  ├── fetchData() → GET /fines/all
│  ├── markPaid(id) → PUT /fines/mark-paid/:id
│  ├── haltFine(circId) → PUT /fines/halt/:id
└── UI:
   ├── Users with Outstanding Fines Section:
   │  ├── User name
   │  ├── Total fine balance
   │  ├── Button: "Halt all fines"
   └── Individual Fines Table:
      ├── Amount
      ├── Book title
      ├── User name
      ├── Status (Paid/Unpaid)
      ├── Button: "Mark Paid"
      └── Button: "Halt Fine"
```

### Database Relationships
```
User
  ↓ (1:M)
Circulation
  ├─ type: BORROW/RENT
  ├─ dueDate: When book is due
  ├─ returnDate: When returned (null if not)
  └─↓ (1:M)
     Fine
     ├─ amount: 5 * daysOverdue
     ├─ isPaid: Boolean
     └─ createdAt: When fine created
```

### Working Flow
1. Admin navigates to "Manage Fines"
2. Views:
   - Users with outstanding fines
   - Individual fine records
   - Amount and status
3. Can perform actions:
   - Mark fine as paid (e.g., for manual payment)
   - Halt fine accumulation (e.g., for waiver)
4. All changes reflected in user's fine balance
5. User sees updated balance in "My Fines"

---

## 6. CROSS-FEATURE INTEGRATION

### Authentication Flow
```
Login (JWT Token)
  ↓
Token stored in localStorage
  ↓
Axios interceptor:
  Authorization: Bearer {token}
  ↓
Sent with all requests
  ↓
Backend middleware (authenticate):
  - Verify token
  - Extract user.id
  - Add to req.user
  ↓
Admin checks (requireAdmin):
  - Check user.role === 'ADMIN'
  - Allow/deny access
```

### Data Dependencies
```
Book
 ├─ Used in: All Books, Book Details, Suggestions
 ├─ Admin Edit: Add Books, Manage Books
 └─ User Action: Borrow

Circulation
 ├─ Book + User
 ├─ Used in: My Borrowed Books, Fine Calculation
 ├─ Generates: Fines (if overdue)
 └─ Admin View: Manage Fines

Fine
 ├─ Based on: Circulation (overdue)
 ├─ User View: My Fines
 ├─ Admin View: Manage Fines
 ├─ User Action: Pay Fine
 └─ Admin Action: Override, Halt

Suggestion
 ├─ User Created
 ├─ Community Voted
 ├─ Admin Review: Approve → Create Book
 └─ Status: PENDING/APPROVED/REJECTED
```

### File Storage Architecture
```
Supabase Storage Buckets:
├─ book-covers/
│  └─ {uuid}-{cover-filename}.{ext}
├─ pdfs/
│  └─ {uuid}-{pdf-filename}.pdf
├─ charity-pdfs/
│  └─ {uuid}-{upload-filename}.pdf
└─ avatars/
   └─ {user-id}-avatar.{ext}

URL Pattern:
https://supabase.url/storage/v1/object/public/{bucket}/{path}
```

---

## 7. TECHNOLOGY ECOSYSTEM

### Frontend Stack
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.x |
| Vite | Build Tool | Latest |
| Tailwind CSS | Styling | 3.x |
| React Router | Routing | 6.x |
| Redux Toolkit | State Management | 1.x |
| Axios | HTTP Client | 1.x |
| React-Toastify | Notifications | Latest |
| Lucide React | Icons | Latest |

### Backend Stack
| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime | 18+ LTS |
| Express.js | Framework | 4.x |
| Prisma | ORM | Latest |
| PostgreSQL | Database | 13+ |
| Supabase | Auth & Storage | Cloud |
| Multer | File Upload | 1.x |
| JWT | Authentication | Via packages |
| CORS | Cross-Origin | Built-in |

---

## 8. SECURITY CONSIDERATIONS

### Authentication
- JWT tokens with expiration
- Secure password hashing
- Role-based access control (RBAC)

### Authorization
- requireAuth middleware for protected routes
- requireAdmin middleware for admin routes
- User ID validation in service layer

### Data Protection
- Parameterized queries (Prisma prevents SQL injection)
- File validation (MIME types, file size limits)
- CORS configured for allowed origins

### API Security
- Input validation via middleware
- Error handling without sensitive data leaks
- Rate limiting (optional future enhancement)

---

## 9. DEPLOYMENT & SCALABILITY

### Current Architecture
- **Frontend**: Deployed to Vercel/Netlify (or static hosting)
- **Backend**: Node.js server on port 3000
- **Database**: PostgreSQL (managed via Supabase)
- **Storage**: Supabase buckets for files
- **Environment**: Development with nodemon, Production with PM2

### Scalability Considerations
- Prisma connection pooling
- Stateless API design
- Distributed file storage (Supabase)
- Indexing on frequently queried columns:
  - Fine: circularationId, isPaid
  - Suggestion: status, voteCount
  - Circulation: userId, bookId, dueDate

---

## 10. FUTURE ENHANCEMENTS

### Planned Features
- Email notifications for overdue books/fines
- SMS payment reminders
- Advanced analytics dashboard
- Book recommendation engine using ML
- Mobile app (React Native)
- Payment gateway integration (Stripe/Razorpay)
- Audit logs for admin actions
- Fine waiver workflow

### Performance Optimizations
- Implement caching layer (Redis)
- Pagination for large datasets
- Background job queue (Bull/BullMQ)
- GraphQL API (alternative to REST)
- Elasticsearch for full-text search

---

## Conclusion

OpenShelf implements a comprehensive library management system with modern web technologies. Each feature is built with scalability, security, and user experience in mind. The modular architecture allows for easy additions and modifications, while maintaining clean separation of concerns between frontend and backend.

