// ============================================================
// controllers/userController.js — User profile management
// Handles getting and updating the logged-in user's profile.
// This is also used by App.jsx on startup to check if the
// user is still logged in (the auth check on page load).
// ============================================================

const User = require('../models/User')

// ── GET current user profile ──────────────────────────────────
// GET /api/users/me
// Used by App.jsx on every page load to restore the session
const getMe = async (req, res, next) => {
  try {
    // req.user is set by the auth middleware
    // We just return it — no DB call needed (already fetched in middleware)
    res.json({
      user: {
        _id:    req.user._id,
        name:   req.user.name,
        email:  req.user.email,
        theme:  req.user.theme,
        energy: req.user.energy,
      }
    })
  } catch (error) {
    next(error)
  }
}

// ── UPDATE user profile ───────────────────────────────────────
// PUT /api/users/me
// Body: { name } or { theme } or { energy } — send only what changed
const updateMe = async (req, res, next) => {
  try {
    const { name, theme, energy } = req.body

    // Find the user and update their fields
    const user = await User.findById(req.user._id)

    if (name   !== undefined) user.name   = name
    if (theme  !== undefined) user.theme  = theme
    if (energy !== undefined) user.energy = energy

    const updated = await user.save()

    res.json({
      user: {
        _id:    updated._id,
        name:   updated.name,
        email:  updated.email,
        theme:  updated.theme,
        energy: updated.energy,
      }
    })

  } catch (error) {
    next(error)
  }
}

module.exports = { getMe, updateMe }
