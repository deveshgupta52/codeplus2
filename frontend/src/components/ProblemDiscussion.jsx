
import React, { useState, useEffect } from 'react';
import { getDiscussion, addComment } from '../api/discussionApi';
import { Comment } from '../components/Comment';
import CommentForm from '../components/CommentForm';

const ProblemDiscussion = ({ problemId }) => {
    const [discussion, setDiscussion] = useState(null);

    useEffect(() => {
        const fetchDiscussion = async () => {
            try {
                const response = await getDiscussion(problemId);
                setDiscussion(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setDiscussion({ comments: [] });
                } else {
                    console.error('Error fetching discussion:', error);
                }
            }
        };
        fetchDiscussion();
    }, [problemId]);

    const handleAddComment = async (text, parentId = null) => {
        try {
            const newComment = await addComment(problemId, { text, parentId });
            setDiscussion(prev => ({...prev, comments: [...prev.comments, newComment.data]}));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Discussion</h2>
            <CommentForm onSubmit={handleAddComment} />
            {discussion && discussion.comments.map((comment) => (
                <Comment key={comment._id} comment={comment} addComment={handleAddComment} />
            ))}
        </div>
    );
};

export default ProblemDiscussion;
