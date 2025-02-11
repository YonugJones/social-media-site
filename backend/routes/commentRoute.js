const express = require('express')
const commentController = require('../controllers/commentController')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router({ mergeParams: true })

// posts/:postId/comments
router.get('/', authenticateToken, commentController.getCommentsByPost)
router.post('/', authenticateToken, commentController.newComment)
router.put('/:commentId', authenticateToken, commentController.editComment)
router.delete('/:commentId', authenticateToken, commentController.deleteComment)

module.exports = router;