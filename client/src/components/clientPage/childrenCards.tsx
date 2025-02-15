import { SimpleGrid, Card, CardHeader, Heading, CardBody, Text, CardFooter, Input, Button} from '@chakra-ui/react'

import {Children} from './ViewPage'

interface ChildrenProps {
    items: Children[];
}

function ChildrenCards({items} : ChildrenProps) {
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
                        <Button>Save</Button>
                    </CardFooter>
                </Card>
            ))}
        </SimpleGrid>
    )
}

export default ChildrenCards;