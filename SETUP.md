# Node.js + PostgreSQL + JWT Auth Setup Guide

Complete step-by-step guide to run this Node.js REST API with PostgreSQL and JWT authentication.

---

## 1. Project Structure

```text
Node.js/
  config/
    db.js                        # PostgreSQL connection pool
  scripts/
    create-users-table.js        # Database migration script
  src/
    app.js                       # Express app setup
    controllers/
      health.controller.js       # Health check handlers
      user.controller.js         # Register / Login handlers
    middleware/
      auth.middleware.js         # JWT authentication middleware
    models/
    routes/
      index.js                   # Route aggregator
      health.routes.js           # /api/health routes
      user.route.js              # /api/users routes
    services/
      health.service.js          # DB health check logic
      user.service.js            # User DB queries
  .env                           # Environment variables (never commit)
  .env.example                   # Safe template to share
  .gitignore
  index.js                       # Server entry point
  package.json
```

---

## 2. Install Dependencies

```bash
npm install
```

| Package | Purpose |
|---|---|
| `express` | HTTP server |
| `pg` | PostgreSQL client |
| `dotenv` | Load `.env` variables |
| `bcryptjs` | Hash and verify passwords |
| `jsonwebtoken` | Sign and verify JWT tokens |
| `nodemon` *(dev)* | Auto-restart on file changes |

---

## 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Full `.env` reference

```env
PORT=3000

# PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=node
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=your_generated_secret_here
JWT_EXPIRES_IN=1d
```

### Generate a secure JWT_SECRET

Run this command and paste the output as `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Example output (use your own — never reuse this):
```
a548c4887c520e1285e00226e8a767a3214e5236d7c595b49a4c10dd1fb759e3c45d09da3b7f36480eaa93bb02a75b54abc471c6d1dff9ab7e8db236f2246a78
```

> **Important:** Keep `JWT_SECRET` secret and never commit `.env` to version control.

---

## 4. Prepare PostgreSQL Database

Create the database if it does not exist.

### Option A: psql

```sql
CREATE DATABASE node;
```

### Option B: pgAdmin

1. Open pgAdmin.
2. Right-click **Databases** → **Create** → **Database**.
3. Enter `node` as the name and save.

---

## 5. Run Database Migration

Creates the `users` table (safe to run multiple times):

```bash
npm run db:migrate
```

This creates the following table:

```sql
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. Start the Server

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Server starts at: `http://localhost:3000`

On startup you will see:
```
PostgreSQL connected successfully.
Server is running on http://localhost:3000
```

---

## 7. API Endpoints

### Health

| Method | URL | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | API status |
| GET | `/api/health/db` | No | DB connection status |

### Users / Auth

| Method | URL | Auth | Description |
|---|---|---|---|
| POST | `/api/users/register` | No | Create new account |
| POST | `/api/users/login` | No | Login, returns JWT token |
| GET | `/api/users/me` | Bearer token | Get current user |

---

## 8. Auth Flow

```
1. POST /api/users/register  → creates user with bcrypt-hashed password
2. POST /api/users/login     → verifies password, returns JWT token
3. GET  /api/users/me        → sends token in Authorization header → get profile
```

---

## 9. Example Requests

### Register

```http
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
  "username": "chantha",
  "email": "chantha@example.com",
  "password": "secret123"
}
```

Response:
```json
{
  "status": "ok",
  "data": { "id": 1, "username": "chantha", "email": "chantha@example.com" }
}
```

### Login

```http
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "email": "chantha@example.com",
  "password": "secret123"
}
```

Response:
```json
{
  "status": "ok",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "username": "chantha", "email": "chantha@example.com" }
}
```

### Get Profile (Protected)

```http
GET http://localhost:3000/api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "status": "ok",
  "data": { "id": 1, "email": "chantha@example.com", "iat": 1234567890, "exp": 1234654290 }
}
```

---

## 10. npm Scripts Reference

```bash
npm run dev         # Start with nodemon (development)
npm start           # Start with node (production)
npm run db:migrate  # Create database tables
```

---

## 11. Troubleshooting

| Error | Fix |
|---|---|
| `password authentication failed` | Check `DB_USERNAME` / `DB_PASSWORD` in `.env` |
| `database "node" does not exist` | Run `CREATE DATABASE node;` in psql |
| `ECONNREFUSED 127.0.0.1:5432` | Start PostgreSQL service |
| `JsonWebTokenError: invalid signature` | Check `JWT_SECRET` is the same one used to sign the token |
| `TokenExpiredError` | Token has expired — login again to get a new one |
| `No token provided` | Add `Authorization: Bearer <token>` header to the request |
