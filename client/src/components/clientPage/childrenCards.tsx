import { SimpleGrid, Card, CardHeader, Heading, CardBody, Text, CardFooter, Input, Button} from '@chakra-ui/react'
import {toSnakeCase} from "../../utils/toSnakeCase";
import {Children} from './ViewPage'
import { useBackendContext } from '../../contexts/hooks/useBackendContext';
interface ChildrenProps {
    items: Children[];
}
const handleSaveChanges = async () => {
    try {
        if (!) {
            console.error("Client data is undefined!");
            return; // Exit early if `client` is undefined
        }
        const clientData = toSnakeCase(client);
        await backend.put(`/clients/${client.id}`, clientData);
    } catch (error) {
        console.error("Error updating client information:", error.message);
    }
};

function ChildrenCards({items} : ChildrenProps) {
    const { backend } = useBackendContext();
    return (
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
            {items.map((item: Children, index: number) => (
                <Card key={index}>
                    <CardHeader>
                        <Heading>{item.firstName} {item.lastName}</Heading>
                    </CardHeader>
                    <CardBody> 
                        <Text>{item.dateOfBirth}</Text>
                    </CardBody>
                    <CardFooter>
                        <Input/>
                        <Button onClick={handleSaveChanges}>Save</Button>
                    </CardFooter>
                </Card>
            ))}
        </SimpleGrid>
    )
}

export default ChildrenCards;