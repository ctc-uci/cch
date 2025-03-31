import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface FormFrontDeskProps {
  onFormSubmitSuccess: () => void;
} 
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

function FormFrontDesk({ onFormSubmitSuccess }: FormFrontDeskProps) {
  const { backend } = useBackendContext();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    total_office_visits: "",
    total_calls: "",
    total_unduplicated_calls: "",
    total_visits_hb_pantry: "",
    total_visits_hb_donations_room: "",
    total_served_hb_donations_room: "",
    total_served_hb_pantry: "",
    total_visits_placentia_neighborhood: "",
    total_visits_placentia_pantry: "",
    total_served_placentia_neighborhood: "",
    total_served_placentia_pantry: "",
  });
  const navigate = useNavigate();


  const generalFields = [
    { name: "date", label: "Date", subtitle: "" },
    { name: "total_office_visits", label: "Total Office Visits", subtitle: ""},
    { name: "total_calls", label: "Total # of Calls", subtitle: "(including children in custody)" },
    { name: "total_unduplicated_calls", label: "Total # of unduplicated calls", subtitle: "(including children in custody)" },
  ]

  const hbFields = [
    { name: "total_visits_hb_pantry", label: "HB pantry room (total # of visits)" },
    { name: "total_visits_hb_donations_room", label: "HB donation room (total # of visits)" },
    { name: "total_served_hb_pantry", label: "HB pantry room (total # of people served)" },
    { name: "total_served_hb_donations_room", label: "HB donation room (total # of people served)" },
  ]

  const placentiaFields = [
    { name: "total_visits_placentia_neighborhood", label: "Placentia neighborhood (total # of visits)" },
    { name: "total_visits_placentia_pantry", label: "Placentia pantry room (total # of visits)" },
    { name: "total_served_placentia_neighborhood", label: "Placentia neighborhood (total # of people served)" },
    { name: "total_served_placentia_pantry", label: "Placentia pantry room (total # of people served)" },
  ]
  

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
          total_office_visits: parseInt(formData.total_office_visits || "0", 10),
          total_calls: parseInt(formData.total_calls || "0", 10),
          //This one isn't in the figma but its in the schema, idk what its supposed to be, just placeholder for now
          number_of_people: 0,
          total_unduplicated_calls: parseInt(formData.total_unduplicated_calls || "0", 10),
          total_visits_hb_pantry: parseInt(formData.total_visits_hb_pantry || "0", 10),
          total_visits_hb_donations_room: parseInt(formData.total_visits_hb_donations_room || "0", 10),
          total_served_hb_pantry: parseInt(formData.total_served_hb_pantry || "0", 10),
          total_served_hb_donations_room: parseInt(formData.total_served_hb_donations_room || "0", 10),
          total_visits_placentia_neighborhood: parseInt(formData.total_visits_placentia_neighborhood || "0", 10),
          total_visits_placentia_pantry: parseInt(formData.total_visits_placentia_pantry || "0", 10),
          total_served_placentia_neighborhood: parseInt(formData.total_served_placentia_neighborhood || "0", 10),
          total_served_placentia_pantry: parseInt(formData.total_served_placentia_pantry || "0", 10),
          
      };

      console.log(monthlyStatData);

      await backend.post("/frontDesk", monthlyStatData);
      setFormData({
        date: "",
        total_office_visits: "",
        total_calls: "",
        total_unduplicated_calls: "",
        total_visits_hb_pantry: "",
        total_visits_hb_donations_room: "",
        total_served_hb_donations_room: "",
        total_served_hb_pantry: "",
        total_visits_placentia_neighborhood: "",
        total_visits_placentia_pantry: "",
        total_served_placentia_neighborhood: "",
        total_served_placentia_pantry: "",
      });
      setError(null);
      // onFormSubmitSuccess();
      navigate("/forms-hub")
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit form. Please try again.");
    }
  };

  return (
    <>
        <Box maxW="700px" marginX={"20%"}>
            <Text justifySelf="center" fontSize={30} paddingBottom={"100px"}>
                <b>Front Desk Monthly Statistics Form</b>
            </Text>
            {generalFields.map(({ name, label }) => (
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
                    width='50%'
                    height="30px"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder="Type Here"
                />
                </Box>
            ))}
            <Text fontWeight={"bold"} p={2}>
                Huntington Bean (HB)
            </Text>
            {hbFields.map(({ name, label }) => (
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
                    width='50%'
                    height="30px"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder="Type Here"
                />
                </Box>
            ))}
            <Text  fontWeight={"bold"} p={2}    >
                Placentia
            </Text>
            {placentiaFields.map(({ name, label }) => (
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
                    width='50%'
                    height="30px"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder="Type Here"
                />
                </Box>
            ))}
            <Box justifySelf="right">
                <Button colorScheme="gray" mr={3} onClick={() => navigate("/forms-hub")}>
                    Cancel
                </Button>
                <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </Box>


    </>
  );
}

export default FormFrontDesk;