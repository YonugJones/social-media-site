const prisma = require('../prisma/prismaClient')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/customError')

const getUser = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const userId = parseInt(req.params.userId)
  if (!userId) {
    throw new CustomError('Invalid User ID', 403)
  }

  const userProfile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      profilePic: true,
      followers: {
        where: { isConfirmed: true },
        select: {
          follower: {
            select: { username: true, profilePic: true }
          }
        }
      },
      following: {
        where: { isConfirmed: true },
        select: {
          following: {
            select: { username: true, profilePic: true }
          }
        }
      }
    }
  })

  if (!userProfile) {
    throw new CustomError('User not found', 404)
  }

  res.status(200).json({
    success: true,
    message: 'User profile fetched',
    data: userProfile
  })
})

const editUser = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const userId = parseInt(req.params.userId)
  if (!userId) {
    throw new CustomError('Invalid User ID', 403)
  }

  const userProfile = await prisma.user.findUnique({ where: { id: userId } })
  if (!userProfile) {
    throw new CustomError('User not found', 401)
  }

  if (userProfile.id !== user.id) {
    throw new CustomError('Unauthorized: users can only update their own profile', 403)
  }

  const { username, email, bio, profilePic } = req.body;
  if (!username || !email) {
    throw new CustomError('Username and email field cannot be blank', 400)
  }

  const updatedProfile = await prisma.user.update({
    where: { id: userId },
    data: {
      username,
      email,
      bio,
      profilePic
    },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      profilePic: true
    }
  })

  res.status(200).json({
    success: true,
    message: 'User profile updated',
    data: updatedProfile
  })
})

const deleteUser = asyncHandler(async (req, res) => {
  const user = req.user
  if (!user) {
    throw new CustomError('Unauthorized: user not authenticated', 401)
  }

  const userId = parseInt(req.params.userId)
  if (!userId) {
    throw new CustomError('Invalid User ID', 403)
  }

  const userProfile = await prisma.user.findUnique({ where: { id: userId } })
  if (!userProfile) {
    throw new CustomError('User not found', 401)
  }

  if (userProfile.id !== user.id) {
    throw new CustomError('Unauthorized: users can only delete their own profile', 403)
  }

  await prisma.user.delete({ where: { id: userId } })

  res.status(200).json({ success: true, message: 'User deleted' })
})

module.exports = {
  getUser,
  editUser,
  deleteUser
}