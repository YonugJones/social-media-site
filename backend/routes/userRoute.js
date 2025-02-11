const express = require('express')
const postController = require('../controllers/postController')
const userController = require('../controllers/userController')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router()

// /users
router.get('/:userId', authenticateToken, userController.getUser)
router.get('/:userId/posts', authenticateToken, postController.getPostsByUser)
router.put('/:userId', authenticateToken, userController.editUser)
router.delete('/:userId', authenticateToken, userController.deleteUser)

module.exports = router;