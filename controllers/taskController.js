// ============================================================
// controllers/taskController.js — CRUD for tasks
// All task operations: get, create, update, delete.
// Every operation is scoped to the logged-in user only —
// users can never see or touch each other's tasks.
// ============================================================

const Task = require('../models/Task')

// ── GET all tasks for the logged-in user ──────────────────────
// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    // req.user._id comes from the auth middleware
    // Only fetch tasks that belong to this user
    const tasks = await Task.find({ userId: req.user._id })
      .sort({ createdAt: 1 }) // Oldest first — for energy match algorithm

    res.json({ tasks })

  } catch (error) {
    next(error)
  }
}

// ── CREATE a new task ─────────────────────────────────────────
// POST /api/tasks
// Body: { text, tier, date }
const createTask = async (req, res, next) => {
  try {
    const { text, tier, date } = req.body

    if (!text || !tier) {
      return res.status(400).json({ message: 'Text and tier are required.' })
    }

    // Create the task and link it to the logged-in user
    const task = await Task.create({
      text,
      tier,
      date:   date || null,
      userId: req.user._id,
    })

    res.status(201).json({ task })

  } catch (error) {
    next(error)
  }
}

// ── UPDATE a task (toggle done, edit text, change tier) ───────
// PUT /api/tasks/:id
// Body: { done } or { text } or { tier } — send only what changed
const updateTask = async (req, res, next) => {
  try {
    // Find the task by ID
    const task = await Task.findById(req.params.id)

    // Check it exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' })
    }

    // Make sure this task belongs to the logged-in user
    // Prevents users from editing other people's tasks
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to edit this task.' })
    }

    // Update only the fields that were sent in the request
    const { text, tier, done, date } = req.body
    if (text  !== undefined) task.text  = text
    if (tier  !== undefined) task.tier  = tier
    if (done  !== undefined) task.done  = done
    if (date  !== undefined) task.date  = date

    // Save the updated task
    const updated = await task.save()
    res.json({ task: updated })

  } catch (error) {
    next(error)
  }
}

// ── DELETE a task ─────────────────────────────────────────────
// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' })
    }

    // Ownership check
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to delete this task.' })
    }

    await task.deleteOne()
    res.json({ message: 'Task deleted successfully.' })

  } catch (error) {
    next(error)
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask }
