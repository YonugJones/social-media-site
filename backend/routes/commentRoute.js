const express = require('express')
const commentController = require('../controllers/commentController')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router()

// posts/:postId/comments
router.post('/', authenticateToken, commentController.newComment)

module.exports = router;