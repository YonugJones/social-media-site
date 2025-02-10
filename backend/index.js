require('dotenv').config()
const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRoute')
const postRouter = require('./routes/postRoute')

// Define the main app
const app = express()

// Built in Middleware for JSON
app.use(express.json())

// Built in Middleware to Handle Urlencoded Form Data
app.use(express.urlencoded({ extended: true }))

// middleware for cookies
app.use(cookieParser())

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend API' })
})
app.use('/auth', authRouter)
app.use('/posts', postRouter)

// Global Error Handler
app.use(errorHandler)

// Start server
const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`))