import { useState } from "react";

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
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const VolunteerEditDrawer = ({ volunteer, onEditSuccess, isOpen, onClose }) => {
  const { backend } = useBackendContext();
  const [formData, setFormData] = useState({ ...volunteer });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await backend.put(`/volunteers/${volunteer.id}`, formData);
      onEditSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating volunteer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Edit Volunteer</DrawerHeader>
        <DrawerBody>
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Last Name</FormLabel>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Hours</FormLabel>
            <Input
              name="hours"
              type="number"
              value={formData.hours}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Value Per Hour</FormLabel>
            <Input
              name="value"
              type="number"
              value={formData.value}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Event Type</FormLabel>
            {/* Dropdown for Event Type */}
            <Select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
            >
              <option value="Easter">Easter</option>
              <option value="Thanksgiving">Thanksgiving</option>
              <option value="Gala">Gala</option>
              <option value="Christmas">Christmas</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </Select>
          </FormControl>
        </DrawerBody>
        <DrawerFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default VolunteerEditDrawer;
