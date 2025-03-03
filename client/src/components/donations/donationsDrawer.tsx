import React, {useState} from 'react';
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
} from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import { Card, CardHeader, CardBody, CardFooter, Text,  Input, InputGroup, InputRightAddon, InputLeftAddon} from '@chakra-ui/react'

interface Donation {
    donor: string,
    date: Date,
    category: string,
    weight: number,
    value: number,
}
function DonationCard({ donationToEdit, onSubmit }: { donationToEdit?: Donation, onSubmit: (donation: Donation) => void }) {
  const [donation, setDonation] = useState<Donation>(
    donationToEdit || {
      donor: '',
      date: new Date(),
      category: '',
      weight: 0,
      value: 0,
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDonation((prevDonation) => ({
      ...prevDonation,
      [name]: name === 'date' ? new Date(value) : value, // Handle date separately
    }));
  };

  return (
    <Card>
      <CardHeader>Donation Form</CardHeader>

      <CardBody>
        <Text>Donor</Text>
        <Select
          name="donor"
          placeholder="Select Donor"
          value={donation.donor}
          onChange={handleInputChange}
        >
          <option value="Option1">Option 1</option>
          {/* Add more donor options here */}
        </Select>
      </CardBody>

      <CardBody>
        <Text>Date Donated</Text>
        <Input
          name="date"
          type="date"
          value={donation.date.toISOString().split('T')[0]} // Format the date as YYYY-MM-DD
          onChange={handleInputChange}
        />
      </CardBody>

      <CardBody>
        <Text>Category</Text>
        <Input
          name="category"
          value={donation.category}
          placeholder="Food"
          onChange={handleInputChange}
        />
      </CardBody>

      <CardBody>
        <Text>Total Weight</Text>
        <InputGroup>
          <Input
            name="weight"
            type="number"
            placeholder="XX"
            value={donation.weight}
            onChange={handleInputChange}
          />
          <InputRightAddon children="lbs" />
        </InputGroup>
      </CardBody>

      <CardBody>
        <Text>Value per lbs</Text>
        <InputGroup>
          <InputLeftAddon children="$" />
          <Input
            name="value"
            type="number"
            placeholder="0.00"
            value={donation.value}
            onChange={handleInputChange}
          />
        </InputGroup>
      </CardBody>

      <CardFooter color="blue.500" fontWeight="bold">
        + Add Donation
      </CardFooter>
    </Card>
  );
}


function DonationsDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donations, setDonations] = useState<Donation[]>([]); // Track multiple donations
  const btnRef = React.useRef()
  // Handle adding a new donation card (new empty donation object)
  const handleAddDonor = () => {
    setDonations((prevDonations) => [
      ...prevDonations,
      {
        donor: '',
        date: new Date(),
        category: '',
        weight: 0,
        value: 0,
      },
    ]);
  };

  // Handle donation submission from individual DonationCard
  const handleDonationSubmit = (updatedDonation: Donation, index: number) => {
    const updatedDonations = [...donations];
    updatedDonations[index] = updatedDonation; // Update the donation at the specified index
    setDonations(updatedDonations);
  };

  // Handle submit all donations (just log to console)
  const handleSubmitAllDonations = () => {
    console.log('All Donations:', donations);
    // Log the array of donations to the console
  };

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Add Donation
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Donations</DrawerHeader>
          <DrawerBody>
            {/* Render a DonationCard for each donation */}
            {donations.map((donation, index) => (
              <DonationCard
                key={index} // Use index as key
                donationToEdit={donation}
                onSubmit={(updatedDonation) =>
                  handleDonationSubmit(updatedDonation, index)
                }
              />
            ))}
            <Button colorScheme="blue" onClick={handleAddDonor}>
              Add Donor
            </Button>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmitAllDonations}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default DonationsDrawer;