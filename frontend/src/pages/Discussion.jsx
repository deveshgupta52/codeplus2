
import React, { useState, useEffect } from 'react';
import { getDiscussion } from '../api/discussionApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '../components/ui/Drawer';
import { Comment } from '../components/Comment';
import CommentForm from '../components/CommentForm';

const Discussion = () => {
    const [discussions, setDiscussions] = useState([]);
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);

    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                const response = await getDiscussion('all');
                setDiscussions(response.data);
            } catch (error) {
                console.error('Error fetching discussions:', error);
            }
        };
        fetchDiscussions();
    }, []);

    const handleDiscussionClick = (discussion) => {
        setSelectedDiscussion(discussion);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Discussions</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {discussions.map((discussion) => (
                    <Card key={discussion._id} onClick={() => handleDiscussionClick(discussion)} className="cursor-pointer">
                        <CardHeader>
                            <CardTitle>{discussion.question.title}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
            <Drawer open={selectedDiscussion !== null} onOpenChange={(open) => !open && setSelectedDiscussion(null)}>
                <DrawerContent>
                    {selectedDiscussion && (
                        <>
                            <DrawerHeader>
                                <DrawerTitle>{selectedDiscussion.question.title}</DrawerTitle>
                            </DrawerHeader>
                            <div className="p-4">
                                <CommentForm onSubmit={() => {}} />
                                {selectedDiscussion.comments.map((comment) => (
                                    <Comment key={comment._id} comment={comment} />
                                ))}
                            </div>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default Discussion;
