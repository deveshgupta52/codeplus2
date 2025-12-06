
const Discussion = require('../models/Discussion');
const Comment = require('../models/Comment');
const Question = require('../models/Question');
const User = require('../models/User');

exports.getDiscussion = async (req, res) => {
    try {
        const { problemId } = req.params;
        if (problemId === 'all') {
            const discussions = await Discussion.find().populate('question', 'title');
            return res.status(200).json(discussions);
        }

        const discussion = await Discussion.findOne({ question: problemId }).populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'name',
            },
        });
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }
        res.status(200).json(discussion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addComment = async (req, res) => {
    const { problemId } = req.params;
    const { text, parentId } = req.body;
    const userId = req.user._id;

    try {
        let discussion = await Discussion.findOne({ question: problemId });
        if (!discussion) {
            discussion = new Discussion({ question: problemId, comments: [] });
        }

        const newComment = new Comment({
            user: userId,
            text,
            replies: [],
        });

        if (parentId) {
            const parentComment = await Comment.findById(parentId);
            parentComment.replies.push(newComment._id);
            await newComment.save();
            await parentComment.save();
        } else {
            discussion.comments.push(newComment._id);
            await newComment.save();
            await discussion.save();
        }

        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.likeComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const index = comment.likes.indexOf(userId);
        if (index === -1) {
            comment.likes.push(userId);
        } else {
            comment.likes.splice(index, 1);
        }

        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
