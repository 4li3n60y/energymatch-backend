// ============================================================
// routes/auth.js — Authentication routes
// These are PUBLIC routes — no login required to access them.
// ============================================================

const express = require('express')
const router  = express.Router()
const { register, login, logout } = require('../controllers/authController')

// POST /api/auth/register — create a new account
router.post('/register', register)

// POST /api/auth/login — sign in to existing account
router.post('/login', login)

// POST /api/auth/logout — clear the session cookie
router.post('/logout', logout)

module.exports = router
