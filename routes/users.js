// ============================================================
// routes/users.js — User profile routes
// PROTECTED — user must be logged in.
// ============================================================

const express = require('express')
const router  = express.Router()
const { protect }       = require('../middleware/auth')
const { getMe, updateMe } = require('../controllers/userController')

// GET /api/users/me — get current user (used for session restore on page load)
// PUT /api/users/me — update name, theme, or energy preference
router.route('/me')
  .get(protect, getMe)
  .put(protect, updateMe)

module.exports = router
