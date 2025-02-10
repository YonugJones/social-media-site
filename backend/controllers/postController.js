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

const editPost = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const postId = parseInt(req.params.postId, 10);
  if (isNaN(postId)) {
    throw new CustomError('Invalid Post ID', 400)
  }

  const { content } = req.body
  if (!content) {
    throw new CustomError('Content field cannot be blank', 400)
  }

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) {
    throw new CustomError('Post not found', 404)
  }

  if (post.userId !== user.id) {
    throw new CustomError('Unauthorized: only post author can edit post', 403)
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { content }
  })

  res.status(200).json({
    success: true,
    message: 'Post updated',
    data: updatedPost
  })
})

module.exports = {
  newPost,
  editPost
}