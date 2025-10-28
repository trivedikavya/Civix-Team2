// File: backend/routes/reports.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// Remove getMyActivityReport from the import
const { getCommunityReport } = require('../controllers/reportController');

// @route   GET api/reports/community
// @desc    Get community-wide aggregated report data (e.g., total petitions, poll breakdown)
// @access  Private (Requires authentication via 'auth' middleware)
router.get('/community', auth, getCommunityReport);

// REMOVE the '/my-activity' route entirely
// router.get('/my-activity', auth, getMyActivityReport);

module.exports = router;