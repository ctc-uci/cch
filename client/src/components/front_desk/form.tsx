import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  useToast,
  Card,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  SelectInputComponent,
} from "./formComponents.tsx";
interface FormFrontDeskProps {
  onFormSubmitSuccess: () => void;
  spanish: boolean
} 
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

function FormFrontDesk({ onFormSubmitSuccess, spanish }: FormFrontDeskProps) {
  const { backend } = useBackendContext();
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [cms, setCms] = useState<
  { id: string; firstName: string; lastName: string; role: string }[]
>([]);

  const [formData, setFormData] = useState({
    case_manager: "",
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
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useToast();

  const fields = {
    english: {
      generalFields:[
        { name: "total_office_visits", label: "Total Office Visits", subtitle: ""},
        { name: "total_calls", label: "Total # of Calls", subtitle: "(including children in custody)" },
        { name: "total_unduplicated_calls", label: "Total # of unduplicated calls", subtitle: "(including children in custody)" },
      ],

      hbFields :[
        { name: "total_visits_hb_pantry", label: "HB pantry room (total # of visits)" },
        { name: "total_visits_hb_donations_room", label: "HB donation room (total # of visits)" },
        { name: "total_served_hb_pantry", label: "HB pantry room (total # of people served)" },
        { name: "total_served_hb_donations_room", label: "HB donation room (total # of people served)" },
      ],

      placentiaFields:[
        { name: "total_visits_placentia_neighborhood", label: "Placentia neighborhood (total # of visits)" },
        { name: "total_visits_placentia_pantry", label: "Placentia pantry room (total # of visits)" },
        { name: "total_served_placentia_neighborhood", label: "Placentia neighborhood (total # of people served)" },
        { name: "total_served_placentia_pantry", label: "Placentia pantry room (total # of people served)" },
      ]
    },
    spanish: {
      generalFields: [
        { name: "total_office_visits", label: "Total de Visitas a la Oficina", subtitle: "" },
        { name: "total_calls", label: "Total de Llamadas", subtitle: "(incluyendo niños bajo custodia)" },
        { name: "total_unduplicated_calls", label: "Total de Llamadas No Duplicadas", subtitle: "(incluyendo niños bajo custodia)" }
      ],

      hbFields: [
        { name: "total_visits_hb_pantry", label: "Sala de Despensa HB (total de visitas)" },
        { name: "total_visits_hb_donations_room", label: "Sala de Donaciones HB (total de visitas)" },
        { name: "total_served_hb_pantry", label: "Sala de Despensa HB (total de personas atendidas)" },
        { name: "total_served_hb_donations_room", label: "Sala de Donaciones HB (total de personas atendidas)" }
      ],

      placentiaFields: [
        { name: "total_visits_placentia_neighborhood", label: "Vecindario de Placentia (total de visitas)" },
        { name: "total_visits_placentia_pantry", label: "Sala de Despensa de Placentia (total de visitas)" },
        { name: "total_served_placentia_neighborhood", label: "Vecindario de Placentia (total de personas atendidas)" },
        { name: "total_served_placentia_pantry", label: "Sala de Despensa de Placentia (total de personas atendidas)" }
      ]
    }
  }
  const language = spanish ? "spanish" : "english"

  

  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "month") {
      setMonth(value);
    } else if (name === "year"){
      setYear(value);
    }
    else
      setFormData((prevState) => ({ ...prevState, [name]: value }));
  
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const key in formData) {
      if (formData[key] === "") {
        toast({
          title: "Missing Information",
          description: "Please fill out all required fields before submitting.",
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
    }

    try {
      const monthlyStatData = {
          date: `${year}-${('0' + month).slice(-2)}-01`,
          case_manager: formData.case_manager,
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
    
      await backend.post("/frontDesk", monthlyStatData);
      toast({
        title: "Successfully submitted form",
        description: `Intake Statistics Form - ${new Date().toLocaleString()}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setFormData({
        case_manager: "",
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
      toast({
        title: "Submission failed",
        description: error.message || "An unexpected error occurred.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchCaseManagers = async () => {
      try {
        const response = await backend.get("/casemanagers");
        setCms(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchCaseManagers();
  }, [backend]);

  return (
    <>
    <Box backgroundColor={"gray.100"} width={"100vw"} zIndex={-1} top={0} left={0} pt={10} pb={10} >
        <Card maxW="100%" marginX={"20%"} justifyContent={"center"} backgroundColor={"white"} padding={10}>
          
            <Text justifySelf="center" text-align="center" fontSize={30} paddingBottom={"50px"}>
                <b>Front Desk Monthly Statistics Form</b>
            </Text>
            <form
                  ref={formRef}
                  onSubmit={handleSubmit}
            >
            <Box key="date" display="flex"  flexDirection="row"  gap="20px"  p={2}>
              <Box key="month" display="flex"  flexDirection="column"  gap="20px"  p={2}>
                <Text width="100%">Month</Text>
                <Input
                        type = "number"
                        width='100%'
                        height="30px"
                        name="month"
                        value={month}
                        onChange={handleChange}
                        placeholder="Type Here"
                        maxLength={2}
                    />
              </Box>
              <Box key="year" display="flex"  flexDirection="column"  gap="20px"  p={2}>
                <Text width="100%">Year</Text>
                <Input
                      type = "number"
                      width='100%'
                      height="30px"
                      name="year"
                      value={year}
                      onChange={handleChange}
                      placeholder="Type Here"
                      maxLength={4}
                  />
              </Box>
           
                
              <SelectInputComponent
                label="Case Manager"
                name="caseManager"
                value={formData.case_manager || ""}
                onChange={(e) => {
                  const selectedCaseManager = cms.find(
                    (user) => `${user.firstName} ${user.lastName}` === e.target.value
                  );
                  setFormData((prev) => ({
                    ...prev,
                    case_manager: e.target.value, // Set the case manager's name
                    cmId: selectedCaseManager?.id || null, // Set the case manager's ID
                  }));
                }}
                options={cms
                  .filter((user) => user.role === "case manager")
                  .map((user) => ({
                    key: user.id,
                    label: `${user.firstName} ${user.lastName}`,
                    value: `${user.firstName} ${user.lastName}`,
                  }))}
                placeholder="Select Case Manager"
                width="70%"
              />
            </Box>

            {fields[language]["generalFields"].map(({ name, label }) => (
                <Box 
                key={name}
                display="flex"
                flexDirection="row"
                gap="20px"
                p={2}
                >
                <Text width="50%">{label}</Text>
                <Input
                    type = "number"
                    width='50%'
                    height="30px"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder="Type Here"
                />
                </Box>
            ))}
            <Text fontWeight={"bold"} p={2} paddingTop={"30px"} >
                Huntington Beach (HB)
            </Text>
            {fields[language]["hbFields"].map(({ name, label }) => (
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
            <Text fontWeight={"bold"} p={2}  paddingTop={"30px"}> 
                Placentia
            </Text>
            {fields[language]["placentiaFields"].map(({ name, label }) => (
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
                <Button colorScheme="blue" mr={3} type="submit">
                    Submit
                </Button>
            </Box>
            </form>
        </Card>
        </Box>

    </>
  );
}

export default FormFrontDesk;