const express = require('express');
const router = express.Router();
const register = require('../controllers/register')

router.post('/', register.save);

module.exports = router