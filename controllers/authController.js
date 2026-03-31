// ============================================================
// controllers/authController.js — Register, Login, Logout
// Controllers contain the actual business logic.
// They receive a request, do something, and send a response.
// ============================================================

const jwt  = require('jsonwebtoken')
const User = require('../models/User')

// ── Helper: create a JWT token and set it as a cookie ────────
const sendTokenCookie = (res, userId) => {
  // Create a token that contains the user's ID
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  // Store the token in an httpOnly cookie
  // httpOnly = JavaScript cannot read it (safer than localStorage)
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  })
}

// ── REGISTER ─────────────────────────────────────────────────
// POST /api/auth/register
// Body: { name, email, password }
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' })
    }

    // Check if email is already registered
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' })
    }

    // Create the user — password is hashed automatically by the model
    const user = await User.create({ name, email, password })

    // Log them in immediately after registering
    sendTokenCookie(res, user._id)

    // Send back the user info (never send the password)
    res.status(201).json({
      user: {
        _id:    user._id,
        name:   user.name,
        email:  user.email,
        theme:  user.theme,
        energy: user.energy,
      }
    })

  } catch (error) {
    next(error) // Pass to global error handler
  }
}

// ── LOGIN ─────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password.' })
    }

    // Find the user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password.' })
    }

    // Check if the password matches
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password.' })
    }

    // Set the JWT cookie
    sendTokenCookie(res, user._id)

    // Send back user info
    res.json({
      user: {
        _id:    user._id,
        name:   user.name,
        email:  user.email,
        theme:  user.theme,
        energy: user.energy,
      }
    })

  } catch (error) {
    next(error)
  }
}

// ── LOGOUT ───────────────────────────────────────────────────
// POST /api/auth/logout
// Simply clears the cookie — no database action needed
const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Set expiry to past = deletes the cookie
  })
  res.json({ message: 'Logged out successfully.' })
}

module.exports = { register, login, logout }
