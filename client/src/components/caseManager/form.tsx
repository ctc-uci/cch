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

function FormCM() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { backend } = useBackendContext();

  const [formData, setFormData] = useState({
    date: "",
    cm_id: "",
    babies_born: "",
    enrolled_in_school: "",
    earned_degree: "",
    earned_drivers_license: "",
    reunified_with_children: "",
    womens_birthdays: "",
    birthday_gift_card_values: "",
    childrens_birthdays: "",
    food_card_values: "",
    bus_passes: "",
    gas_cards_value: "",
    phone_contacts: "",
    inperson_contacts: "",
    email_contacts: "",
    interviews_scheduled: "",
    interviews_conducted: "",
    positive_tests: "",
    no_call_no_shows: "",
    other: "",
  });

  const fields = [
    { name: "date", label: "Date" },
    { name: "cm_id", label: "CM ID" },
    { name: "babies_born", label: "Babies Born" },
    { name: "enrolled_in_school", label: "Enrolled in School" },
    { name: "earned_degree", label: "Earned Degree" },
    { name: "earned_drivers_license", label: "Earned Driver's License" },
    { name: "reunified_with_children", label: "Reunified with Children" },
    { name: "womens_birthdays", label: "Women's Birthdays" },
    { name: "childrens_birthdays", label: "Children's Birthdays" },
    { name: "birthday_gift_card_values", label: "Birthday Gift Card Values" },
    { name: "food_card_values", label: "Food Card Values" },
    { name: "bus_passes", label: "Bus Passes" },
    { name: "gas_cards_value", label: "Gas Cards Value" },
    { name: "phone_contacts", label: "Phone Contacts" },
    { name: "inperson_contacts", label: "In-Person Contacts" },
    { name: "email_contacts", label: "Email Contacts" },
    { name: "interviews_scheduled", label: "Interviews Scheduled" },
    { name: "interviews_conducted", label: "Interviews Conducted" },
    { name: "positive_tests", label: "Positive Tests" },
    { name: "no_call_no_shows", label: "No Call No Shows" },
    { name: "other", label: "Other" },
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
        cm_id: parseInt(formData.cm_id, 10),
        babies_born: parseInt(formData.babies_born, 10),
        enrolled_in_school: parseInt(formData.enrolled_in_school, 10),
        earned_degree: parseInt(formData.earned_degree, 10),
        earned_drivers_license: parseInt(formData.earned_drivers_license, 10),
        reunified_with_children: parseInt(formData.reunified_with_children, 10),
        womens_birthdays: parseInt(formData.womens_birthdays, 10),
        childrens_birthdays: parseInt(formData.childrens_birthdays, 10),
        birthday_gift_card_values: parseInt(formData.birthday_gift_card_values,10),
        food_card_values: parseInt(formData.food_card_values, 10),
        bus_passes: parseInt(formData.bus_passes, 10),
        gas_cards_value: parseInt(formData.gas_cards_value, 10),
        phone_contacts: parseInt(formData.phone_contacts, 10),
        inperson_contacts: parseInt(formData.inperson_contacts, 10),
        email_contacts: parseInt(formData.email_contacts, 10),
        interviews_scheduled: parseInt(formData.interviews_scheduled, 10),
        interviews_conducted: parseInt(formData.interviews_conducted, 10),
        positive_tests: parseInt(formData.positive_tests, 10),
        no_call_no_shows: parseInt(formData.no_call_no_shows, 10),
        other: parseInt(formData.other, 10),
      };
      console.log(monthlyStatData);
      await backend.post("/caseManagerMonthlyStats", monthlyStatData);
      // Do we need to clear monthlyStatData?
    } catch (error) {
      console.error("Error creating monthly stat:", error);
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
          <ModalHeader>Case Manager Form</ModalHeader>
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
                  type = {name === "date" ? "date" : "number"}
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

export default FormCM;
