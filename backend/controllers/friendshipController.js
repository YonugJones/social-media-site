const prisma = require('../prisma/prismaClient')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')

// const getFollowers = asyncHandler(async (req, res) => {
//   const user = req.user
//   if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

//   const userId = parseInt(req.params.userId, 10)
//   if (isNaN(userId)) throw new CustomError('Invalid user ID', 400)

//   const followers = await prisma.friendship.findMany({
//     where: { followingId: userId },
//     select: {
//       follower: { select: { id: true, username: true, profilePic: true } },
//       isConfirmed: true
//     }
//   })

//   const userFollowingIds = await prisma.friendship.findMany({
//     where: { followingId: userId, isConfirmed: true },
//     select: { followingId: true }
//   })

//   const followingIdsSet = new Set(userFollowingIds.map(f => f.followingId))

//   res.status(200).json({
//     success: true,
//     message: 'Followers fetched',
//     data: followers.map(f => ({
//       id: f.follower.id,
//       username: f.follower.username,
//       profilePic: f.follower.profilePic,
//       isConfirmed: f.isConfirmed,
//       isFollowingBack: followingIdsSet.has(f.follower.id)
//     }))
//   })
// })

// const getFollowing = asyncHandler(async (req, res) => {
//   const user = req.user
//   if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

//   const userId = parseInt(req.params.userId, 10)
//   if (isNaN(userId)) throw new CustomError('Invalid user ID', 400)

//   const following = await prisma.friendship.findMany({
//     where: { followerId: userId },
//     select: {
//       following: { select: { id: true, username: true, profilePic: true } },
//       isConfirmed: true
//     }
//   })

//   res.status(200).json({
//     success: true,
//     message: 'Following fetched',
//     data: following.map(f => ({
//       id: f.following.id,
//       username: f.following.username,
//       profilePic: f.following.profilePic,
//       isConfirmed: f.following.isConfirmed
//     })) 
//   })
// })

const getFriendshipData = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) throw new CustomError('Unauthorized: user not authenticated', 401)

  const userId = parseInt(req.params.userId, 10)
  if (isNaN(userId)) throw new CustomError('Invalid user ID', 400)

  const [followers, pendingFollowers, following, pendingFollowing] = await Promise.all([
    prisma.friendship.findMany({ 
      orderBy: { createdAt: 'desc' },
      where: { followingId: userId, isConfirmed: true } 
    }),
    prisma.friendship.findMany({ 
      orderBy: { createdAt: 'desc' },
      where: { followingId: userId, isConfirmed: false } 
    }),
    prisma.friendship.findMany({ 
      orderBy: { createdAt: 'desc' },
      where: { followerId: userId, isConfirmed: true } 
    }),
    prisma.friendship.findMany({ 
      orderBy: { createdAt: 'desc' },
      where: { followerId: userId, isConfirmed: false } 
    })
  ])

  res.status(200).json({
    success: true,
    message: 'Friendship data retrieved',
    data: { followers, pendingFollowers, following, pendingFollowing }
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
  getFriendshipData,
  // getFollowers,
  // getFollowing,
  sendFollowRequest,
  confirmFollowRequest,
  rejectFollowRequest,
  removeFollower,
  unfollow
}