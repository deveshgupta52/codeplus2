
import { useState, useContext } from "react";
import CommentForm from "./CommentForm";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function Comment({ comment, addComment, editComment, deleteComment, likeComment, level = 0 }) {
    const { user } = useAuth();
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    if (!comment) {
        return null;
    }

    const hasReplies = comment.replies && comment.replies.length > 0;
    const isOwner = user && comment.user && user._id === comment.user._id;
    const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin'); // Assuming user object from AuthContext has a role
    const canEdit = isOwner;
    const canDelete = isOwner || isAdmin;

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

    const handleDelete = () => {
        deleteComment(comment._id);
    };

    return (
        <Card className={`mt-4 ${level > 0 ? 'ml-8' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-x-3 p-4 pb-2">
                <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-full bg-gray-600 flex-shrink-0 overflow-hidden">
                        {/* Add user image here if available */}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span className="font-semibold">{comment.user ? comment.user.name : 'Unknown User'}</span>
                            <span className="text-xs text-gray-400">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown Date'}</span>
                        </div>
                    </div>
                </div>
                {canDelete && (
                    <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-2">
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
                    <Button variant="ghost" size="sm" onClick={handleLike}>
                        {comment.likes ? comment.likes.length : 0} Likes
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)}>
                        Reply
                    </Button>
                    {canEdit && (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                            Edit
                        </Button>
                    )}
                </div>
                {isReplying && (
                    <div className="mt-4">
                        <CommentForm onSubmit={handleReply} />
                    </div>
                )}
                {hasReplies && (
                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={() => setShowReplies(!showReplies)}>
                            {showReplies
                                ? `Hide replies (${comment.replies.length})`
                                : `View replies (${comment.replies.length})`}
                        </Button>
                    </div>
                )}
                {showReplies && comment.replies.map((reply) => (
                    <div key={reply._id}>
                        <Comment
                            comment={reply}
                            addComment={addComment}
                            editComment={editComment}
                            deleteComment={deleteComment}
                            likeComment={likeComment}
                            level={level + 1}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
