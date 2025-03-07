import React, {useState, useEffect} from 'react';
import { useDisclosure } from '@chakra-ui/hooks'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  HStack,
  VStack,
  Text,
  Select,
  Input,
  Grid,
  Divider,
} from '@chakra-ui/react';

interface Donation {
    id: number,
    donor: string,
    date: Date,
    category: string,
    weight: number,
    value: number,
}

interface EditDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    existingDonation: Donation | null;
    onSubmit: (updatedDonation: Donation) => void;
}

const EditDrawer: React.FC<EditDrawerProps> = ({isOpen, onClose, existingDonation, onSubmit}) => {
    const [donation, setDonation] = useState<Donation | null>(existingDonation);

    useEffect(() => {
        setDonation(existingDonation);
      }, [existingDonation]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (donation) {
            setDonation({
                ...donation,
                [e.target.name]: e.target.value,
            });
        }
      };

    const handleEditDonation = () => {
        if (donation) {
            onSubmit(donation);
            onClose();
        }
    };

    return (
        <Drawer isOpen={isOpen} placement="right" size="lg" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Donations</DrawerHeader>
          <DrawerBody>
            <Card>
                <CardBody>
                <VStack spacing={4} align="stretch">
                    <Grid templateColumns="40% 55%" gap={6} alignItems="center">
                        <Text textAlign="left" fontWeight="bold">Donor</Text>
                        <Select
                            id="donorSelect"
                            name="donor"
                            placeholder="Select Donor"
                            onChange={handleChange}
                            value={donation ? donation.donor : ""}
                        >
                            <option value="panera">Panera</option>
                            <option value="sprouts">Sprouts</option>
                            <option value="copia">Copia</option>
                            <option value="mcdonalds">McDonald's</option>
                            <option value="pantry">Pantry</option>
                            <option value="grand theater">Grand Theater</option>
                            <option value="costco">Costco</option>
                        </Select>

                        <Text textAlign="left" fontWeight="bold">Date Donated</Text>
                        <Input 
                            type="date" 
                            name="date" 
                            onChange={handleChange} 
                            value={donation && donation.date instanceof Date ? donation.date.toISOString().split("T")[0] : ""} 
                        />

                        <Text textAlign="left" fontWeight="bold">Type</Text>
                        <Select
                            name="type"
                            onChange={handleChange}
                            value={donation ? donation.category : ""}
                        >
                            <option value="food">Food</option>
                            <option value="client">Client</option>
                        </Select>

                        <Text textAlign="left" fontWeight="bold">Weight</Text>
                        <Input 
                            type="number" 
                            name="weight" 
                            onChange={handleChange} 
                            value={donation ? donation.weight : ""}
                        />

                        <Text textAlign="left" fontWeight="bold">Value</Text>
                        <Input 
                            type="number" 
                            name="value" 
                            onChange={handleChange} 
                            value={donation ? donation.value : ""}
                        />
                        <Divider/>
                    </Grid>
                </VStack>
                </CardBody>
            </Card>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleEditDonation}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
}

export default EditDrawer;
