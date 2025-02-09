require('dotenv').config()
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')

const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization

  if (!token || !token.startsWith('Bearer ')) {
    throw new CustomError('Unauthorized: no token provided', 401)
  }

  try {
    token = token.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = { id: decoded.id, username: decoded.username }

    next()
  } catch (err) {
    throw new CustomError('Unauthorized: invalid token', 401)
  }
}) 

module.exports = {
  protect
}