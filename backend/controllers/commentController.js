const prisma = require('../prisma/prismaClient')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')

const newComment = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) {
    throw new CustomError('Invalid Post Id', 401)
  }

  const { content } = req.body
  if (!content) {
    throw new CustomError('Content field cannot be blank', 400)
  }

  const comment = await prisma.comment.create({
    data: {
      userId: user.id,
      postId,
      content
    }
  })

  res.status(201).json({
    success: true,
    message: 'Comment created',
    data: comment
  })
})

const editComment = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) {
    throw new CustomError('Invalid Post ID', 400)
  }

  const commentId = parseInt(req.params.commentId, 10)
  if (isNaN(commentId)) {
    throw new CustomError('Invalid Comment Id', 401)
  }

  const { content } = req.body
  if (!content) {
    throw new CustomError('Content field cannot be blank', 400)
  }

  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment) {
    throw new CustomError('Comment not found', 404)
  }

  if (comment.userId !== user.id) {
    throw new CustomError('Unauthorized: only comment author can edit comment', 403)
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content }
  })

  res.status(200).json({
    success: true,
    message: 'Comment updated',
    data: updatedComment
  })
})

module.exports = {
  newComment,
  editComment
}