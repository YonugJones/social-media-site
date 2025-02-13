const express = require('express')
const postController = require('../controllers/postController')
const { authenticateToken } = require('../middleware/authMiddleware')
const { validatePost } = require('../middleware/validateInput')
const router = express.Router()

// /posts
router.get('/', authenticateToken, postController.getPosts)
router.get('/:postId', authenticateToken, postController.getPostById)
router.post('/', authenticateToken, validatePost, postController.newPost)
router.post('/:postId/like', authenticateToken, postController.toggleLikePost)
router.put('/:postId', authenticateToken, validatePost, postController.editPost)
router.delete('/:postId', authenticateToken, postController.deletePost)

module.exports = router