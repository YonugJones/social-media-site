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

  const emailExists = await prisma.user.findUnique({ where: { email } })
  if (emailExists) {
    throw new CustomError('Email is taken', 409)
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

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken
  if (!token) {
    throw new CustomError('Refresh token required', 403)
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      throw new CustomError('Invalid refresh token', 403)
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id, refreshToken: token }
    })

    if (!user) {
      throw new CustomError('Refresh token not found', 403)
    }

    const newAccessToken = generateAccessToken(user)
    res.status(200).json({ accessToken: newAccessToken })
  })
})

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies
  if (!refreshToken) {
    return res.status(204).json({ message: 'No content' })
  }

  const user = await prisma.user.findFirst({ where: { refreshToken } })

  if (!user) {
    res.clearCookie('refreshToken')
    return res.status(204).json({ message: 'No content' })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: null }
  })

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  })

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  })
})

module.exports = {
  signup,
  generateAccessToken,
  generateRefreshToken,
  login,
  refresh,
  logout
}