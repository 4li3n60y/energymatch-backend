// ============================================================
// middleware/auth.js — Route protection
// This middleware runs BEFORE any protected route handler.
// It checks if the user has a valid JWT token in their cookie.
// If not, it blocks the request with a 401 error.
//
// Usage: add  protect  to any route you want to secure:
//   router.get('/tasks', protect, taskController.getTasks)
// ============================================================

const jwt  = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    // Read the token from the cookie (set during login)
    const token = req.cookies.token

    // If no token exists, the user is not logged in
    if (!token) {
      return res.status(401).json({ message: 'Not logged in. Please sign in.' })
    }

    // Verify the token is genuine and not expired
    // jwt.verify throws an error if the token is invalid
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find the user this token belongs to
    // We attach them to req.user so route handlers can use it
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists.' })
    }

    // All good — move on to the actual route handler
    next()

  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token. Please sign in again.' })
  }
}

module.exports = { protect }
