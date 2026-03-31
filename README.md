# EnergyMatch — Backend API

Node.js + Express + MongoDB backend for the EnergyMatch app.

---

## Setup Instructions

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Create your .env file
Copy the example file and fill in your values:
```bash
cp .env.example .env
```
Then open `.env` and set your MONGO_URI and JWT_SECRET.

### Step 3 — Get your MongoDB URI
1. Go to https://www.mongodb.com/atlas
2. Create a FREE account
3. Create a FREE cluster (M0 — free forever)
4. Click "Connect" → "Drivers"
5. Copy the connection string
6. Paste it as MONGO_URI in your .env
7. Replace <password> with your actual password

### Step 4 — Run the server
```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

### Step 5 — Test it works
Open your browser and visit:
```
http://localhost:5000/api/health
```
You should see:
```json
{ "status": "OK", "message": "EnergyMatch API is running" }
```

---

## Project Structure

```
energymatch-backend/
├── server.js                  ← Entry point — starts the server
├── .env                       ← Your secrets (never commit this)
├── .env.example               ← Template for .env
├── config/
│   └── db.js                  ← MongoDB connection
├── middleware/
│   ├── auth.js                ← JWT cookie verification
│   └── errorHandler.js        ← Global error handler
├── models/
│   ├── User.js                ← User schema (name, email, password)
│   └── Task.js                ← Task schema (text, tier, done, date)
├── controllers/
│   ├── authController.js      ← Register, Login, Logout
│   ├── taskController.js      ← Get, Create, Update, Delete tasks
│   ├── analyticsController.js ← Stats and completion data
│   └── userController.js      ← Get and update user profile
└── routes/
    ├── auth.js                ← POST /api/auth/*
    ├── tasks.js               ← GET/POST/PUT/DELETE /api/tasks
    ├── analytics.js           ← GET /api/analytics
    └── users.js               ← GET/PUT /api/users/me
```

---

## API Endpoints

| Method   | Endpoint              | Protected | Description                  |
|----------|-----------------------|-----------|------------------------------|
| POST     | /api/auth/register    | No        | Create new account           |
| POST     | /api/auth/login       | No        | Sign in                      |
| POST     | /api/auth/logout      | No        | Clear session cookie         |
| GET      | /api/tasks            | Yes       | Get all tasks for user       |
| POST     | /api/tasks            | Yes       | Create a new task            |
| PUT      | /api/tasks/:id        | Yes       | Update a task                |
| DELETE   | /api/tasks/:id        | Yes       | Delete a task                |
| GET      | /api/analytics        | Yes       | Get productivity stats       |
| GET      | /api/users/me         | Yes       | Get current user profile     |
| PUT      | /api/users/me         | Yes       | Update profile/theme/energy  |
