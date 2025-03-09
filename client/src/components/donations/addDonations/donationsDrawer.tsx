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
      sub: [{ date: new Date(), category: '', weight: -1, value: -1 }],
    }]);
  const btnRef = React.useRef()
  const { backend } = useBackendContext();
  const toast = useToast();


  const handleAddDonor = () => {
    setDonations((prevDonations) => [
      ...prevDonations,
      {
        donor: '',
        sub: [{ date: new Date(), category: '', weight: -1, value: -1 }],
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
            if (Costco.amount === - 1 || Costco.category === "") {
              toast({
                title: "Missing Information",
                description: "There was missing information.",
                status: "warning",
                duration: 5000,
                isClosable: true,
              });
            } else {
              await backend.post("/costcoDonations", Costco);
              const currentTime = new Date();
              let hours = currentTime.getHours();
              let minutes = currentTime.getMinutes();
              const ampm = hours >= 12 ? 'PM' : 'AM';

              hours = hours % 12;
              hours = hours ? hours : 12;
              minutes = minutes < 10 ? '0' + minutes : minutes;
              const formattedTime = `${hours}:${minutes} ${ampm} ${currentTime.toISOString().split('T')[0]}`;
              toast({
                title: "Donation Added",
                description: `The donation has been successfully added into the database at ${formattedTime}.`,
                status: "success",
                duration: 5000,
                isClosable: true,
              });
              closeDrawer();
            }
            
          } catch (err) {
            toast({
              title: "Donation Not Added",
              description: "There was something wrong that happened and the donation was not added.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            closeDrawer();
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
            if (Food.weight === - 1 || Food.value === -1 || Food.category === "") {
              toast({
                title: "Missing Information",
                description: "There was missing information.",
                status: "warning",
                duration: 5000,
                isClosable: true,
              });
            } else {
              await backend.post("/foodDonations", Food);
              const currentTime = new Date();
              let hours = currentTime.getHours();
              let minutes = currentTime.getMinutes();
              const ampm = hours >= 12 ? 'PM' : 'AM';

              hours = hours % 12;
              hours = hours ? hours : 12;
              minutes = minutes < 10 ? '0' + minutes : minutes;
              const formattedTime = `${hours}:${minutes} ${ampm} ${currentTime.toISOString().split('T')[0]}`;

              toast({
                title: "Donation Added",
                description: `The donation has been successfully added into the database at ${formattedTime}.`,
                status: "success",
                duration: 5000,
                isClosable: true,
              });
              closeDrawer();
            }
    
          } catch (err) {
            toast({
              title: "Donation Not Added",
              description: "There was something wrong that happened and the donation was not added.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            closeDrawer();
            console.error(err);
        }
        }
        
      }
    }
  };
  const resetData = () => {
    setDonations([{donor: '', sub: [{ date: new Date(), category: '', weight: -1, value: -1 }],}])
  }
  return (
    <>
      <Button ref={btnRef} colorScheme="blue" onClick={openDrawer} sx={{ width: "250px", padding: "12px 24px" }}>
        Add Donation
      </Button>
      <Drawer isOpen={isDrawerOpen} placement="right" onClose={closeDrawer} closeOnOverlayClick={false} size="xl">
        <DrawerOverlay />
        <DrawerContent>
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
            <Button colorScheme="blue" onClick={() => { handleSubmitAllDonations(); resetData();}}>
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
            <Button colorScheme="blue" mr={3} onClick={() => {resetData(); closeModal(); closeDrawer();}}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default DonationsDrawer;