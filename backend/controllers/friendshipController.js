const prisma = require('../prisma/prismaClient')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')

const getAllUsersWithFriendshipStatus = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const userId = parseInt(req.params.userId, 10)
  if (isNaN(userId)) throw new CustomError('Invalid user ID', 400)

  const allUsers = await prisma.user.findMany()

  const filteredUsers = allUsers.filter(u => u.id !== userId)

  const followingList = await prisma.friendship.findMany({
    where: { followerId: userId, isConfirmed: true },
    select: { followingId: true }
  })

  const followerList = await prisma.friendship.findMany({
    where: { followingId: userId, isConfirmed: true },
    select: { followerId: true }
  })

  const pendingFollowingList = await prisma.friendship.findMany({
    where: { followerId: userId, isConfirmed: false },
    select: { followingId: true }
  })

  const pendingFollowersList = await prisma.friendship.findMany({
    where: { followingId: userId, isConfirmed: false },
    select: { followerId: true }
  })

  const followingIds = new Set(followingList.map(f => f.followingId))
  const followerIds = new Set(followerList.map(f => f.followerId))
  const pendingFollowingIds = new Set(pendingFollowingList.map(f => f.followingId))
  const pendingFollowerIds = new Set(pendingFollowersList.map(f => f.followerId))

  const usersWithStatus = filteredUsers.map(user => ({
    id: user.id,
    username: user.username,
    profilePic: user.profilePic,
    isFollowing: followingIds.has(user.id),
    isFollowingPending: pendingFollowingIds.has(user.id),
    isFollower: followerIds.has(user.id),
    isFollowerPending: pendingFollowerIds.has(user.id)
  }))

  res.status(200).json({
    success: true,
    message: 'All users with friendship status fetched',
    data: usersWithStatus
  })
})

const getFollowers = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const userId = parseInt(req.params.userId, 10)
  if (isNaN(userId)) throw new CustomError('Invalid user ID', 400)

  const followers = await prisma.friendship.findMany({
    where: { followingId: userId, isConfirmed: true },
    orderBy: { createdAt: 'desc' },
    select: {
      follower: { select: { id: true, username: true, profilePic: true } },
      isConfirmed: true
    }
  })

  const followingList = await prisma.friendship.findMany({
    where: { followerId: userId },
    select: { followingId: true, isConfirmed: true }
  })

  const confirmedFollowingIds = new Set(followingList.filter(f => f.isConfirmed).map(f => f.followingId))
  const pendingFollowingIds = new Set(followingList.filter(f => !f.isConfirmed).map(f => f.followingId))


  res.status(200).json({
    success: true,
    message: 'Followers fetched',
    data: followers.map(f => ({
      id: f.follower.id,
      username: f.follower.username,
      profilePic: f.follower.profilePic,
      isFollowing: confirmedFollowingIds.has(f.follower.id),
      isFollowingPending: pendingFollowingIds.has(f.follower.id)
    }))
  })
})

const getPendingFollowers = asyncHandler(async (req,res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const userId = parseInt(req.params.userId, 10)
  if (isNaN(userId)) throw new CustomError('Invalid user ID', 400)

  const pendingFollowers = await prisma.friendship.findMany({
    where: { followingId: userId, isConfirmed: false },
    orderBy: { createdAt: 'desc' },
    select: {
      follower: { select: { id: true, username: true, profilePic: true } }
    }
  })

  res.status(200).json({
    success: true,
    message: 'Pending followers fetched',
    data: pendingFollowers.map(f => ({
      id: f.follower.id,
      username: f.follower.username,
      profilePic: f.follower.profilePic
    }))
  })
})

const getFollowing = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const userId = parseInt(req.params.userId, 10)
  if (isNaN(userId)) throw new CustomError('Invalid user ID', 400)

  const following = await prisma.friendship.findMany({
    where: { followerId: userId, isConfirmed: true },
    orderBy: { createdAt: 'desc' },
    select: {
      following: { select: { id: true, username: true, profilePic: true } },
      isConfirmed: true
    }
  })

  const followerList = await prisma.friendship.findMany({
    where: { followerId: userId },
    select: { followerId: true, isConfirmed: true }
  })

  const confirmedFollowerListIds = new Set(followerList.filter(f => f.isConfirmed).map(f => f.followerId))
  const pendingFollowerListIds = new Set(followerList.filter(f => !f.isConfirmed).map(f => f.followerId))

  res.status(200).json({
    success: true,
    message: 'Following fetched',
    data: following.map(f => ({
      id: f.following.id,
      username: f.following.username,
      profilePic: f.following.profilePic,
      isFollower: confirmedFollowerListIds.has(f.following.id),
      isFollowerPending: pendingFollowerListIds.has(f.following.id)
    })) 
  })
})

const getPendingFollowing = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const userId = parseInt(req.params.userId, 10)
  if (isNaN(userId)) throw new CustomError('Invalid user ID', 400)

  const pendingFollowing = await prisma.friendship.findMany({
    where: { followerId: userId, isConfirmed: false },
    orderBy: { createdAt: 'desc' },
    select: {
      following: { select: { id: true, username: true, profilePic: true } }
    }
  })

  res.status(200).json({
    success: true,
    message: 'All pending following fetched',
    data: pendingFollowing.map(f => ({
      id: f.following.id,
      username: f.following.username,
      profilePic: f.following.profilePic
    }))
  })
})

const sendFollowRequest = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)
  
  const userId = user.id

  const targetUserId = parseInt(req.params.userId, 10)
  if (isNaN(targetUserId)) throw new CustomError('Invalid user ID', 400)

  if (userId === targetUserId) throw new CustomError('You cannot follow yourself', 400)

  const existingFriendship = await prisma.friendship.findFirst({
    where: { followerId: userId, followingId: targetUserId }
  })
  if (existingFriendship) {
    return res.status(409).json({
      success: false,
      message: 'Follow request already sent'
    })
  }

  await prisma.friendship.create({
    data: { followerId: userId, followingId: targetUserId }
  })

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, username: true, profilePic: true }
  })

  res.status(201).json({ 
    success: true, 
    message: 'Follow request sent',
    data: { ...targetUser, isConfirmed: false }
  })
})

const confirmFollowRequest = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const userId = user.id
  const { followerId } = req.body

  if (!followerId) throw new CustomError('Follower ID is required', 400)

  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      followerId, 
      followingId: userId,
      isConfirmed: false
    }
  })

  if (!existingFriendship) throw new CustomError('Friendship request not found', 404)

  await prisma.friendship.update({
    where: { id: existingFriendship.id },
    data: { isConfirmed: true }
  })

  const confirmUser = await prisma.user.findUnique({
    where: { id: followerId },
    select: { id: true, username: true, profilePic: true }
  })

  res.status(200).json({ 
    success: true, 
    message: 'Follow request confirmed',
    data: { ...confirmUser, isConfirmed: true }
  })
})

const rejectFollowRequest = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const userId = user.id
  const { followerId } = req.body
  if (!followerId) throw new CustomError('Follower ID is required', 400)

  const existingFriendship = await prisma.friendship.findFirst({
    where: { followerId, followingId: userId, isConfirmed: false }
  })

  if (!existingFriendship) throw new CustomError('Friendship request not found', 404)

  await prisma.friendship.delete({ where: { id: existingFriendship.id } })

  res.status(200).json({ 
    success: true, 
    message: 'Follow request rejected',
    data: { followerId }
  })  
})

const removeFollower = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const userId = user.id
  const { followerId } = req.body

  if (!followerId) throw new CustomError('Follower ID is required', 400)

  const existingFriendship = await prisma.friendship.findFirst({
    where: { followerId, followingId: userId, isConfirmed: true }
  })
  if (!existingFriendship) throw new CustomError('Friendship not found', 404)

  await prisma.friendship.delete({
    where: { id: existingFriendship.id }
  })

  res.status(200).json({ 
    success: true, 
    message: 'Follower removed',
    data: { followerId }
  })
})

const unfollow = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const userId = user.id
  const { followingId } = req.body
  if (!followingId) throw new CustomError('Following ID is required', 400)

  const existingFriendship = await prisma.friendship.findFirst({
    where: { followerId: userId, followingId, isConfirmed: true }
  })
  if (!existingFriendship) throw new CustomError('Friendship not found', 404)

  await prisma.friendship.delete({
    where: { id: existingFriendship.id }
  })

  res.status(200).json({ 
    success: true, 
    message: 'User unfollowed',
    data: { followingId }
  })
})

module.exports = {
  getAllUsersWithFriendshipStatus,
  getFollowers,
  getPendingFollowers,
  getFollowing,
  getPendingFollowing,
  sendFollowRequest,
  confirmFollowRequest,
  rejectFollowRequest,
  removeFollower,
  unfollow
}