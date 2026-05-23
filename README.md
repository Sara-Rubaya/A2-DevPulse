# 🚀 DevPulse — Internal Tech Issue & Feature Tracker

A collaborative REST API platform for software teams to report bugs, suggest features, and coordinate resolutions. Built with Node.js, TypeScript, Express, and PostgreSQL.

---

## 🌐 Live URL

```
https://a2-dev-pulse.vercel.app/
```

---

## ✨ Features

- 🔐 JWT-based authentication (signup & login)
- 👥 Role-based access control (`contributor` / `maintainer`)
- 🐛 Full CRUD for issues (`bug` / `feature_request`)
- 🔍 Filter by `type` and `status`; sort by `newest` or `oldest`
- 👤 Reporter details fetched without SQL JOINs (batch query)
- 🔒 Passwords never exposed in any response
- ⚡ Raw SQL with `pg` driver — no ORM, no query builder

---

## 🛠️ Tech Stack

| Technology | Details |
|---|---|
| Node.js | LTS 24.x runtime |
| TypeScript | v5.x strict mode |
| Express.js | Modular router architecture |
| PostgreSQL | Native `pg` driver, raw SQL only |
| bcryptjs | Password hashing (salt rounds: 10) |
| jsonwebtoken | JWT generation & verification |
| http-status-codes | Consistent HTTP status codes |

---

## 📁 Project Structure

```
src/
├── config/
│   └── index.ts              # Environment variables
├── db/
│   └── index.ts              # DB pool + table initialization
├── middleware/
│   ├── auth.ts               # JWT verify + role check
│   ├── globalErrorHandler.ts # Centralized error handler
│   ├── index.d.ts            # Express Request type extension
│   └── logger.ts             # Request logger
├── modules/
│   ├── auth/
│   │   ├── auth.interface.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.route.ts
│   └── issues/
│       ├── issues.interface.ts
│       ├── issues.service.ts
│       ├── issues.controller.ts
│       └── issues.route.ts
├── types/
│   └── index.ts              # Shared types & role constants
├── utility/
│   └── sendResponse.ts       # Unified response formatter
├── app.ts                    # Express app setup
└── server.ts                 # Entry point
```

---

## ⚙️ Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/devpulse.git
cd devpulse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```bash
cp .env.example .env
```

Fill in the values:
```env
PORT=5000
CONNECTIONSTRING=postgresql://user:password@host/devpulse
JWT_SECRET=your_jwt_secret_here
```

### 4. Run in development
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
npm start
```

---

## 🌐 API Endpoints

### Base URL
```
http://localhost:5000
```

### 🔐 Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login & receive JWT token |

#### POST `/api/auth/signup`
```json
// Request Body
{
  "name": "John Doe",
  "email": "john@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}

// Response 201
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@devpulse.com",
    "role": "contributor",
    "created_at": "2026-01-20T09:00:00Z",
    "updated_at": "2026-01-20T09:00:00Z"
  }
}
```

#### POST `/api/auth/login`
```json
// Request Body
{
  "email": "john@devpulse.com",
  "password": "securePassword123"
}

// Response 200
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@devpulse.com",
      "role": "contributor",
      "created_at": "2026-01-20T09:00:00Z",
      "updated_at": "2026-01-20T09:00:00Z"
    }
  }
}
```

---

### 📋 Issues

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/issues` | Authenticated | Create new issue |
| GET | `/api/issues` | Public | Get all issues |
| GET | `/api/issues/:id` | Public | Get single issue |
| PATCH | `/api/issues/:id` | Authenticated | Update issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete issue |

#### POST `/api/issues`
```
Header: Authorization: <JWT_TOKEN>
```
```json
// Request Body
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}

// Response 201
{
  "success": true,
  "message": "Issue created successfully",
  "data": {
    "id": 45,
    "title": "Database connection timeout under load",
    "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
    "type": "bug",
    "status": "open",
    "reporter_id": 1,
    "created_at": "2026-01-20T10:30:00Z",
    "updated_at": "2026-01-20T10:30:00Z"
  }
}
```

#### GET `/api/issues` — Query Parameters

| Param | Values | Default |
|---|---|---|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | — |
| `status` | `open`, `in_progress`, `resolved` | — |

```
GET /api/issues?sort=newest
GET /api/issues?type=bug
GET /api/issues?status=open
GET /api/issues?type=bug&status=open&sort=oldest
```

```json
// Response 200
{
  "success": true,
  "message": "Issues retrieved successfully",
  "data": [
    {
      "id": 45,
      "title": "Database connection timeout under load",
      "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
      "type": "bug",
      "status": "open",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      },
      "created_at": "2026-01-20T10:30:00Z",
      "updated_at": "2026-01-20T14:45:00Z"
    }
  ]
}
```

#### PATCH `/api/issues/:id`
```
Header: Authorization: <JWT_TOKEN>
```
```json
// Request Body (all fields optional)
{
  "title": "Updated: Database pool exhaustion fix needed",
  "description": "Updated description with reproduction steps added here",
  "type": "bug"
}
```

> **Permission rules:**
> - `maintainer` → can update any issue
> - `contributor` → only own issue AND only if `status` is `open`

#### DELETE `/api/issues/:id`
```
Header: Authorization: <JWT_TOKEN>
```
> Only `maintainer` role can delete issues.

---

## 🗄️ Database Schema

### `users` table
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| password | TEXT | NOT NULL, never returned |
| role | VARCHAR(20) | `contributor` \| `maintainer` |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### `issues` table
| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| title | VARCHAR(150) | NOT NULL, max 150 chars |
| description | TEXT | NOT NULL, min 20 chars |
| type | VARCHAR(20) | `bug` \| `feature_request` |
| status | VARCHAR(20) | `open` \| `in_progress` \| `resolved` |
| reporter_id | INT | NOT NULL, app-level validation |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

---

## 🚨 Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": {}
}
```

| Status Code | Meaning |
|---|---|
| 400 | Bad Request — validation error |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient role |
| 404 | Not Found — resource doesn't exist |
| 409 | Conflict — e.g. editing a resolved issue |
| 500 | Internal Server Error |

---

## 👥 Roles & Permissions

| Action | contributor | maintainer |
|---|---|---|
| Register & Login | ✅ | ✅ |
| Create issue | ✅ | ✅ |
| View all issues | ✅ | ✅ |
| Update own issue (status=open) | ✅ | ✅ |
| Update any issue | ❌ | ✅ |
| Delete any issue | ❌ | ✅ |

---

## 🔐 Authentication

Send the JWT token in the `Authorization` header (no `Bearer` prefix):

```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImNvbnRyaWJ1dG9yIiwiaWF0IjoxNzc5NTEwNjk1LCJleHAiOjE3Nzk1OTcwOTV9.6N_-Av1_gFlFhm3Se2rijVJtfUBj5iCuuNxt9Ci-dLE
```

---

*Built with ❤️ for the DevPulse assignment — B7A2*
