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


module.exports = {
  newComment
}