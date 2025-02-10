require('dotenv').config()
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')

const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomError('Unauthorized: no token provided', 401)
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new CustomError('Server error: ACCESS_TOKEN_SECRET not defined', 500)
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new CustomError('Unauthorized: token has expired', 403)
    } else {
      throw new CustomError('Unauthorized: invalid token', 401)
    }
  }
}) 

module.exports = {
  authenticateToken
}