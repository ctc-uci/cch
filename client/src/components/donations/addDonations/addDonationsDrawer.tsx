import React, { useCallback, useEffect, useRef, useState } from "react";

import { useDisclosure } from "@chakra-ui/hooks";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import DonationCard, { Donation } from "./donationsCard";

interface AddDonationsDrawerProps {
  refresh: () => void;
}

function AddDonationsDrawer({ refresh }: AddDonationsDrawerProps) {
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const initialDonations: Donation[] = [
    {
      donor: "",
      sub: [{ date: new Date(), category: "", weight: -1, value: -1 }],
    },
  ];
  const [donations, setDonations] = useState<Donation[]>(initialDonations);
  const initialDonationsRef = useRef<Donation[]>(initialDonations);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const { backend } = useBackendContext();
  const toast = useToast();

  // Reset initial state when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      const currentInitial: Donation[] = [
        {
          donor: "",
          sub: [{ date: new Date(), category: "", weight: -1, value: -1 }],
        },
      ];
      // Deep clone to store initial state
      initialDonationsRef.current = currentInitial.map((d) => ({
        donor: d.donor,
        sub: d.sub.map((s) => ({
          date: new Date(s.date.getTime()),
          category: s.category,
          weight: s.weight,
          value: s.value,
        })),
      }));
      setDonations(currentInitial);
    }
  }, [isDrawerOpen]);

  // Deep comparison function to check if donations have changed
  const hasChanges = (): boolean => {
    const current = donations;
    const initial = initialDonationsRef.current;

    if (current.length !== initial.length) return true;

    for (let i = 0; i < current.length; i++) {
      const currentDonation = current[i];
      const initialDonation = initial[i];

      if (!currentDonation || !initialDonation) return true;
      if (currentDonation.donor !== initialDonation.donor) return true;

      if (currentDonation.sub.length !== initialDonation.sub.length)
        return true;

      for (let j = 0; j < currentDonation.sub.length; j++) {
        const currentSub = currentDonation.sub[j];
        const initialSub = initialDonation.sub[j];

        if (!currentSub || !initialSub) return true;

        if (
          currentSub.category !== initialSub.category ||
          currentSub.weight !== initialSub.weight ||
          currentSub.value !== initialSub.value ||
          currentSub.date.getTime() !== initialSub.date.getTime()
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const handleClose = () => {
    if (hasChanges()) {
      openModal();
    } else {
      closeDrawer();
      resetData();
    }
  };

  const handleAddDonor = () => {
    setDonations((prevDonations) => [
      ...prevDonations,
      {
        donor: "",
        sub: [{ date: new Date(), category: "", weight: -1, value: -1 }],
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
      for (const sub of donation.sub) {
        try {
          // Format date as ISO datetime string (YYYY-MM-DDTHH:mm:ss.sssZ)
          const formattedDate =
            sub.date instanceof Date
              ? sub.date.toISOString()
              : sub.date;

          const Food = {
            date: formattedDate,
            weight: sub.weight,
            value: sub.value,
            category: sub.category,
            donor: donation.donor,
          };

          if (
            Food.weight === -1 ||
            Food.value === -1 ||
            Food.category === "" ||
            Food.donor === ""
          ) {
            toast({
              title: "Missing Information",
              description:
                "Please fill in all required fields (donor, weight, value, and category).",
              status: "warning",
              duration: 5000,
              isClosable: true,
            });
            return; // Stop processing if validation fails
          } else {
            await backend.post("/donations", Food);
            const currentTime = new Date();
            let hours = currentTime.getHours();
            let minutes = currentTime.getMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";

            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? +minutes : minutes;
            const formattedTime = `${hours}:${minutes} ${ampm} ${currentTime.toISOString().split("T")[0]}`;

            toast({
              title: "Donation Added",
              description: `The donation has been successfully added into the database at ${formattedTime}.`,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            closeDrawer();
            refresh();
            resetData();
          }
        } catch (err) {
          toast({
            title: "Donation Not Added",
            description:
              "There was something wrong that happened and the donation was not added.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          closeDrawer();
          refresh();
          resetData();
          console.error(err);
        }
      }
    }
    // Close drawer and refresh after all donations are processed
    closeDrawer();
    refresh();
    resetData();
  };
  const resetData = () => {
    setDonations([
      {
        donor: "",
        sub: [{ date: new Date(), category: "", weight: -1, value: -1 }],
      },
    ]);
  };

  const handleDeleteDonation = useCallback((index: number) => {
    setDonations((prevDonations) => {
      return prevDonations.filter((_, i) => i !== index);
    });
  }, []);

  return (
    <>
      <Button
        ref={btnRef}
        colorScheme="blue"
        onClick={openDrawer}
        sx={{ width: "45px", padding: "12px 24px" }}
      >
        Add
      </Button>
      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={handleClose}
        closeOnOverlayClick={true}
        size="xl"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            {" "}
            <HStack alignItems="center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={handleClose}
                style={{ cursor: "pointer" }}
              >
                <path
                  d="M5.58984 8.41L10.1798 13L5.58984 17.59L6.99984 19L12.9998 13L6.99984 7L5.58984 8.41ZM15.9998 7H17.9998V19H15.9998V7Z"
                  fill="#3182CE"
                />
              </svg>
              <Text
                fontSize="md"
                mt="2px"
              >
                Add Donations
              </Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack
              spacing={4}
              align="stretch"
            >
              {donations.map((donation, index) => {
                const currentIndex = index;
                return (
                  <DonationCard
                    key={`donation-${index}-${donation.donor}-${donation.sub.length}`}
                    donationToEdit={donation}
                    onSubmit={(updatedDonation) =>
                      handleDonationSubmit(updatedDonation, currentIndex)
                    }
                    handleDeleteDonation={() => {
                      handleDeleteDonation(currentIndex);
                    }}
                  />
                );
              })}
            </VStack>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleAddDonor}
              mt={4}
            >
              Add Donor
            </Button>
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                handleSubmitAllDonations();
              }}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel Adding Donations</ModalHeader>
          <ModalBody>
            Are you sure? You can't undo this action afterwards.
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                resetData();
                closeModal();
                closeDrawer();
                refresh();
              }}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default AddDonationsDrawer;
