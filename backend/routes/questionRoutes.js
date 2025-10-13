const express = require('express');
const router = express.Router();
const { createQuestion, getQuestions, getQuestionById, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { upload } = require('../utils/cloudinary');

router.route('/')
    .post(protect, isAdmin, upload.single('image'), createQuestion)
    .get(getQuestions);
    
router.route('/:id')
    .get(getQuestionById)
    .put(protect, isAdmin, upload.single('image'), updateQuestion)
    .delete(protect, isAdmin, deleteQuestion);
    
module.exports = router;