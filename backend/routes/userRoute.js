const express = require('express')
const postController = require('../controllers/postController')
const userController = require('../controllers/userController')
const friendshipController = require('../controllers/friendshipController')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router()

// /users
router.get('/:userId/posts', authenticateToken, postController.getPostsByUser)

router.get('/:userId', authenticateToken, userController.getUser)
router.put('/:userId', authenticateToken, userController.editUser)
router.delete('/:userId', authenticateToken, userController.deleteUser)

router.post('/:userId/follow', authenticateToken, friendshipController.followRequest)
router.put('/follow/confirm', authenticateToken, friendshipController.confirmFollowRequest)

module.exports = router;