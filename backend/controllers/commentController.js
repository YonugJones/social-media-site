const prisma = require('../prisma/prismaClient')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')

const commentIncludes = {
  user: { select: { id: true, username: true, profilePic: true } },
  likes: { select: { userId: true } },
  _count: { select: { likes: true } }
}

const newComment = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401) 

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) throw new CustomError('Invalid Post Id', 401)

  const { content } = req.body
  if (!content) throw new CustomError('Content field cannot be blank', 400)

  const comment = await prisma.comment.create({ data: { postId, content, userId: user.id } })
  const fullComment = await prisma.comment.findUnique({ where: { id: comment.id }, include: commentIncludes })

  res.status(201).json({
    success: true,
    message: 'Comment created',
    data: fullComment
  })
})

const toggleLikeComment = asyncHandler(async (req, res) => {
  const user = req.user
  if(!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) throw new CustomError('Invalid Post ID', 400)

  const commentId = parseInt(req.params.commentId, 10)
  if (isNaN(commentId)) throw new CustomError('Invalid Comment ID', 403)
    
  const existingLike = await prisma.like.findFirst({ where: { userId: user.id, commentId } })
  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } })
  } else {
    await prisma.like.create({ data: { userId: user.id, commentId } })
  }

  const updatedComment = await prisma.comment.findUnique({ where: { id: commentId }, include: commentIncludes })
  if (!updatedComment) throw new CustomError('Comment not found', 404)

  const commentWithLikes = {
    ...updatedComment,
    isLiked: commentWithLikes.likes.some((like) => like.userId === user.id),
    _count: updatedComment._count
  }

  res.status(201).json({ 
    success: true, 
    message: existingLike ? 'Comment unliked' : 'Comment liked',
    data: commentWithLikes
  })
})

const editComment = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) throw new CustomError('Invalid Post ID', 400)

  const commentId = parseInt(req.params.commentId, 10)
  if (isNaN(commentId)) throw new CustomError('Invalid Comment Id', 401)

  const { content } = req.body
  if (!content) throw new CustomError('Content field cannot be blank', 400)

  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment) throw new CustomError('Comment not found', 404)

  if (comment.userId !== user.id) throw new CustomError('Unauthorized: only comment author can edit comment', 403)

  const updatedComment = await prisma.comment.update({ where: { id: commentId }, data: { content } })

  const commentWithInfo = await prisma.comment.findUnique({
    where: { id: updatedComment.id }, include: commentIncludes
  })

  const commentWithLikes = {
    ...commentWithInfo,
    isLiked: commentWithInfo.likes.some((like) => like.userId === user.id)
  }

  res.status(200).json({
    success: true,
    message: 'Comment updated',
    data: commentWithLikes
  })
})

const deleteComment = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) throw new CustomError('Invalid Post ID', 400)

  const commentId = parseInt(req.params.commentId, 10)
  if (isNaN(commentId)) throw new CustomError('Invalid Comment Id', 401)

  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment) throw new CustomError('Comment not found', 404)

  if (comment.userId !== user.id) throw new CustomError('Unauthorized: only comment author can delete comment', 403)

  await prisma.comment.delete({ where: { id: commentId } })

  res.status(200).json({ success: true, message: 'Comment deleted' })
})

module.exports = {
  newComment,
  toggleLikeComment,
  editComment,
  deleteComment
}