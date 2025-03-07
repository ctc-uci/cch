import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { eventTypes } from "../../types/volunteer";
import type { Volunteer, VolunteerForm } from "../../types/volunteer";
import { formatDateForInput } from "../../utils/dateUtils";
import ConfirmCancelModal from "./ConfirmCancelModal";

interface VolunteerDrawerProps {
  onFormSubmitSuccess: () => void;
  volunteer?: Volunteer;
  isOpen: boolean;
  onClose: () => void;
}

interface FormFieldProps {
  label: string;
  isRequired?: boolean;
  children: React.ReactNode;
}

const FormField = ({ label, isRequired, children }: FormFieldProps) => (
  <FormControl isRequired={isRequired}>
    <HStack
      justify="space-between"
      align="center"
      width="100%"
    >
      <FormLabel margin="0">{label}</FormLabel>
      {children}
    </HStack>
  </FormControl>
);

const VolunteerDrawer = ({
  onFormSubmitSuccess,
  volunteer,
  isOpen,
  onClose,
}: VolunteerDrawerProps) => {
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
  const [totalValue, setTotalValue] = useState(0);
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();
  const isEditMode = volunteer ? true : false;

  useEffect(() => {
    const hours = Number(formData.hours) || 0;
    const value = Number(formData.value) || 0;
    setTotalValue(hours * value);
  }, [formData.hours, formData.value]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
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
        title: isEditMode ? "Volunteer Updated" : "Volunteer Added",
        description: `The volunteer has successfully been ${isEditMode ? "updated" : "added"} in the database at ${currentTime}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: isEditMode ? "Volunteer Not Updated" : "Volunteer Not Added",
        description: `Something wrong has occurred and the volunteer was not ${isEditMode ? "updated" : "added"}.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {isEditMode ? "Edit" : "Add"} Volunteer
          </DrawerHeader>

          <DrawerBody>
            <Box
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              boxShadow="sm"
            >
              <VStack
                spacing={4}
                width="100%"
                paddingX="48px"
                paddingY="24px"
              >
                <FormField
                  label="Date Volunteered"
                  isRequired
                >
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    width="60%"
                    onChange={handleInputChange}
                  />
                </FormField>

                <FormField
                  label="Email"
                  isRequired
                >
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    width="60%"
                    onChange={handleInputChange}
                  />
                </FormField>

                <FormField
                  label="First Name"
                  isRequired
                >
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    width="60%"
                    onChange={handleInputChange}
                  />
                </FormField>

                <FormField
                  label="Last Name"
                  isRequired
                >
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    width="60%"
                    onChange={handleInputChange}
                  />
                </FormField>

                <FormField
                  label="Event Type"
                  isRequired
                >
                  <Select
                    name="eventType"
                    value={formData.eventType}
                    width="60%"
                    onChange={handleInputChange}
                    placeholder="Select Event Type"
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
                </FormField>

                <FormField
                  label="Hours"
                  isRequired
                >
                  <Input
                    type="number"
                    name="hours"
                    value={formData.hours}
                    width="60%"
                    onChange={handleInputChange}
                  />
                </FormField>

                <FormField
                  label="Value Per Hour"
                  isRequired
                >
                  <InputGroup width="60%">
                    <InputLeftAddon>$</InputLeftAddon>
                    <Input
                      type="number"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </FormField>
                <Divider
                  border="1px"
                  color="#CBD5E0"
                  marginBottom="24px"
                />
                <FormField label="Total Value">
                  <Text
                    width="60%"
                    textAlign="right"
                    size="md"
                    fontWeight="semibold"
                    color={totalValue === 0 ? "#718096" : "inherit"}
                  >
                    ${totalValue.toFixed(2)}
                  </Text>
                </FormField>
              </VStack>
            </Box>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button
              variant="outline"
              mr={3}
              onClick={() => onConfirmOpen()}
            >
              Cancel
            </Button>
            <ConfirmCancelModal
              isEditMode={isEditMode}
              isConfirmOpen={isConfirmOpen}
              onConfirmClose={onConfirmClose}
              onDrawerClose={onClose}
            />
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default VolunteerDrawer;
