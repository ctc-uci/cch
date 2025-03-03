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
  const [donations, setDonations] = useState<Donation[]>(
    [{
      donor: '',
      sub: [{ date: new Date(), category: '', weight: 0, value: 0 }],
    }]);
  const btnRef = React.useRef()
  const { backend } = useBackendContext();


  const handleAddDonor = () => {
    setDonations((prevDonations) => [
      ...prevDonations,
      {
        donor: '',
        sub: [{ date: new Date(), category: '', weight: 0, value: 0 }],
    },
    ]);
    console.log(donations);
  };

  const handleDonationSubmit = (updatedDonation: Donation, index: number) => {
    const updatedDonations = [...donations];
    updatedDonations[index] = updatedDonation;
    setDonations(updatedDonations);
  };

  const handleSubmitAllDonations = async () => {
    for (const donation of donations) {
      if (donation.donor === "costco") {
        for (const sub of donation.sub) {
          try {
            const Costco = {
              date: sub.date.toISOString().split("T")[0], // Convert to string
              amount: sub.value,
              category: sub.category
            };   
            await backend.post("/costcoDonations", Costco);
          } catch (err) {
            console.error(err);
          }
        }
        
      } else {
        for (const sub of donation.sub) {
          try {
            const Food = {
              date: sub.date,
              weight: sub.weight,
              value: sub.value,
              category: donation.donor
            };
            await backend.post("/foodDonations", Food);
            console.log(Food);
          } catch (err) {
            console.error(err);
        }
        }
        
      }
    }
  };

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Add Donation
      </Button>
      <Drawer isOpen={isOpen} placement="right" size="lg" onClose={onClose}>
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