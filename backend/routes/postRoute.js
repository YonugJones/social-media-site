const express = require('express')
const { newPost, editPost, deletePost, getAllPosts, getAllPostsByUser } = require('../controllers/postController')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/', authenticateToken, newPost)
router.put('/:postId', authenticateToken, editPost)
router.delete('/:postId', authenticateToken, deletePost)
router.get('/', authenticateToken, getAllPosts)
router.get('/user/:userId', authenticateToken, getAllPostsByUser)

module.exports = router