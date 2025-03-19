const prisma = require('../prisma/prismaClient')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')

const getFollowers = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const userId = user.id

  const userProfile = await prisma.user.findUnique({ where: { id: userId } })
  if (!userProfile) {
    throw new CustomError('User not found', 404)
  }

  const followers = await prisma.friendship.findMany({
    where: { isConfirmed: true, followingId: userId },
    select: {
      follower: {
        select: { id: true, username: true, profilePic: true }
      }
    }
  })

  res.status(200).json({
    success: true,
    message: 'Followers fetched',
    data: followers.map(f => f.follower)
  })
})

const getNonFollowing = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated')
  }

  const userId = user.id

  const nonFollowing = await prisma.user.findMany({
    where: {
      id : { not: userId },
      NOT: {
        followers: {
          some: {
            followerId: userId,
            isConfirmed: true
          }
        }
      }
    },
    select: {
      id: true,
      username: true,
      profilePic: true
    }
  })

  res.status(200).json({
    success: true,
    message: 'All users not followed fetched',
    data: nonFollowing
  })
})

const getFollowing = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const userId = user.id

  const userProfile = await prisma.user.findUnique({ where: { id: userId } })
  if (!userProfile) {
    throw new CustomError('User not found', 404)
  }

  const following = await prisma.friendship.findMany({
    where: { isConfirmed: true, followerId: userId },
    select: {
      following: {
        select: { id: true, username: true, profilePic: true }
      }
    }
  })

  res.status(200).json({
    success: true,
    message: 'Following fetched',
    data: following.map(f => f.following) 
  })
})

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

  const following = await prisma.friendship.findMany({
    where: { isConfirmed: true, followerId: userId },
    select: {
      following: {
        select: { id: true, username: true, profilePic: true }
      }
    }
  })

  res.status(201).json({ 
    success: true, 
    message: 'Follow request sent', 
    data: following.map(f => f.following)
  })
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

  const followers = await prisma.friendship.findMany({
    where: { isConfirmed: true, followingId: userId },
    select: {
      follower: {
        select: { id: true, username: true, profilePic: true }
      }
    }
  })

  res.status(200).json({ 
    success: true, 
    message: 'Follow request confirmed',
    data: followers.map(f => f.follower)
  })
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

  const followers = await prisma.friendship.findMany({
    where: { isConfirmed: true, followingId: userId },
    select: {
      follower: {
        select: { id: true, username: true, profilePic: true }
      }
    }
  })  

  res.status(200).json({ 
    success: true, 
    message: 'Follow request rejected',
    data: followers.map(f => f.follower)
  })  
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

  const followers = await prisma.friendship.findMany({
    where: { isConfirmed: true, followingId: userId },
    select: {
      follower: {
        select: { id: true, username: true, profilePic: true }
      }
    }
  })  

  res.status(200).json({ 
    success: true, 
    message: 'Follower removed', 
    data: followers.map(f => f.follower)
  })
})

const unfollow = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const userId = user.id
  const { followingId } = req.body

  if (!followingId) {
    throw new CustomError('Following ID is required', 400)
  }

  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      followerId: userId, 
      followingId,
      isConfirmed: true
    }
  })

  if (!existingFriendship) {
    throw new CustomError('Friendship not found', 404)
  }

  await prisma.friendship.delete({
    where: { id: existingFriendship.id }
  })

  const following = await prisma.friendship.findMany({
    where: { isConfirmed: true, followerId: userId },
    select: {
      following: {
        select: { id: true, username: true, profilePic: true }
      }
    }
  })

  res.status(200).json({ 
    success: true, 
    message: 'User unfollowed', 
    data: following.map(f => f.following)
  })
})

module.exports = {
  getFollowers,
  getFollowing,
  getNonFollowing,
  followRequest,
  confirmFollowRequest,
  rejectFollowRequest,
  removeFollower,
  unfollow
}