// ============================================================
// server.js — The entry point of the entire backend
// This file starts Express, connects to MongoDB, and
// registers all the routes. Think of it as the "main hub".
// ============================================================

const express      = require('express')
const cors         = require('cors')
const cookieParser = require('cookie-parser')
const dotenv       = require('dotenv')
const connectDB    = require('./config/db')

// Load environment variables from .env file
dotenv.config()

// Connect to MongoDB
connectDB()

// Create the Express app
const app = express()

// ── Middleware ────────────────────────────────────────────────
// These run on EVERY request before it reaches a route

// Allow requests from your React frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // allows cookies to be sent
}))

// Parse incoming JSON request bodies (so we can read req.body)
app.use(express.json())

// Parse cookies (so we can read the JWT token from cookies)
app.use(cookieParser())

// ── Routes ───────────────────────────────────────────────────
// Each route file handles a specific part of the API

app.use('/api/auth',      require('./routes/auth'))
app.use('/api/tasks',     require('./routes/tasks'))
app.use('/api/analytics', require('./routes/analytics'))
app.use('/api/users',     require('./routes/users'))

// ── Health check ─────────────────────────────────────────────
// Visit http://localhost:5000/api/health to confirm server runs
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EnergyMatch API is running' })
})

// ── Global error handler ──────────────────────────────────────
// This catches any error thrown anywhere in the app
app.use(require('./middleware/errorHandler'))

// ── Start the server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅  Server running on http://localhost:${PORT}`)
})
