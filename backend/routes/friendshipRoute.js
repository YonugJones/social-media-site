const express = require('express')
const friendshipController = require('../controllers/friendshipController')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router()
/*
friendship
*/
router.get('/:userId/followers', authenticateToken, friendshipController.getFollowers)
router.get('/:userId/following', authenticateToken, friendshipController.getFollowing)
router.get('/:userId/nonfollowing', authenticateToken, friendshipController.getNonFollowing)
router.post('/:userId/follow', authenticateToken, friendshipController.sendFollowRequest)
router.post('/confirm', authenticateToken, friendshipController.confirmFollowRequest)
router.post('/reject', authenticateToken, friendshipController.rejectFollowRequest)
router.post('/remove', authenticateToken, friendshipController.removeFollower)
router.post('/unfollow', authenticateToken, friendshipController.unfollow)

module.exports = router;