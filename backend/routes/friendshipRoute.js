const express = require('express')
const friendshipController = require('../controllers/friendshipController')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router()
/*
friendship
*/
router.get('/:userId', authenticateToken, friendshipController.getFriendshipData)
router.post('/:userId/follow', authenticateToken, friendshipController.sendFollowRequest)
router.post('/confirm', authenticateToken, friendshipController.confirmFollowRequest)
router.delete('/reject', authenticateToken, friendshipController.rejectFollowRequest)
router.delete('/remove', authenticateToken, friendshipController.removeFollower)
router.delete('/unfollow', authenticateToken, friendshipController.unfollow)

module.exports = router;