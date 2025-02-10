const express = require('express')
const { signup, login, refresh, logout } = require('../controllers/authController')
const { validateSignup } = require('../middleware/validateInput')
const router = express.Router()

router.post('/signup', validateSignup, signup)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)

module.exports = router