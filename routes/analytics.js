// ============================================================
// routes/analytics.js — Analytics routes
// PROTECTED — user must be logged in.
// ============================================================

const express = require('express')
const router  = express.Router()
const { protect }      = require('../middleware/auth')
const { getAnalytics } = require('../controllers/analyticsController')

// GET /api/analytics — returns stats for the logged-in user
router.get('/', protect, getAnalytics)

module.exports = router
