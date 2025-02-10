const express = require('express')
const { newPost, editPost } = require('../controllers/postController')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/', authenticateToken, newPost)
router.put('/:postId', authenticateToken, editPost)

module.exports = router