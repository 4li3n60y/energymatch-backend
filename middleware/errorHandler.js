// ============================================================
// middleware/errorHandler.js — Global error handler
// If ANY route throws an error, it ends up here.
// This prevents the server from crashing and sends a clean
// JSON error response to the frontend instead.
// ============================================================

const errorHandler = (err, req, res, next) => {
  // Log the full error in the terminal for debugging
  console.error('❌ Error:', err.message)

  // Default to 500 (Internal Server Error) if no status set
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500

  // Handle MongoDB duplicate key error (e.g. email already exists)
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'An account with this email already exists.',
    })
  }

  // Handle MongoDB validation errors (e.g. required field missing)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ message: messages.join(', ') })
  }

  // Handle invalid MongoDB ID format
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format.' })
  }

  // Generic error response
  res.status(statusCode).json({
    message: err.message || 'Something went wrong on the server.',
  })
}

module.exports = errorHandler
