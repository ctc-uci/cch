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
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
} from "@chakra-ui/react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const VolunteerEditDrawer = ({ volunteer, onEditSuccess }) => {
  const { backend } = useBackendContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    <>
      <Button onClick={onOpen} colorScheme="blue" size="sm">Edit</Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Volunteer</DrawerHeader>
          <DrawerBody>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input name="firstName" value={formData.firstName} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Last Name</FormLabel>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input name="email" value={formData.email} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Hours</FormLabel>
              <Input name="hours" type="number" value={formData.hours} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Event Type</FormLabel>
              <Input name="eventType" value={formData.eventType} onChange={handleChange} />
            </FormControl>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default VolunteerEditDrawer;
