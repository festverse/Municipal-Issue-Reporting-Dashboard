# 🏛️ Municipal Issue Reporting Dashboard

A production-grade, full-stack web application that enables citizens to report municipal infrastructure issues via an interactive geolocation map, and provides engineers with a real-time dashboard to track, manage, and resolve tickets - complete with transactional data integrity and comprehensive audit logging.

**Built to demonstrate professional full-stack engineering practices** including layered backend architecture, ACID-compliant transactions, role-based access control, and premium UI/UX design.

---

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## ✨ Key Features

### Citizen Portal
- 📍 **Interactive Geolocation Mapping** — Pinpoint exact issue locations on a dark-themed CartoDB map
- 📝 **Rich Issue Reporting** — Categorized submissions with priority levels and zone selection
- 🔔 **Real-time Feedback** — Toast notifications and form validation

### Engineer Dashboard
- 📊 **Analytics Overview** — Animated stat cards with live metrics and resolution time tracking
- 🔍 **Advanced Filtering** — Filter by status, zone, category, priority + full-text search
- 📋 **Ticket Management** — Status transitions with mandatory audit notes via transactional updates
- 📈 **Visual Analytics** — CSS-based charts for status distribution, zone breakdown, and priority analysis
- ⏱️ **Activity Timeline** — Complete audit trail showing every action on every ticket

### Backend Engineering
- 🏗️ **Layered Architecture** — Routes → Controllers → Services with clean separation of concerns
- 🔐 **JWT Authentication** — Secure token-based auth with bcrypt password hashing
- 🛡️ **Role-Based Access Control** — CITIZEN, ENGINEER, ADMIN roles with route-level restrictions
- ⚡ **ACID Transactions** — Status updates wrapped in PostgreSQL transactions with `SELECT FOR UPDATE`
- 📝 **Immutable Audit Trail** — Every ticket action logged with user, timestamp, old/new state, and notes
- 🚨 **Professional Error Handling** — Custom AppError class, centralized error middleware, input validation
- 📡 **RESTful API Design** — Consistent response formats, proper HTTP status codes, pagination support

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                 │
│  ┌─────────┐ ┌───────────┐ ┌──────────┐ ┌────────────┐   │
│  │  Auth   │ │  Ticket   │ │Dashboard │ │ Analytics  │   │
│  │ Context │ │   Form    │ │  + Table │ │   Panel    │   │
│  └────┬────┘ └─────┬─────┘ └────┬─────┘ └─────┬──────┘   │
│       └──────────┬─┴────────────┴─────────────┘          │
│            API Client (JWT Bearer Token)                 │
└──────────────────┬───────────────────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼───────────────────────────────────────┐
│              Express.js Backend (Node.js)                │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Middleware: Helmet │ CORS │ Morgan │ Auth │ Validate│ │
│  └──────────────────────────┬──────────────────────────┘ │
│  ┌─────────┐ ┌──────────────▼──┐ ┌───────────────────┐   │
│  │ Routes  │→│  Controllers    │→│    Services       │   │
│  │ /auth   │ │ auth.controller │ │ auth.service (JWT)│   │
│  │ /tickets│ │ ticket.ctrl     │ │ audit.service     │   │
│  │ /zones  │ │ analytics.ctrl  │ │                   │   │
│  └─────────┘ └────────┬────────┘ └───────────────────┘   │
│              ┌────────▼────────┐                         │
│              │ Error Handler   │                         │
│              │ (AppError)      │                         │
│              └─────────────────┘                         │
└──────────────────┬───────────────────────────────────────┘
                   │ node-postgres (pg)
┌──────────────────▼───────────────────────────────────────┐
│                PostgreSQL Database                       │
│  ┌────────┐ ┌─────────┐ ┌───────────────────┐            │
│  │ users  │ │ tickets │ │ ticket_activities │            │
│  │ zones  │ │ (ENUM   │ │ (Audit Trail)     │            │
│  │ cats   │ │ status) │ │                   │            │
│  └────────┘ └─────────┘ └───────────────────┘            │
│  Triggers: auto-update timestamps, resolved_at           │
│  Indexes: composite + GIN full-text search               │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
municipal-dashboard/
├── database/                    # Database design and initialization
│   ├── schema.sql               # PostgreSQL DDL (Tables, ENUMs, Triggers, Indexes)
│   └── seed.sql                 # Demo data (users, tickets, audit logs)
├── server/                      # Node.js REST API
│   ├── index.js                 # Entry point with graceful shutdown
│   ├── app.js                   # Express app configuration & middleware
│   ├── config/
│   │   └── db.js                # PostgreSQL pool configuration
│   ├── middleware/
│   │   ├── auth.js              # JWT verification & role-based access
│   │   ├── errorHandler.js      # Centralized error handling
│   │   ├── validate.js          # Request validation (express-validator)
│   │   └── requestLogger.js     # HTTP request logging
│   ├── routes/                  # Route definitions with validation
│   ├── controllers/             # Business logic handlers
│   ├── services/                # Reusable service layer
│   │   ├── auth.service.js      # JWT + bcrypt operations
│   │   └── audit.service.js     # Audit trail logging
│   ├── utils/                   # Shared utilities
│   │   ├── AppError.js          # Custom error class
│   │   └── catchAsync.js        # Async error wrapper
│   └── .env.example             # Environment variable template
├── client/                      # React (Vite) Frontend
│   ├── src/
│   │   ├── api/client.js        # Centralized API client with JWT
│   │   ├── context/             # React context (Auth, Toast)
│   │   ├── hooks/               # Custom hooks
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   ├── layout/          # Navbar, ProtectedRoute
│   │   │   ├── Login.jsx        # JWT authentication
│   │   │   ├── Register.jsx     # User registration
│   │   │   ├── TicketForm.jsx   # Issue reporting with map
│   │   │   ├── Dashboard.jsx    # Engineer management panel
│   │   │   ├── TicketDetail.jsx # Full ticket view + timeline
│   │   │   └── AnalyticsPanel.jsx # Visual analytics
│   │   ├── App.jsx              # Routing & providers
│   │   └── index.css            # Design system & animations
│   └── .env.example             # Environment variable template
├── docker-compose.yml           # PostgreSQL + pgAdmin for local dev
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and npm
- **PostgreSQL** 14+ (local, Docker, or cloud — Neon/Supabase/Railway)
- **Docker** (optional, for easiest setup)

### Option A: Docker Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/municipal-dashboard.git
cd municipal-dashboard

# 2. Start PostgreSQL + pgAdmin via Docker
docker-compose up -d

# 3. Set up the backend
cd server
cp .env.example .env    # Uses Docker Postgres URL by default
npm install
npm run dev

# 4. Set up the frontend (in a new terminal)
cd client
cp .env.example .env
npm install
npm run dev
```

### Option B: Manual PostgreSQL Setup

```bash
# 1. Create the database
psql -U postgres -c "CREATE DATABASE municipal_dashboard;"

# 2. Run schema and seed scripts
psql -U postgres -d municipal_dashboard -f database/schema.sql
psql -U postgres -d municipal_dashboard -f database/seed.sql

# 3. Configure and start the backend
cd server
cp .env.example .env
# Edit .env with your PostgreSQL connection string
npm install
npm run dev

# 4. Start the frontend
cd client
cp .env.example .env
npm install
npm run dev
```

### Access Points
| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| pgAdmin (Docker) | http://localhost:5050 |

### Demo Credentials
| Role | Email | Password |
|---|---|---|
| Citizen | citizen@demo.com | citizen123 |
| Engineer | engineer@demo.com | engineer123 |
| Admin | admin@demo.com | admin123 |

> **Note:** Demo passwords in seed.sql are pre-hashed. To use them, you must register fresh accounts through the UI or rehash with the same bcrypt salt rounds configured in the backend.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Register a new user |
| `POST` | `/api/auth/login` | — | Login and receive JWT |
| `GET` | `/api/auth/me` | 🔒 Bearer | Get current user profile |

### Tickets
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/tickets` | 🔒 Citizen | Create a new ticket |
| `GET` | `/api/tickets` | — | List tickets (with filters & pagination) |
| `GET` | `/api/tickets/:id` | — | Get ticket details + activity timeline |
| `PATCH` | `/api/tickets/:id/status` | 🔒 Engineer/Admin | Update status (transactional) |

### Reference Data
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/zones` | — | List all administrative zones |
| `GET` | `/api/categories` | — | List all issue categories |

### Analytics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/analytics/summary` | — | Dashboard summary metrics |
| `GET` | `/api/analytics/by-zone` | — | Ticket counts by zone |
| `GET` | `/api/analytics/by-status` | — | Ticket counts by status |
| `GET` | `/api/analytics/recent-activity` | — | Last 20 audit trail entries |

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health status |

---

## 🗄️ Database Schema

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │     tickets      │       │    zones     │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (UUID)    │◄──┐   │ id (UUID)        │   ┌──►│ id (SERIAL)  │
│ email        │   ├───│ citizen_id (FK)  │   │   │ zone_name    │
│ password_hash│   │   │ assigned_eng (FK)│───┘   │ description  │
│ full_name    │   │   │ category_id (FK) │───┐   └──────────────┘
│ phone        │   │   │ zone_id (FK)     │   │
│ role (ENUM)  │   │   │ title            │   │   ┌──────────────┐
│ created_at   │   │   │ description      │   └──►│ categories   │
└──────────────┘   │   │ lat/lng          │       ├──────────────┤
                   │   │ status (ENUM)    │       │ id (SERIAL)  │
┌──────────────┐   │   │ priority (ENUM)  │       │ name         │
│ activities   │   │   │ created_at       │       │ priority_def │
├──────────────┤   │   │ updated_at       │       └──────────────┘
│ id (SERIAL)  │   │   │ resolved_at      │
│ ticket_id(FK)│───┘   └──────────────────┘
│ user_id (FK) │
│ activity_type│
│ old_status   │
│ new_status   │
│ note         │
│ created_at   │
└──────────────┘
```

---

## 🔒 Transaction Management

The most critical backend operation — updating a ticket's status — demonstrates ACID-compliant transaction management:

```javascript
// 1. Acquire a dedicated client from the connection pool
const client = await pool.connect();

try {
  await client.query('BEGIN');                        // Start transaction
  
  // 2. Lock the ticket row to prevent concurrent modifications
  const ticket = await client.query(
    'SELECT status FROM tickets WHERE id = $1 FOR UPDATE', [id]
  );

  // 3. Update the ticket status
  await client.query(
    'UPDATE tickets SET status = $1 WHERE id = $2', [newStatus, id]
  );

  // 4. Write immutable audit log entry
  await client.query(
    'INSERT INTO ticket_activities (...) VALUES (...)', [...]
  );

  await client.query('COMMIT');                      // Commit atomically
} catch (error) {
  await client.query('ROLLBACK');                    // Rollback on ANY failure
  throw error;
} finally {
  client.release();                                  // Always return to pool
}
```

This ensures that **either both** the status update and audit log succeed, **or neither** does — guaranteeing data integrity.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4 | Reactive UI with modern tooling |
| **Maps** | React-Leaflet, CartoDB Tiles | Interactive geolocation mapping |
| **Backend** | Node.js, Express.js | RESTful API server |
| **Auth** | JWT, bcrypt | Secure authentication & authorization |
| **Database** | PostgreSQL, node-postgres | Relational data with ACID guarantees |
| **Validation** | express-validator | Request input validation |
| **Security** | Helmet, CORS, Rate Limiting | HTTP security headers & protection |
| **DevOps** | Docker Compose | Local development environment |

---

## 📄 License

© 2026 [Utsav Vasava](https://festverse.in). All Rights Reserved.
