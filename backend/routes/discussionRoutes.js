
const express = require('express');
const router = express.Router();
const {
    getDiscussion,
    addComment,
    likeComment,
} = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/discussion/:problemId', getDiscussion);
router.post('/discussion/:problemId', protect, addComment);
router.post('/discussion/comment/:postId', protect, addComment);
router.put('/discussion/like/:commentId', protect, likeComment);

module.exports = router;
