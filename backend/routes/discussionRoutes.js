const express = require('express');
const router = express.Router();
const {
    getGlobalDiscussions,
    createGlobalDiscussion,
    addGlobalComment,
    getProblemDiscussion,
    addProblemComment,
    deleteComment,
    likeComment,
    editComment,
    getSingleGlobalDiscussion,
} = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/discussion/global/:discussionId', getSingleGlobalDiscussion);
router.get('/discussion/all', getGlobalDiscussions);
router.post('/discussion/all', protect, createGlobalDiscussion);
router.post('/discussion/global/:discussionId', protect, addGlobalComment);
router.get('/discussion/:problemId', getProblemDiscussion);
router.post('/discussion/:problemId', protect, addProblemComment);
router.delete('/discussion/comment/:commentId', protect, deleteComment);
router.put('/discussion/like/:commentId', protect, likeComment);
router.put('/discussion/comment/:commentId', protect, editComment);

module.exports = router;