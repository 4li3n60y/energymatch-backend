// ============================================================
// routes/tasks.js — Task routes
// All routes here are PROTECTED — user must be logged in.
// The  protect  middleware checks the JWT cookie first.
// ============================================================

const express = require('express')
const router  = express.Router()
const { protect } = require('../middleware/auth')
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController')

// GET  /api/tasks      — get all tasks for logged-in user
// POST /api/tasks      — create a new task
router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask)

// PUT    /api/tasks/:id — update a specific task
// DELETE /api/tasks/:id — delete a specific task
router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask)

module.exports = router
