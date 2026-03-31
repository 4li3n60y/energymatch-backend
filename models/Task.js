// ============================================================
// models/Task.js — Task data structure
// This defines what a "Task" looks like in the database.
// Every task belongs to a specific user via the userId field.
// ============================================================

const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    // The task description e.g. "Reply to emails"
    text: {
      type: String,
      required: [true, 'Task text is required'],
      trim: true,
      maxlength: [200, 'Task text cannot exceed 200 characters'],
    },

    // Energy tier — must be one of these three values
    tier: {
      type: String,
      enum: ['quick', 'medium', 'deep'],
      required: [true, 'Tier is required'],
    },

    // Whether the task is completed
    done: {
      type: Boolean,
      default: false,
    },

    // Optional date the task is scheduled for (from Calendar page)
    // Stored as a string e.g. "2024-03-15"
    date: {
      type: String,
      default: null,
    },

    // Which user this task belongs to
    // References the User model — this is the link between the two
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    // createdAt is used for the "oldest first" matching algorithm
    timestamps: true,
  }
)

module.exports = mongoose.model('Task', taskSchema)
