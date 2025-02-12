const prisma = require('../prisma/prismaClient')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')

const followRequest = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }
  
  const userId = user.id

  const followId = parseInt(req.params.userId, 10)
  if (isNaN(followId)) {
    throw new CustomError('Invalid user ID', 400)
  }

  if (userId === followId) {
    throw new CustomError('You cannot follow yourself', 400)
  }

  const existingFriendship = await prisma.friendship.findFirst({
    where: { followerId: userId, followingId: followId }
  })
  if (existingFriendship) {
    return res.status(409).json({
      success: false,
      message: 'Follow request already sent'
    })
  }

  await prisma.friendship.create({
    data: { followerId: userId, followingId: followId }
  })

  res.status(201).json({ success: true, message: 'Follow request sent' })
})

const confirmFollowRequest = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const userId = user.id
  const { followerId } = req.body

  if (!followerId) {
    throw new CustomError('Follower ID is required', 400)
  }

  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      followerId, 
      followingId: userId,
      isConfirmed: false
    }
  })

  if (!existingFriendship) {
    throw new CustomError('Friendship request not found', 404)
  }

  await prisma.friendship.update({
    where: { id: existingFriendship.id },
    data: { isConfirmed: true }
  })

  res.status(200).json({ success: true, message: 'Follow request confirmed' })
})

const rejectFollowRequest = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const userId = user.id
  const { followerId } = req.body

  if (!followerId) {
    throw new CustomError('Follower ID is required', 400)
  }

  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      followerId, 
      followingId: userId,
      isConfirmed: false
    }
  })

  if (!existingFriendship) {
    throw new CustomError('Friendship request not found', 404)
  }

  await prisma.friendship.delete({
    where: { id: existingFriendship.id }
  })

  res.status(200).json({ success: true, message: 'Follow request rejected' })  
})

const removeFollower = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const userId = user.id
  const { followerId } = req.body

  if (!followerId) {
    throw new CustomError('Follower ID is required', 400)
  }

  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      followerId, 
      followingId: userId,
      isConfirmed: true
    }
  })

  if (!existingFriendship) {
    throw new CustomError('Friendship not found', 404)
  }

  await prisma.friendship.delete({
    where: { id: existingFriendship.id }
  })

  res.status(200).json({ success: true, message: 'Follower removed' })
})

module.exports = {
  followRequest,
  confirmFollowRequest,
  rejectFollowRequest,
  removeFollower
}