const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/list', userController.getAllUsers);

module.exports = router