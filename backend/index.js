require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// Define the main app
const app = express()

// Built in Middleware for JSON
app.use(express.json())

// Built in Middleware to Handle Urlencoded Form Data
app.use(express.urlencoded({ extended: true }))

// middleware for cookies
app.use(cookieParser())

// Start server
const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`))