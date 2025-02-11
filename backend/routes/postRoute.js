const express = require('express')
const postController = require('../controllers/postController')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router()

// /posts
router.get('/', authenticateToken, postController.getAllPosts)
router.get('/:postId', authenticateToken, postController.getPostById)
router.post('/', authenticateToken, postController.newPost)
router.post('/:postId/like', authenticateToken, postController.toggleLikePost)
router.put('/:postId', authenticateToken, postController.editPost)
router.delete('/:postId', authenticateToken, postController.deletePost)

module.exports = router