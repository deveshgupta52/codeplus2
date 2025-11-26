const express = require('express');
const router = express.Router();

// Import BOTH controllers.
const { runCode } = require('../controllers/runCodeController'); 
const { submitCode } = require('../controllers/submitCodeController'); 
const { protect } = require('../middleware/authMiddleware');

// Handles POST requests to /api/code/run
// This is for the "Run" button
router.post('/run', protect, runCode);

// Handles POST requests to /api/code/submit
// This is for the "Submit" button
router.post('/submit', protect, submitCode);

module.exports = router;