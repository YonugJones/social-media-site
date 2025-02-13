const express = require('express')
const postController = require('../controllers/postController')
const userController = require('../controllers/userController')
const friendshipController = require('../controllers/friendshipController')
const { authenticateToken } = require('../middleware/authMiddleware')
const { validateEditUser } = require('../middleware/validateInput')
const router = express.Router()

// /users
router.get('/:userId/posts', authenticateToken, postController.getPostsByUser)

router.get('/:userId', authenticateToken, userController.getUser)
router.put('/:userId', authenticateToken, validateEditUser, userController.editUser)
router.delete('/:userId', authenticateToken, userController.deleteUser)

router.post('/:userId/follow', authenticateToken, friendshipController.followRequest)
router.put('/follow/confirm', authenticateToken, friendshipController.confirmFollowRequest)
router.delete('/follow/reject', authenticateToken, friendshipController.rejectFollowRequest)
router.delete('/follow/remove', authenticateToken, friendshipController.removeFollower)
router.delete('/follow/unfollow', authenticateToken, friendshipController.unfollow)

module.exports = router;