const Discussion = require('../models/Discussion');
const Comment = require('../models/Comment');
const Question = require('../models/Question');
const User = require('../models/User');

const populateReplies = async (comment) => {
    if (!comment || !comment.replies) {
        return;
    }
    const populatedReplies = [];
    for (const replyId of comment.replies) {
                    const reply = await Comment.findById(replyId).populate('user', '_id name');        if (reply) {
            await populateReplies(reply);
            populatedReplies.push(reply);
        }
    }
    comment.replies = populatedReplies;
}


exports.getSingleGlobalDiscussion = async (req, res) => {
    try {
        const { discussionId } = req.params;
        const discussion = await Discussion.findById(discussionId).populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: '_id name',
            },
        });
        if (!discussion || !discussion.isGlobal) {
            return res.status(404).json({ message: 'Global discussion not found' });
        }

        for (const comment of discussion.comments) {
            await populateReplies(comment);
        }
        res.status(200).json(discussion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getGlobalDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find({ isGlobal: true }).populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: '_id name',
            },
        });
        for (const discussion of discussions) {
            for (const comment of discussion.comments) {
                await populateReplies(comment);
            }
        }
        res.status(200).json(discussions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createGlobalDiscussion = async (req, res) => {
    const { title, text } = req.body;
    const userId = req.user._id;

    try {
        const newDiscussion = new Discussion({
            title,
            isGlobal: true,
        });

        const newComment = new Comment({
            user: userId,
            text,
        });

        newDiscussion.comments.push(newComment._id);

        await newComment.save();
        await newDiscussion.save();

        const populatedDiscussion = await Discussion.findById(newDiscussion._id).populate({
            path: 'comments',
            populate: {
                            path: 'user',
                            select: '_id name',
                        },        });

        res.status(201).json(populatedDiscussion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.addGlobalComment = async (req, res) => {
    const { discussionId } = req.params;
    const { text, parentId } = req.body;
    const userId = req.user._id;

    try {
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        const newComment = new Comment({
            user: userId,
            text,
            replies: [],
        });

        await newComment.save();

        if (parentId) {
            const parentComment = await Comment.findById(parentId);
            parentComment.replies.push(newComment._id);
            await parentComment.save();
        } else {
            discussion.comments.push(newComment._id);
            await discussion.save();
        }

        const populatedComment = await Comment.findById(newComment._id).populate('user', '_id name');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getProblemDiscussion = async (req, res) => {
    try {
        const { problemId } = req.params;
        console.log(`[getProblemDiscussion] Received problemId: ${problemId}`);
        let discussion = await Discussion.findOne({ question: problemId, isGlobal: false });
        console.log(`[getProblemDiscussion] Discussion found (or null): ${discussion}`);

        if (!discussion) {
            console.log(`[getProblemDiscussion] No discussion found for problemId: ${problemId}. Attempting to create one.`);
            try {
                discussion = new Discussion({ question: problemId, comments: [], isGlobal: false });
                await discussion.save();
                console.log(`[getProblemDiscussion] New discussion created: ${discussion._id}`);
            } catch (error) {
                if (error.code === 11000) { // Duplicate key error
                    console.warn(`[getProblemDiscussion] Duplicate key error (11000) during discussion creation. Retrying findOne.`);
                    discussion = await Discussion.findOne({ question: problemId, isGlobal: false });
                    console.log(`[getProblemDiscussion] Found discussion after duplicate error: ${discussion._id}`);
                } else {
                    console.error(`[getProblemDiscussion] Error creating discussion: ${error.message}`);
                    throw error;
                }
            }
        }

        const populatedDiscussion = await Discussion.findById(discussion._id).populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: '_id name',
            },
        });
        console.log(`[getProblemDiscussion] Populated discussion: ${populatedDiscussion._id}, Comments count: ${populatedDiscussion.comments.length}`);


        for (const comment of populatedDiscussion.comments) {
            await populateReplies(comment);
        }
        console.log(`[getProblemDiscussion] Replies populated.`);
        
        res.status(200).json(populatedDiscussion);
    } catch (error) {
        console.error(`[getProblemDiscussion] Catch block error: ${error.message}`, error);
        res.status(500).json({ message: error.message });
    }
};

exports.addProblemComment = async (req, res) => {
    const { problemId } = req.params;
    const { text, parentId } = req.body;
    const userId = req.user._id;

    console.log(`[addProblemComment] Received problemId: ${problemId}, userId: ${userId}, text: "${text}", parentId: ${parentId}`);

    try {
        let discussion = await Discussion.findOne({ question: problemId, isGlobal: false });
        console.log(`[addProblemComment] Discussion found (or null): ${discussion}`);

        if (!discussion) {
            console.log(`[addProblemComment] No discussion found for problemId: ${problemId}. Attempting to create one.`);
            discussion = new Discussion({ question: problemId, comments: [], isGlobal: false });
            await discussion.save();
            console.log(`[addProblemComment] New discussion created: ${discussion._id}`);
        }

        const newComment = new Comment({
            user: userId,
            text,
            replies: [],
        });
        console.log(`[addProblemComment] New comment created object: ${newComment}`);

        await newComment.save();
        console.log(`[addProblemComment] New comment saved: ${newComment._id}`);

        if (parentId) {
            console.log(`[addProblemComment] ParentId provided: ${parentId}. Finding parent comment.`);
            const parentComment = await Comment.findById(parentId);
            if (!parentComment) {
                console.error(`[addProblemComment] Parent comment not found for parentId: ${parentId}`);
                return res.status(404).json({ message: 'Parent comment not found' });
            }
            parentComment.replies.push(newComment._id);
            await parentComment.save();
            console.log(`[addProblemComment] Added new comment as reply to parent: ${parentId}`);
        } else {
            console.log(`[addProblemComment] No parentId. Adding to discussion's top-level comments.`);
            discussion.comments.push(newComment._id);
            await discussion.save();
            console.log(`[addProblemComment] Added new comment to discussion: ${discussion._id}`);
        }
        
        const populatedComment = await Comment.findById(newComment._id).populate('user', '_id name');
        console.log(`[addProblemComment] Populated new comment: ${populatedComment._id}`);

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error(`[addProblemComment] Catch block error: ${error.message}`, error);
        res.status(400).json({ message: error.message });
    }
};

exports.editComment = async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to edit this comment' });
        }

        comment.text = text;
        await comment.save();

        const populatedComment = await Comment.findById(commentId).populate('user', '_id name');
        res.status(200).json(populatedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this comment' });
        }

        // Remove comment ID from any parent comment's replies array
        await Comment.updateMany(
            { replies: commentId },
            { $pull: { replies: commentId } }
        );

        // Recursively delete replies
        const deleteReplies = async (commentToDelete) => {
            for (const replyId of commentToDelete.replies) {
                const reply = await Comment.findById(replyId);
                if (reply) {
                    await deleteReplies(reply);
                    await Comment.findByIdAndDelete(replyId);
                }
            }
        };

        await deleteReplies(comment);
        await Comment.findByIdAndDelete(commentId);

        // Remove comment from discussion's top-level comments array
        await Discussion.updateMany({}, { $pull: { comments: commentId } });
        
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
        const populatedComment = await Comment.findById(commentId).populate('user', '_id name');
        res.status(200).json(populatedComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};