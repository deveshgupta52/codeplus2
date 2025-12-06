
import { useState, useContext } from "react";
import CommentForm from "./CommentForm";
import { useAuth } from "../context/AuthContext";

export function Comment({ comment, addComment, editComment, deleteComment, likeComment, level = 0 }) {
    const { user } = useAuth();
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const hasReplies = comment.replies && comment.replies.length > 0;
    const canEdit = user && user._id === comment.user._id;
    const canDelete = user && user._id === comment.user._id;

    const handleReply = (text) => {
        addComment(text, comment._id);
        setIsReplying(false);
    };

    const handleEdit = (text) => {
        editComment(comment._id, text);
        setIsEditing(false);
    };

    const handleLike = () => {
        likeComment(comment._id);
    };

    return (
        <div className={`relative border border-gray-700 rounded-sm p-8 mt-4`}>
            <div className="group absolute left-[-12px] top-0 bottom-0 w-[1px] ml-8 mt-2 mb-2 bg-gray-200 cursor-pointer hover:bg-purple-400" onClick={() => setShowReplies(!showReplies)}>
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    {hasReplies && (
                        <div className="w-5 h-5 rounded-full border border-gray-400 text-center text-sm leading-4 font-bold bg-white text-purple-700 group-hover:bg-purple-100 group-hover:border-purple-400 group-hover:text-purple-900 flex items-center justify-center">
                            {showReplies ? '−' : '+'}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-full bg-gray-600 flex-shrink-0 overflow-hidden">
                    {/* Add user image here if available */}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="font-semibold">{comment.user.name}</span>
                        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    {isEditing ? (
                        <CommentForm
                            initialText={comment.text}
                            onSubmit={handleEdit}
                            isEdit={true}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <p className="text-sm text-gray-100 mt-1">{comment.text}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                        <button onClick={handleLike} className="hover:underline">{comment.likes.length} Likes</button>
                        <button onClick={() => setIsReplying(!isReplying)} className="hover:underline">Reply</button>
                        {canEdit && <button onClick={() => setIsEditing(!isEditing)} className="hover:underline">Edit</button>}
                        {canDelete && <button onClick={() => deleteComment(comment._id)} className="hover:underline">Delete</button>}
                    </div>
                    {isReplying && (
                        <div className="mt-4">
                            <CommentForm onSubmit={handleReply} />
                        </div>
                    )}
                    {hasReplies && (
                        <div className="mt-4">
                            <button onClick={() => setShowReplies(!showReplies)} className="hover:underline text-xs text-gray-400">
                                {showReplies
                                    ? `Hide replies (${comment.replies.length})`
                                    : `View replies (${comment.replies.length})`}
                            </button>
                        </div>
                    )}
                    {showReplies && comment.replies.map((reply) => (
                        <Comment
                            key={reply._id}
                            comment={reply}
                            addComment={addComment}
                            editComment={editComment}
                            deleteComment={deleteComment}
                            likeComment={likeComment}
                            level={level + 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
