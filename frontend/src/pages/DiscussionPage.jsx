
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getDiscussion, addComment, likeComment } from "../api/discussionApi";
import { getQuestionById } from "../api/questionApi";
import { Comment } from "../components/Comment";
import CommentForm from "../components/CommentForm";
import { useAuth } from "../context/AuthContext";

const DiscussionPage = () => {
    const { problemId } = useParams();
    const { user } = useAuth();
    const [question, setQuestion] = useState(null);
    const [discussion, setDiscussion] = useState(null);

    useEffect(() => {
        const fetchDiscussion = async () => {
            try {
                const questionRes = await getQuestionById(problemId);
                setQuestion(questionRes.data);
                const discussionRes = await getDiscussion(problemId);
                setDiscussion(discussionRes.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setDiscussion({ comments: [] });
                } else {
                    console.error("Error fetching discussion:", error);
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
            console.error("Error adding comment:", error);
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const updatedComment = await likeComment(commentId);
            const updateLikes = (comments) => {
                return comments.map(comment => {
                    if (comment._id === commentId) {
                        return updatedComment.data;
                    }
                    if (comment.replies.length > 0) {
                        return { ...comment, replies: updateLikes(comment.replies) };
                    }
                    return comment;
                });
            };
            setDiscussion({ ...discussion, comments: updateLikes(discussion.comments) });
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            {question && <h1 className="text-3xl font-bold mb-4">{question.title}</h1>}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Add a comment</h2>
                <CommentForm onSubmit={handleAddComment} />
            </div>
            {discussion && discussion.comments.map((comment) => (
                <Comment
                    key={comment._id}
                    comment={comment}
                    addComment={handleAddComment}
                    likeComment={handleLikeComment}
                />
            ))}
        </div>
    );
};

export default DiscussionPage;
