import {
  Button,
  Box,
  Input,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import React from "react";

// import type { Volunteer } from "../../types/volunteer"

interface OnVolunteerAddForm {
  onFormSubmitSuccess: () => void;
}

const VolunteerAddDrawer = ({ onFormSubmitSuccess }: OnVolunteerAddForm) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { backend } = useBackendContext();
  const [error, setError] = useState<string | null>(null);
  const [addData, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    eventType: "Easter",
    date: "",
    hours: "",
    value: ""
  });

  const fields = [
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "event_type", label: "Event Type", type: "text" },
    { name: "date", label: "Date Volunteered", type: "date" },
    { name: "hours", label: "Hours", type: "number" },
    { name: "value", label: "Value Per Hour", type: "number" },
  ];

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newVolunteerData = {
        ...addData,
        hours: parseInt(addData.hours || "0", 10),
        value: parseInt(addData.value || "0", 10),
      };

      await backend.post("/volunteers", newVolunteerData);
      setData({
        firstName: "",
        lastName: "",
        email: "",
        eventType: "",
        date: "",
        hours: "",
        value: ""
      });

      setError(null);
      onFormSubmitSuccess(); // Notify parent component of success
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit form. Please try again.");
    } finally {
      onClose(); // Close the drawer after form submission
    }
  };

  return (
    <>
      <Button ref={btnRef} width="40%" colorScheme="blue" onClick={onOpen}>
        Add
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Volunteer</DrawerHeader>

          <DrawerBody>
            {fields.map(({ name, label, type }) => (
              <Box key={name} display="flex" flexDirection="row" gap="20px" p={2}>
                <Text width="50%">{label}</Text>
                <Input
                  type={type}
                  width="100%"
                  height="30px"
                  name={name}
                  value={addData[name] || ""}
                  onChange={handleChange}
                />
              </Box>
            ))}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} type="submit" colorScheme="blue">
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default VolunteerAddDrawer;
