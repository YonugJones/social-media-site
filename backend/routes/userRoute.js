const express = require('express')
const userController = require('../controllers/userController')
const { authenticateToken } = require('../middleware/authMiddleware')
const { validateEditUser } = require('../middleware/validateInput')
const router = express.Router()
/*
/users
*/
router.get('/:userId', authenticateToken, userController.getUser)
router.get('/:userId/posts', authenticateToken, userController.getPostsByUser)
router.put('/:userId', authenticateToken, validateEditUser, userController.editUser)
router.delete('/:userId', authenticateToken, userController.deleteUser)

module.exports = router;