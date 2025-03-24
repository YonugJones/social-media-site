const prisma = require('../prisma/prismaClient')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')

const postIncludes = {
  user: { select: { id: true, username: true, profilePic: true } },
  comments: {
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, postId: true, content: true, createdAt: true, 
      user: { select: { id: true, username: true, profilePic: true } },
      likes: { select: { userId: true } },
      _count: { select: { likes: true } }
    }
  },
  likes: { select: { userId: true } },
  _count: { select: { likes: true, comments: true } }
}

const getFeedPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const following = await prisma.friendship.findMany({
    where: { followerId: userId, isConfirmed: true },
    select: { followingId: true }
  })

  const followingIds = following.map(f => f.followingId)
  const feedUserIds = [userId, ...followingIds]

  const posts = await prisma.post.findMany({
    where: { userId: { in: feedUserIds } },
    orderBy: { createdAt: 'desc' },
    include: postIncludes
  })

  const postsWithLikes = posts.map(post => ({
    ...post,
    isLiked: post.likes.some(like => like.userId === userId)
  }))

  res.status(200).json({ 
    success: true, 
    message: 'User feed fetched', 
    data: postsWithLikes 

  })
})

const getPostById = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) throw new CustomError('Invalid Post ID', 400)

  const post = await prisma.post.findUnique({ where: { id: postId }, include: postIncludes })
  if (!post) throw new CustomError('Post not found', 404)

  const postWithLikes = {
    ...post,
    isLiked: post.likes.some((like) => like.userId === user.id),
    comments: post.comments.map((comment) => ({
      ...comment,
      isLiked: comment.likes.some((like) => like.userId === user.id)
    }))
  }

  res.status(200).json({ 
    success: true, 
    message: 'Post fetched', 
    data: postWithLikes 

  })
})

const newPost = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const { content } = req.body
  if (!content) throw new CustomError('Content field cannot be blank', 400)

  const post = await prisma.post.create({ data: { content, userId: user.id } })
  const postWithInfo = await prisma.post.findUnique({ where: { id: post.id }, include: postIncludes })

  res.status(201).json({
    success: true,
    message: 'Post created',
    data: postWithInfo
  })
})

const toggleLikePost = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) throw new CustomError('Invalid Post Id', 403)

  const existingLike = await prisma.like.findFirst({ where: { userId: user.id, postId } })
  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } })
  } else {
    await prisma.like.create({ data: { userId: user.id, postId } })
  }

  const updatedPost = await prisma.post.findUnique({ where: { id: postId }, include: postIncludes })
  if (!updatedPost) throw new CustomError('Post not found', 404)

  const postWithLikes = {
    ...updatedPost,
    isLiked: updatedPost.likes.some((like) => like.userId === user.id),
    _count: updatedPost._count
  }

  res.status(201).json({ 
    success: true, 
    message: existingLike ? 'Post unliked' : 'Post liked',
    data: postWithLikes
  })
})

const editPost = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) throw new CustomError('Invalid Post ID', 400)

  const { content } = req.body
  if (!content) throw new CustomError('Content field cannot be blank', 400)

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) throw new CustomError('Post not found', 404)

  if (post.userId !== user.id) throw new CustomError('Unauthorized: only post author can edit post', 403)

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { content }
  })

  const postWithInfo = await prisma.post.findUnique({
    where: { id: updatedPost.id }, include: postIncludes
  })

  const postWithLikes = {
    ...postWithInfo,
    isLiked: postWithInfo.likes.some((like) => like.userId === user.id)
  }

  res.status(200).json({
    success: true,
    message: 'Post updated',
    data: postWithLikes
  })
})

const deletePost = asyncHandler(async (req,res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) throw new CustomError('Invalid Post ID', 400)

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) throw new CustomError('Post not found', 404)

  if (post.userId !== user.id) throw new CustomError('Unauthorized: only post author can delete post', 403)

  await prisma.post.delete({ where: { id: postId } })

  res.status(200).json({ success: true, message: 'Post deleted' })
})

module.exports = {
  getFeedPosts,
  getPostById,
  newPost,
  toggleLikePost,
  editPost,
  deletePost,
}