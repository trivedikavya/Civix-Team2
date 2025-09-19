const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPetitions, createPetition, signPetition } = require('../controllers/petitionController');

// @route   GET api/petitions
// @desc    Get all petitions
// @access  Public
router.get('/', getPetitions);

// @route   POST api/petitions
// @desc    Create a petition
// @access  Private
router.post('/', auth, createPetition);

// @route   POST api/petitions/:id/sign
// @desc    Sign a petition
// @access  Private
router.post('/:id/sign', auth, signPetition);


module.exports = router;