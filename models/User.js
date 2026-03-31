// ============================================================
// models/User.js — User data structure
// This defines what a "User" looks like in the database.
// Every user that registers will be stored in this shape.
// ============================================================

const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    // The user's display name
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    // Email must be unique — no two accounts with same email
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // We never store the real password — only the hashed version
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    // User preferences — synced from frontend
    theme:  { type: String, default: 'dark' },
    energy: { type: String, default: null },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
)

// ── Hash password before saving ───────────────────────────────
// This runs automatically every time a user is saved.
// It replaces the plain password with a secure hash.
userSchema.pre('save', async function (next) {
  // Only hash if the password was changed (not on other updates)
  if (!this.isModified('password')) return next()

  // bcrypt turns "mypassword123" into something like "$2a$10$..."
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ── Method to check password on login ────────────────────────
// Usage: const isMatch = await user.matchPassword('enteredPassword')
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
