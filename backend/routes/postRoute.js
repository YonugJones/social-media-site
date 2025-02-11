const express = require('express')
const postController = require('../controllers/postController')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/', authenticateToken, postController.newPost)
router.put('/:postId', authenticateToken, postController.editPost)
router.delete('/:postId', authenticateToken, postController.deletePost)
router.get('/', authenticateToken, postController.getAllPosts)
router.get('/user/:userId', authenticateToken, postController.getAllPostsByUser)
router.get('/:postId', authenticateToken, postController.getPostById)
router.post('/:postId/like', authenticateToken, postController.toggleLikePost)

module.exports = router