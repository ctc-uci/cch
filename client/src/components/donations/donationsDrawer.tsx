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
import DonationCard, {Donation} from './donationsCard'
import { useBackendContext } from '../../contexts/hooks/useBackendContext';
function DonationsDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [donations, setDonations] = useState<Donation[]>([]);
  const btnRef = React.useRef()
  const { backend } = useBackendContext();


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

  const handleDonationSubmit = (updatedDonation: Donation, index: number) => {
    const updatedDonations = [...donations];
    updatedDonations[index] = updatedDonation; // Update the donation at the specified index
    setDonations(updatedDonations);
  };

  const handleSubmitAllDonations = async () => {
    console.log(donations);
    for (const donation of donations) {
      if (donation.donor === "costco") {
        try {
          //category or type becomes category
          //const costcoResponse = await backend.post()
        } catch (err) {
          err.log();
        }
      } else {
        //fooddonation table
      }
    }
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