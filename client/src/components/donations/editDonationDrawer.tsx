import React, {useState, useEffect} from 'react';
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
  CardBody,
  HStack,
  VStack,
  Text,
  Select,
  Input,
  Grid,
  Divider,
  useToast
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

    function checkForNullValues() {
        if (donation) {
            if (donation.donor === "" || isNaN(donation.date.getTime()) || donation.category === "" || donation.weight === 0 || donation.value === 0) {
                return true;
            }
        }
        return false;
    }

    const toast = useToast();

    function submitEdit() {
        if (checkForNullValues()) {
            toast({
                title: "Missing Information",
                description: "There may be missing or incorrect information",
                status: "warning",
                duration: 9000,
                isClosable: true,
            });
        }
        else {
            handleEditDonation();
            toast({
                title: "Donation Edited",
                description: "Donation has been edited.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        }
    }

    function cancelEdit() {
        const toastId = toast({
            render: () => 
                <Box
                    bg="white"
                    p={5}
                    borderRadius="lg"
                    boxShadow="lg"
                    borderWidth="1px"
                    maxW="sm"
                >
                    {/* Header with title and close button */}
                    <HStack justify="space-between" mb={2}>
                    <Text fontSize="lg" fontWeight="bold">
                        Cancel Edits
                    </Text>
                    <IconButton
                        aria-label="Close"
                        icon={<CloseIcon boxSize={3} />}
                        size="sm"
                        variant="ghost"
                        onClick={() => toast.close(toastId)} // This closes the toast
                    />
                    </HStack>

                    {/* Body text */}
                    <Text mb={4} color="gray.600">
                    Are you sure? Your edits will not be saved.
                    </Text>

                    {/* Buttons */}
                    <HStack justify="flex-end">
                    <Button
                        variant="outline"
                        borderColor="gray.300"
                        color="gray.700"
                        bg="gray.100"
                        _hover={{ bg: "gray.200" }}
                        onClick={() => toast.close(toastId)}
                    >
                        Cancel
                    </Button>
                    <Button
                        bg="blue.600"
                        color="white"
                        _hover={{ bg: "blue.700" }}
                        onClick={() =>{
                            toast.close(toastId);
                            onClose();
                        }}
                    >
                        Yes
                    </Button>
                    </HStack>
                </Box>
        })
    }

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
                        <Divider w='125%'></Divider>
                        <Divider></Divider>
                        <Text textAlign="left" fontWeight="bold">Total</Text>
                        <Text textAlign="left" fontWeight="bold">$ {donation ? donation.weight * donation.value : 0}</Text>
                    </Grid>
                </VStack>
                </CardBody>
            </Card>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={cancelEdit}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={submitEdit}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
}

export default EditDrawer;
