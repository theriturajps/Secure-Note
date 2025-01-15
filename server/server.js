require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully')
    console.log(
      'Connection URI:',
      process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//[REDACTED]:[REDACTED]@')
    )
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    console.error('Connection Details:', {
      uri: process.env.MONGODB_URI.replace(
        /\/\/.*:.*@/,
        '//[REDACTED]:[REDACTED]@'
      ),
      error: err.message,
      stack: err.stack,
    })
    process.exit(1) // Exit the process if DB connection fails
  })

// Routes
const noteRoutes = require('./routes/noteRoutes')
app.use('/api/notes', noteRoutes)

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
