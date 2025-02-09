require('dotenv').config()
const prisma = require('../prisma/prismaClient')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    throw new CustomError('All fields are required', 400)
  }

  const usernameExists = await prisma.user.findUnique({ where: { username } })
  if (usernameExists) {
    throw new CustomError('Username is taken', 409)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    }
  })

  res.status(201).json({
    success: true,
    message: 'New user createed',
    data: {
      id: newUser.id,
      username: newUser.username
    }
  })
})

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )
}

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )
}

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    throw new CustomError('Username and password are required', 400)
  }

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    throw new CustomError('Invalid username or password', 401)
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new CustomError('Invalid username or password', 401)
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(201).json({
    success: true,
    message: 'User logged in',
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic
    }
  })
})

module.exports = {
  signup,
  generateAccessToken,
  generateRefreshToken,
  login
}