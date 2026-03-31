// ============================================================
// controllers/analyticsController.js — User stats
// Calculates productivity analytics for the logged-in user.
// This powers the Analytics page charts and stat cards.
// ============================================================

const Task = require('../models/Task')

// GET /api/analytics
const getAnalytics = async (req, res, next) => {
  try {
    // Get all tasks for this user
    const tasks = await Task.find({ userId: req.user._id })

    const total   = tasks.length
    const done    = tasks.filter(t => t.done).length
    const pending = tasks.filter(t => !t.done).length

    // Completion rate as a percentage
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

    // Count tasks by tier
    const byTier = {
      quick:  tasks.filter(t => t.tier === 'quick').length,
      medium: tasks.filter(t => t.tier === 'medium').length,
      deep:   tasks.filter(t => t.tier === 'deep').length,
    }

    // Tasks completed by tier
    const doneByTier = {
      quick:  tasks.filter(t => t.tier === 'quick'  && t.done).length,
      medium: tasks.filter(t => t.tier === 'medium' && t.done).length,
      deep:   tasks.filter(t => t.tier === 'deep'   && t.done).length,
    }

    // Tasks completed per day of the week (last 7 days)
    // Creates an array like [2, 5, 3, 6, 4, 2, 5] for Mon-Sun
    const weeklyData = Array(7).fill(0)
    const now = new Date()
    tasks.forEach(task => {
      if (!task.done || !task.updatedAt) return
      const daysDiff = Math.floor((now - new Date(task.updatedAt)) / (1000 * 60 * 60 * 24))
      if (daysDiff < 7) {
        weeklyData[6 - daysDiff] += 1
      }
    })

    res.json({
      total,
      done,
      pending,
      completionRate,
      byTier,
      doneByTier,
      weeklyData,
    })

  } catch (error) {
    next(error)
  }
}

module.exports = { getAnalytics }
