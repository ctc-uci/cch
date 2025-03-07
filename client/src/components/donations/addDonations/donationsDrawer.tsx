import React, {useState} from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@chakra-ui/react'
import DonationCard, {Donation} from './donationsCard'

import { useBackendContext } from '../../../contexts/hooks/useBackendContext';
function DonationsDrawer() {
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  //const { isOpen, onOpen, onClose } = useDisclosure();
  const [donations, setDonations] = useState<Donation[]>(
    [{
      donor: '',
      sub: [{ date: new Date(), category: '', weight: 0, value: 0 }],
    }]);
  const btnRef = React.useRef()
  const { backend } = useBackendContext();
  const toast = useToast();


  const handleAddDonor = () => {
    setDonations((prevDonations) => [
      ...prevDonations,
      {
        donor: '',
        sub: [{ date: new Date(), category: '', weight: 0, value: 0 }],
    },
    ]);
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
          } catch (err) {
            console.error(err);
        }
        }
        
      }
    }
  };

  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={openDrawer} sx={{ width: "250px", padding: "12px 24px" }}>
        Add Donation
      </Button>
      <Drawer isOpen={isDrawerOpen} placement="right" size="lg" onClose={closeDrawer} closeOnOverlayClick={false}>
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
            <Button size="sm" colorScheme="blue" onClick={handleAddDonor}>
              Add Donor
            </Button>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={() => {openModal();}}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={() => { handleSubmitAllDonations(); closeDrawer(); }}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Cancel Adding Donations</ModalHeader>
          <ModalBody>
            Are you sure? You can't undo this action afterwards.
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={closeModal}>
              Cancel
            </Button>
            <Button colorScheme="blue" mr={3} onClick={() => {setDonations([{donor: '', sub: [{ date: new Date(), category: '', weight: 0, value: 0 }],}]); closeModal(); closeDrawer();}}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default DonationsDrawer;