const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { registerUser, loginUser, getLoggedInUser } = require('../controllers/auth');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, getLoggedInUser);


module.exports = router;