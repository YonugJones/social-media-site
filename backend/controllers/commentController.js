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

const deleteComment = asyncHandler(async (req, res) => {
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

  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment) {
    throw new CustomError('Comment not found', 404)
  }

  if (comment.userId !== user.id) {
    throw new CustomError('Unauthorized: only comment author can delete comment', 403)
  }

  await prisma.comment.delete({ where: { id: commentId } })

  res.status(200).json({ success: true, message: 'Comment deleted' })
})

const getCommentsByPost = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) {
    throw new CustomError('Invalid Post ID', 400)
  }

  const comments = await prisma.comment.findMany({ 
    where: { postId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { 
          id: true, 
          username: true, 
          profilePic: true 
        }
      },
      _count: {
        select: { likes: true }
      }
    } 
  })

  if (comments.length === 0) {
    return res.status(200).json({ 
      success: true, 
      message: 'This post has no comments',
      data: []
    })
  }

  res.status(200).json({
    success: true,
    message: 'Comments from post fetched',
    data: comments
  })
})

const getCommentById = asyncHandler(async (req, res) => {
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

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      user: {
        select: { 
          id: true, 
          username: true, 
          profilePic: true 
        }
      },
      _count: {
        select: { likes: true }
      }
    } 
  })

  if (!comment) {
    throw new CustomError('Comment not found', 404)
  }

  res.status(200).json({
    success: true,
    message: 'Comment fetched',
    data: comment
  })
})

const toggleLikeComment = asyncHandler(async (req, res) => {
  const user = req.user
  if(!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) {
    throw new CustomError('Invalid Post ID', 400)
  }

  const commentId = parseInt(req.params.commentId, 10)
  if (isNaN(commentId)) {
    throw new CustomError('Invalid Comment ID', 403)
  }
    
  const existingLike = await prisma.like.findFirst({ where: { userId: user.id, commentId } })
  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } })
    return res.status(200).json({ success: true, message: 'Comment unliked' })
  }

  await prisma.like.create({
    data: { userId: user.id, commentId }
  })

  res.status(201).json({ success: true, message: 'Comment liked' })
})

module.exports = {
  newComment,
  editComment,
  deleteComment,
  getCommentsByPost,
  getCommentById,
  toggleLikeComment
}