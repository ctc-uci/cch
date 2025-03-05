import { useEffect, useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
// import { VolunteerButtons } from "./VolunteerButtons";

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


interface Volunteer {
    id: number;
    firstName: string;
    last_name: string;
    email: string;
    event_type: string;
    date: string;
    hours: number;
    value: number;
}

interface OnVolunteerAddForm {
    onFormSubmitSuccess: () => void;
} 

function VolunteerAdd({ onFormSubmitSuccess }: OnVolunteerAddForm) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { backend } = useBackendContext();
    const [error, setError] = useState<string | null>(null);
    const [addData, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        event_type: "",
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

            await backend.post("/frontDesk", newVolunteerData);
            setData({
                firstName: "",
                lastName: "",
                email: "",
                event_type: "",
                date: "",
                hours: "",
                value: ""
            });

            setError(null);
            onFormSubmitSuccess();
        } catch (error) {
            console.error("Error submitting form:", error);
            setError("Failed to submit form. Please try again.");
        } finally {
            onClose();
        }
    };

      return (
        <>
            <Button onClick={onOpen}>Add Volunteer</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW="700px">
                    <ModalHeader>Add Volunteer</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
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