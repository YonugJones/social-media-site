const prisma = require('../prisma/prismaClient')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')

const getFeedPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const following = await prisma.friendship.findMany({
    where: { followerId: userId, isConfirmed: true },
    select: { followingId: true }
  })

  const followingIds = following.map(f => f.followingId)

  const feedUserIds = [userId, ...followingIds]

  const posts = await prisma.post.findMany({
    where: {
      userId: { in: feedUserIds }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
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
        select: { 
          likes: true, 
          comments: true
        }
      },
      likes: { select: { userId: true } }
    }
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
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) {
    throw new CustomError('Invalid Post ID', 400)
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      user: {
        select: { 
          id: true, 
          username: true, 
          profilePic: true 
        }
      },
      likes: {
        select: { userId: true }
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { 
              id: true, 
              username: true, 
              profilePic: true 
            }
          },
          likes: {
            select: { userId: true } 
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

  if (!post) {
    throw new CustomError('Post not found', 404)
  }

  const postWithLikes = {
    ...post,
    isLiked: post.likes.some(like => like.userId === user.id),
    comments: post.comments.map(comment => ({
      id: comment.id,
      postId: comment.postId,
      content: comment.content,
      createdAt: comment.createdAt,
      user: comment.user,
      _count: comment._count, 
      isLiked: comment.likes.some(like => like.userId === user.id) 
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
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const { content } = req.body
  if (!content) {
    throw new CustomError('Content field cannot be blank', 400)
  }

  const post = await prisma.post.create({
    data: {
      content,
      userId: user.id
    },
  })

  const postWithInfo = await prisma.post.findUnique({
    where: { id: post.id },
    include: {
      user: {
        select: { 
          id: true, 
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
        select: { likes: true, comments: true }
      }
    },
  })

  res.status(201).json({
    success: true,
    message: 'Post created',
    data: postWithInfo
  })
})

const toggleLikePost = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const postId = parseInt(req.params.postId, 10)
  if (isNaN(postId)) {
    throw new CustomError('Invalid Post Id', 403)
  }

  const existingLike = await prisma.like.findFirst({ where: { userId: user.id, postId } })
  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } })
    return res.status(200).json({ success: true, message: 'Post unliked' })
  }

  await prisma.like.create({
    data: { userId: user.id, postId }
  })

  res.status(201).json({ success: true, message: 'Post liked' })
})

const editPost = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const postId = parseInt(req.params.postId, 10)
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

  const postWithInfo = await prisma.post.findUnique({
    where: { id: updatedPost.id },
    include: {
      user: {
        select: { 
          id: true, 
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
        select: { likes: true, comments: true }
      }
    },
  })

  res.status(200).json({
    success: true,
    message: 'Post updated',
    data: postWithInfo
  })
})

const deletePost = asyncHandler(async (req,res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const postId = parseInt(req.params.postId, 10)
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

  res.status(200).json({ success: true, message: 'Post deleted' })
})

module.exports = {
  // getPosts,
  getFeedPosts,
  getPostById,
  newPost,
  toggleLikePost,
  editPost,
  deletePost,
}