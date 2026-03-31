// ============================================================
// config/db.js — MongoDB connection
// This file connects our app to the MongoDB Atlas database.
// It is called once when the server starts.
// ============================================================

const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`✅  MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌  MongoDB connection failed: ${error.message}`)
    process.exit(1) // Stop the server if DB fails to connect
  }
}

module.exports = connectDB
