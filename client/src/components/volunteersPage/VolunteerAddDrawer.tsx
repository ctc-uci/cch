import { useEffect, useRef, useState } from "react";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { eventTypes } from "../../types/volunteer";
import type { Volunteer, VolunteerForm } from "../../types/volunteer";
import { formatDateForInput } from "../../utils/dateUtils";

interface VolunteerAddDrawerProps {
  onFormSubmitSuccess: () => void;
  volunteer?: Volunteer;
  // isOpen: boolean;
  // onClose: () => void;
}

const VolunteerAddDrawer = ({
  onFormSubmitSuccess,
  volunteer,
  // isOpen,
  // onClose,
}: VolunteerAddDrawerProps) => {
  const toast = useToast();
  const { backend } = useBackendContext();
  const initialForm: VolunteerForm = {
    firstName: volunteer?.firstName || "",
    lastName: volunteer?.lastName || "",
    email: volunteer?.email || "",
    eventType: volunteer?.eventType || "",
    date: volunteer?.date ? formatDateForInput(volunteer.date) : "",
    hours: volunteer?.hours.toString() || "",
    value: volunteer?.value.toString() || "",
  };
  const [formData, setFormData] = useState<VolunteerForm>(initialForm);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentTime = new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour12: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      const volunteerData = {
        ...formData,
        hours: Number(formData.hours),
        value: Number(formData.value),
      };

      if (volunteer) {
        await backend.put(`/volunteers/${volunteer.id}`, volunteerData);
      } else {
        await backend.post("/volunteers", volunteerData);
      }
      setFormData(initialForm);
      onFormSubmitSuccess();
      onClose();

      toast({
        title: volunteer ? "Volunteer Updated" : "Volunteer Added",
        description: `The volunteer has successfully been ${volunteer ? "updated" : "added"} in the database at ${currentTime}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: volunteer ? "Update Failed" : "Addition Failed",
        description: `Something wrong has occurred and the volunteer was not ${volunteer ? "updated" : "added"}.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  return (
    <>
      <Button
        colorScheme="blue"
        onClick={onOpen}
      >
        Add
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {volunteer ? "Edit" : "Add"} Volunteer
          </DrawerHeader>

          <DrawerBody>
            <form
              key={volunteer?.id || "new"}
              id="add-volunteer-form"
              onSubmit={handleSubmit}
            >
              <VStack
                spacing={4}
                align="stretch"
              >
                <FormControl>
                  <FormLabel>Date Volunteered</FormLabel>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Event Type</FormLabel>
                  <Select
                    name="eventType"
                    value={formData.eventType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        eventType: e.target.value,
                      }))
                    }
                    placeholder="Select event type"
                  >
                    {eventTypes.map((option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Hours</FormLabel>
                  <Input
                    type="number"
                    name="hours"
                    value={formData.hours}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hours: e.target.value,
                      }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Value Per Hour</FormLabel>
                  <Input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </VStack>
            </form>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button
              variant="outline"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form="add-volunteer-form"
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default VolunteerAddDrawer;
