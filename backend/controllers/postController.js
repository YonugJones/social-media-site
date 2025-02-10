const prisma = require('../prisma/prismaClient')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')

const newPost = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const { content } = req.body
  if (!content) {
    throw new CustomError('Content field cannot be blank', 400)
  }

  const post = await prisma.post.create({
    data: {
      userId: user.id,
      content,
    },
  })

  res.status(201).json({
    success: true,
    message: 'Post created',
    data: post
  })
})
