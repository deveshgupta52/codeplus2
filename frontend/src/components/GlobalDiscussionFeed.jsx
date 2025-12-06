import React, { useState, useEffect } from 'react';
import { getGlobalDiscussions, createGlobalDiscussion, addGlobalComment, deleteComment, editComment, likeComment, getSingleGlobalDiscussion } from '../api/discussionApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/Dialog';
import { Comment } from './Comment';
import CommentForm from './CommentForm';

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground));
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted));
  }
`;

const GlobalDiscussionFeed = () => {
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
    const [newDiscussionText, setNewDiscussionText] = useState('');

    useEffect(() => {
        fetchDiscussions();
    }, []);

    const fetchDiscussions = async () => {
        try {
            setLoading(true);
            const response = await getGlobalDiscussions();
            setDiscussions(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching discussions:', err);
            setError('Failed to load discussions.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDiscussion = (discussion) => {
        setSelectedDiscussion(discussion);
        setIsDialogOpen(true);
    };

    const handleCloseDiscussion = () => {
        setSelectedDiscussion(null);
        setIsDialogOpen(false);
        fetchDiscussions(); // Refresh the main list after closing the dialog
    };

    const handleCreateDiscussion = async () => {
        if (!newDiscussionTitle.trim() || !newDiscussionText.trim()) {
            alert('Title and text cannot be empty.');
            return;
        }
        try {
            const response = await createGlobalDiscussion({ title: newDiscussionTitle, text: newDiscussionText });
            setDiscussions(prev => [response.data, ...prev]);
            setNewDiscussionTitle('');
            setNewDiscussionText('');
        } catch (err) {
            console.error('Error creating discussion:', err);
            alert('Failed to create discussion.');
        }
    };

    const handleAddComment = async (text, parentId = null) => {
        try {
            await addGlobalComment(selectedDiscussion._id, { text, parentId });
            const response = await getSingleGlobalDiscussion(selectedDiscussion._id);
            setSelectedDiscussion(response.data);
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment.');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            const response = await getSingleGlobalDiscussion(selectedDiscussion._id);
            setSelectedDiscussion(response.data);
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment.');
        }
    };

    const handleEditComment = async (commentId, text) => {
        try {
            await editComment(commentId, { text });
            const response = await getSingleGlobalDiscussion(selectedDiscussion._id);
            setSelectedDiscussion(response.data);
        } catch (error) {
            console.error('Error editing comment:', error);
            alert('Failed to edit comment.');
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            await likeComment(commentId);
            const response = await getSingleGlobalDiscussion(selectedDiscussion._id);
            setSelectedDiscussion(response.data);
        } catch (error) {
            console.error('Error liking comment:', error);
            alert('Failed to like comment.');
        }
    };

    if (loading) return <p>Loading discussions...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Global Discussions</h1>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Create New Discussion</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Discussion Title"
                        value={newDiscussionTitle}
                        onChange={(e) => setNewDiscussionTitle(e.target.value)}
                        className="mb-3"
                    />
                    <Textarea
                        placeholder="What's on your mind?"
                        value={newDiscussionText}
                        onChange={(e) => setNewDiscussionText(e.target.value)}
                        className="mb-3"
                    />
                    <Button onClick={handleCreateDiscussion}>Post Discussion</Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {discussions.length === 0 ? (
                    <p>No discussions yet. Be the first to start one!</p>
                ) : (
                    discussions.map((discussionItem) => (
                        <Card key={discussionItem._id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleOpenDiscussion(discussionItem)}>
                            <CardHeader>
                                <CardTitle>{discussionItem.title}</CardTitle>
                                {discussionItem.comments && discussionItem.comments.length > 0 && (
                                    <CardDescription>
                                        Started by {discussionItem.comments[0].user ? discussionItem.comments[0].user.name : 'Unknown User'} on {new Date(discussionItem.comments[0].createdAt).toLocaleDateString()}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                {discussionItem.comments && discussionItem.comments.length > 0 && (
                                    <p className="line-clamp-2">{discussionItem.comments[0].text}</p>
                                )}
                                <div className="text-sm text-muted-foreground mt-2">
                                    {discussionItem.comments.length} comments
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {selectedDiscussion && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>{selectedDiscussion.title}</DialogTitle>
                            {selectedDiscussion.comments && selectedDiscussion.comments.length > 0 && (
                                <DialogDescription>
                                    Started by {selectedDiscussion.comments[0].user ? selectedDiscussion.comments[0].user.name : 'Unknown User'} on {new Date(selectedDiscussion.comments[0].createdAt).toLocaleDateString()}
                                </DialogDescription>
                            )}
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                            {selectedDiscussion.comments.map((comment) => (
                                <Comment
                                    key={comment._id}
                                    comment={comment}
                                    addComment={handleAddComment}
                                    editComment={handleEditComment}
                                    deleteComment={handleDeleteComment}
                                    likeComment={handleLikeComment}
                                />
                            ))}
                        </div>
                        <DialogFooter className="mt-4 flex-shrink-0">
                            <CommentForm onSubmit={handleAddComment} />
                            <Button variant="outline" onClick={handleCloseDiscussion}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default GlobalDiscussionFeed;