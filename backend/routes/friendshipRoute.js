const express = require('express')
const friendshipController = require('../controllers/friendshipController')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router()
/*
friendship
*/
router.get('/:userId', authenticateToken, friendshipController.getAllUsersWithFriendshipStatus)
router.get('/:userId/followers', authenticateToken, friendshipController.getFollowers)
router.get('/:userId/pending-followers', authenticateToken, friendshipController.getPendingFollowers)
router.get('/:userId/following', authenticateToken, friendshipController.getFollowing)
router.get('/:userId/pending-following', authenticateToken, friendshipController.getPendingFollowing)
router.post('/:userId/follow', authenticateToken, friendshipController.sendFollowRequest)
router.post('/confirm', authenticateToken, friendshipController.confirmFollowRequest)
router.delete('/reject', authenticateToken, friendshipController.rejectFollowRequest)
router.delete('/remove', authenticateToken, friendshipController.removeFollower)
router.delete('/unfollow', authenticateToken, friendshipController.unfollow)

module.exports = router;