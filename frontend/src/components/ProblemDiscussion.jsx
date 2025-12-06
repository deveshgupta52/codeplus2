import React, { useState, useEffect } from 'react';
import { getProblemDiscussion, addProblemComment, deleteComment, editComment, likeComment } from '../api/discussionApi';
import { Comment } from './Comment';
import CommentForm from './CommentForm';

const ProblemDiscussion = ({ problemId }) => {
    const [discussion, setDiscussion] = useState(null);

    const fetchDiscussion = async () => {
        try {
            const response = await getProblemDiscussion(problemId);
            setDiscussion(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setDiscussion({ comments: [] });
            } else {
                console.error('Error fetching discussion:', error);
                setDiscussion(null); // Set discussion to null on error to indicate no discussion
            }
        }
    };

    useEffect(() => {
        fetchDiscussion();
    }, [problemId]);

    const handleAddComment = async (text, parentId = null) => {
        try {
            await addProblemComment(problemId, { text, parentId });
            await fetchDiscussion(); // Re-fetch the discussion to get the updated comments
        } catch (error) {
            console.error('Error adding comment:', error);
            // Optionally show a toast or alert to the user
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            await fetchDiscussion(); // Re-fetch the discussion to get the updated comments
        } catch (error) {
            console.error('Error deleting comment:', error);
            // Optionally show a toast or alert to the user
        }
    };

    const handleEditComment = async (commentId, text) => {
        try {
            await editComment(commentId, { text });
            await fetchDiscussion(); // Re-fetch the discussion to get the updated comments
        } catch (error) {
            console.error('Error editing comment:', error);
            // Optionally show a toast or alert to the user
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            await likeComment(commentId);
            await fetchDiscussion(); // Re-fetch the discussion to get the updated comments
        } catch (error) {
            console.error('Error liking comment:', error);
            // Optionally show a toast or alert to the user
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Discussion</h2>
            <CommentForm onSubmit={handleAddComment} />
            {discussion && discussion.comments.map((comment) => (
                <Comment 
                    key={comment._id} 
                    comment={comment} 
                    addComment={handleAddComment} 
                    deleteComment={handleDeleteComment} 
                    editComment={handleEditComment}
                    likeComment={handleLikeComment}
                />
            ))}
        </div>
    );
};

export default ProblemDiscussion;