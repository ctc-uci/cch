import { useState } from "react";

import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

function FormFrontDesk() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { backend } = useBackendContext();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    cm_id: "",
    total_office_visits: "",
    total_calls: "",
    total_unduplicated_calles: "",
    total_visits_to_pantry_and_donations_room: "",
    total_number_of_people_served_in_pantry: "",
    total_visits_to_placentia_pantry: "",
    total_number_of_people_served_in_placentia_pantry: "",
  });

  const fields = [
    { name: "date", label: "Date" },
    { name: "cm_id", label: "CM ID" },
    { name: "total_office_visits", label: "Total Office Visits" },
    { name: "total_calls", label: "Total # of Calls" },
    { name: "total_unduplicated_calles", label: "Total # of unduplicated calls" },
    { name: "total_visits_to_pantry_and_donations_room", label: "Total # of visits to the HB pantry/donations room" },
    { name: "total_number_of_people_served_in_pantry", label: "Total # of people served in the HB pantry/donations room" },
    { name: "total_visits_to_placentia_pantry", label: "Total # of visits to the Placentia pantry/donations room" },
    { name: "total_number_of_people_served_in_placentia_pantry", label: "Total # of people served in the Placentia pantry/donations" },
  ];

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
    const monthlyStatData = {
        date: formData.date,
        cm_id: parseInt(formData.cm_id || "0", 10),
        total_office_visits: parseInt(formData.total_office_visits || "0", 10),
        total_calls: parseInt(formData.total_calls || "0", 10),
        total_unduplicated_calles: parseInt(formData.total_unduplicated_calles || "0", 10),
        total_visits_to_pantry_and_donations_room: parseInt(formData.total_visits_to_pantry_and_donations_room || "0", 10),
        total_number_of_people_served_in_pantry: parseInt(formData.total_number_of_people_served_in_pantry || "0", 10),
        total_visits_to_placentia_pantry: parseInt(formData.total_visits_to_placentia_pantry || "0", 10),
        total_number_of_people_served_in_placentia_pantry: parseInt(formData.total_number_of_people_served_in_placentia_pantry || "0", 10),
    };

        await backend.post("/frontDeskMonthlyStats", monthlyStatData);
        setFormData({
            date: "",
            cm_id: "",
            total_office_visits: "",
            total_calls: "",
            total_unduplicated_calles: "",
            total_visits_to_pantry_and_donations_room: "",
            total_number_of_people_served_in_pantry: "",
            total_visits_to_placentia_pantry: "",
            total_number_of_people_served_in_placentia_pantry: "",
          });
        setError(null);  // Clear any previous error
      } catch (error) {
        console.error("Error submitting form:", error);
        setError("Failed to submit form. Please try again.");
    } finally {
      onClose();
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW='700px'>
          <ModalHeader>Front Desk Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {fields.map(({ name, label }) => (
              <Box
                key={name}
                display="flex"
                flexDirection="row"
                gap="20px"
                p={2}
              >
                <Text width="50%">{label}</Text>
                <Input
                  width='100%'
                  height="30px"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                />
              </Box>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FormFrontDesk;
