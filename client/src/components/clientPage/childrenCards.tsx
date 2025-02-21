import { useState } from "react";
import { 
    SimpleGrid, Card, CardHeader, Heading, 
    CardBody, Text, CardFooter, Input, Button 
} from "@chakra-ui/react";
import toSnakeCase from "../../utils/snakeCase";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Children } from "./ViewPage";

interface ChildrenProps {
    items: Children[];
}

function ChildrenCards({ items }: ChildrenProps) {
    const { backend } = useBackendContext();
    
    // State to store comments per child
    const [comments, setComments] = useState<{ [key: number]: string }>({});

    // Handle input change
    const handleCommentChange = (childId: number, newComment: string) => {
        setComments(prevComments => ({
            ...prevComments,
            [childId]: newComment,
        }));
    };

    // Save changes for a specific child
    const handleSaveChanges = async (childId: number) => {
        try {
            const comment = comments[childId];
            if (!comment) {
                console.error("No comment to save!");
                return;
            }

            const updatedData = toSnakeCase({ comment });

            await backend.put(`/children/${childId}`, updatedData);

            console.log(`Updated comment for child ${childId}:`, comment);
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    return (
        <SimpleGrid spacing={4} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
            {items.map((item: Children) => (
                <Card key={item.id}>
                    <CardHeader>
                        <Heading>{item.firstName} {item.lastName}</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>{item.dateOfBirth}</Text>
                    </CardBody>
                    <CardFooter>
                        <Input 
                            placeholder="Enter comment"
                            value={comments[item.id] || ""}
                            onChange={(e) => handleCommentChange(item.id, e.target.value)}
                        />
                        <Button onClick={() => handleSaveChanges(item.id)} value={item.comments}>Save</Button>
                    </CardFooter>
                </Card>
            ))}
        </SimpleGrid>
    );
}

export default ChildrenCards;