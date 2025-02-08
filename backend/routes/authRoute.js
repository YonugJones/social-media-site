const express = require('express')
const { signup } = require('../controllers/authController')
const router = express.Router()

router.post('/auth/signup', signup)

module.exports = router