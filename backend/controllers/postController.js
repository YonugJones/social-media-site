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

const deletePost = asyncHandler(async (req,res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const postId = parseInt(req.params.postId, 10);
  if (isNaN(postId)) {
    throw new CustomError('Invalid Post ID', 400)
  }

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) {
    throw new CustomError('Post not found', 404)
  }

  if (post.userId !== user.id) {
    throw new CustomError('Unauthorized: only post author can delete post', 403)
  }

  await prisma.post.delete({ where: { id: postId } })

  res.status(200).json({
    success: true,
    message: 'Post deleted'
  })
})

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { 
          id:true, 
          username: true, 
          profilePic: true 
        }
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          postId: true,
          content: true,
          createdAt: true,
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
      },
      _count: {
        select: { likes: true }
      }
    }
  })

  res.status(200).json({
    success: true,
    message: 'All posts fetched',
    data: posts
  })
})

module.exports = {
  newPost,
  editPost,
  deletePost,
  getAllPosts
}