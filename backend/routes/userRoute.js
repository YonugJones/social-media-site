const express = require('express')
const postController = require('../controllers/postController')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router()

// /users
router.get('/:userId/posts', authenticateToken, postController.getAllPostsByUser)

module.exports = router;