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
  Box
} from '@chakra-ui/react';

import { FormField } from '../formField/FormField';
import { Donation, Donor, DonationForm } from './types';
import { CloseIcon } from '@chakra-ui/icons';
import { useBackendContext } from '../../contexts/hooks/useBackendContext';

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
    useEffect(() => {
        const weight = donation?.weight || 0;
        const value = donation?.value || 0;
        setTotalValue(weight * value);
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

    const handleEditDonation = async () => {
      try{
          if (donation.id) {
              await backend.put(`/donations/${donation.id}`, donation);
          }
          else{
              await backend.post('/donations', donation);
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
                    <Grid templateColumns="40% 55%" gap={6} alignItems="center">
                        <FormField isRequired label='Donor'>
                          <Select
                              id="donorSelect"
                              name="donor"
                              placeholder="Select Donor"
                              onChange={handleChange}
                              value={donation.donor}
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
                        </FormField>
                        <FormField isRequired label='Date Donated'>
                          <Input
                              type="date"
                              name="date"
                              onChange={handleChange}
                              value={donation.date}
                          />
                        </FormField>
                        <FormField isRequired label='Type'>
                          <Select
                              name="category"
                              onChange={handleChange}
                              value={donation.category}
                          >
                              <option value="">Select Type</option>
                              <option value="food">Food</option>
                              <option value="client">Client</option>
                          </Select>
                        </FormField>

                        <FormField isRequired label='Weight'>
                          <Input
                              type="number"
                              name="weight"
                              onChange={handleChange}
                              value={donation.weight}
                          />
                        </FormField>

                        <FormField isRequired label='Value'>
                          <Input
                              type="number"
                              name="value"
                              onChange={handleChange}
                              value={donation.value}
                          />
                        </FormField>
                        <Divider w='125%'></Divider>
                        <Divider></Divider>
                        <FormField label="Total Value">
                          <Text
                            width="60%"
                            textAlign="right"
                            size="md"
                            fontWeight="semibold"
                            color={totalValue === 0 ? "#718096" : "inherit"}
                          >
                            ${totalValue.toFixed(2)}
                          </Text>
                        </FormField>
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
