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
  useToast,
  IconButton,
  Box,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';

import { FormField } from '../formField/FormField';
import { Donation, Donor, DonationForm } from './types';
import { CloseIcon } from '@chakra-ui/icons';
import { useBackendContext } from '../../contexts/hooks/useBackendContext';
import { DonationFilter } from '../donations/DonationFilter';
import { formatDateForInput } from "../../utils/dateUtils";

interface EditDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    existingDonation?: Donation;
    onFormSubmitSuccess: () => void;
}

const EditDrawer: React.FC<EditDrawerProps> = ({isOpen, onClose, existingDonation, onFormSubmitSuccess }) => {
    const initialDonation: DonationForm = {
        donor: existingDonation?.donor || "",
        category: existingDonation?.category || "",
        id: existingDonation?.id || null,
        date: existingDonation?.date ? formatDateForInput(existingDonation.date) : "",
        weight: existingDonation?.weight || 0,
        value: existingDonation?.value || 0,
    }
    const { backend } = useBackendContext();
    const [donation, setDonation] = useState<DonationForm>(initialDonation);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [donor, setDonor] = useState<string>("");
    const [donors, setDonors] = useState<string[]>([]);
    const [newDonor, setNewDonor] = useState<string>("");
    //const [filterQuery, setFilterQuery] = useState<string[]>([]);

    const handleAddDonor = async () => {
      try {
        await backend.post("/donations/donors", {
          name: newDonor,
        });
        setDonors((prev) => [...prev, newDonor]);
        setNewDonor("");
      } catch (error) {
        console.error("Error adding donor:", error);
      }
    }

    useEffect(() => {
        const weight = donation?.weight || 0;
        const value = donation?.value || 0;
        setTotalValue(weight * value);

        const fetchData = async () => {
            try {
                const response = await backend.get<Donor[]>('/donations/donors');
                setDonors(response.data);
            } catch (error) {
                console.error("Error fetching donors:", error);
            }
        }
        fetchData();
      }, [donation]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDonation((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
      };

      const toast = useToast();

    //Need to adjust this to just edit
    const handleEditDonation = async () => {
      try{
          if (donation.id) {
              await backend.put(`/donations/${donation.id}`, donation);
          }
          else{
              await backend.post('/donations', {...donation, donor});
          }
          toast({
            title: donation.id ? "Donation Edited": "Donation Added",
            description: donation.id ? "Donation has been edited.": "Donation has been added.",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        setDonation(initialDonation);
        onFormSubmitSuccess();
        onClose();
      }
      catch (error) {
        toast({
            title: "Error",
            description: donation.id ? "Error editing donation." : "Error adding donation.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
      }
    };

    function submitEdit() {
        handleEditDonation();
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
          <DrawerHeader>{initialDonation.id ? 'Edit Donations' : 'Add Donations'}</DrawerHeader>
          <DrawerBody>
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Grid templateColumns="1fr 2fr" gap={4} alignItems="center">
                    <Text textAlign="left" fontWeight="semibold">Date Donated</Text>
                    <Input
                      type="date"
                      name="date"
                      onChange={handleChange}
                      value={donation.date}
                      textAlign="left"
                      width="100%"
                    />
    
                    <Text textAlign="left" fontWeight="semibold">Donor</Text>
                    <Select
                      id="donorSelect"
                      name="donor"
                      placeholder="Select Donor"
                      onChange={handleChange}
                      value={donation.donor}
                      textAlign="left"
                      width="100%"
                    >
                      {Object.keys(Donor).map(key => {
                        const value = Donor[key as keyof typeof Donor];
                        return (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        );
                      })}
                    </Select>
    
                    <Text textAlign="left" fontWeight="semibold">Type</Text>
                    <Text textAlign="left" fontWeight="medium">
                      {donation.category === 'food' ? 'Food' : donation.category === 'client' ? 'Client' : ''}
                    </Text>
    
                    <Text textAlign="left" fontWeight="semibold">Total Weight (pounds)</Text>
                    <Input
                      type="number"
                      name="weight"
                      onChange={handleChange}
                      value={donation.weight}
                      textAlign="left"
                      width="100%"
                    />
    
                    <Text textAlign="left" fontWeight="semibold">Value Per Pound</Text>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        color="gray.500"
                        children="$"
                      />
                      <Input
                        type="number"
                        name="value"
                        onChange={handleChange}
                        value={donation.value}
                        textAlign="left"
                        width="100%"
                      />
                    </InputGroup>
    
                    <Divider gridColumn="1 / -1" />
    
                    <Text textAlign="left" fontWeight="semibold">Total Value</Text>
                    <Text textAlign="left" fontWeight="bold">
                      ${totalValue.toFixed(2)}
                    </Text>
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
    );
      
}

export default EditDrawer;
