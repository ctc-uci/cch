import { Input, Button} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

interface CommentsProps {
    clientId: number;
}
function Comments(clientId : CommentsProps) {
    const [comment, setComment] = useState<string>('');
    const { backend } = useBackendContext();

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const response = await backend.get(`/clients/${clientId.clientId}`);
                setComment(response.data.comments || '');
            } catch (error) {
                console.log("cant get comment");
            }
        };
        fetchComment();
    }, [clientId]);
    const handleSave = async() => {
        try {
            await backend.put(`/clients/${clientId.clientId}`, {comments: comment});
        } catch (error) {
            console.log("cant save comment");
        }
    }
    return (
        <div>
            <Input placeholder="Type here" 
            value={comment}
            onChange={(e) => setComment(e.target.value)}/>
            <Button onClick={handleSave}>Save</Button>
        </div>
    );
}
export default Comments