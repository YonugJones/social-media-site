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
      password, hashedPassword
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

module.exports = {
  signup,
}