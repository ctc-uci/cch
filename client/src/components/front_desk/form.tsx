import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Card,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { SelectInputComponent } from "./formComponents.tsx";
import { ArrowBackIcon } from "@chakra-ui/icons";

interface FormFrontDeskProps {
  onFormSubmitSuccess: () => void;
  spanish: boolean;
}

type FrontDeskFormData = {
  case_manager: string;
  total_office_visits: string;
  total_calls: string;
  total_unduplicated_calls: string;
  total_visits_hb_pantry: string;
  total_visits_hb_donations_room: string;
  total_served_hb_donations_room: string;
  total_served_hb_pantry: string;
  total_visits_placentia_neighborhood: string;
  total_visits_placentia_pantry: string;
  total_served_placentia_neighborhood: string;
  total_served_placentia_pantry: string;
  cmId?: string | null;
};

function FormFrontDesk({ onFormSubmitSuccess: _onFormSubmitSuccess, spanish }: FormFrontDeskProps) {
  const { backend } = useBackendContext();
  const [month, setMonth] = useState<string>(() => String(new Date().getMonth() + 1));
  const [year, setYear] = useState<string>(() => String(new Date().getFullYear()));
  const [cms, setCms] = useState<
    { id: string; firstName: string; lastName: string; role: string }[]
  >([]);

  const [formData, setFormData] = useState<FrontDeskFormData>({
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
      generalFields: [
        {
          name: "total_office_visits",
          label: "Total Office Visits",
          subtitle: "",
        },
        {
          name: "total_calls",
          label: "Total # of Calls",
          subtitle: "(including children in custody)",
        },
        {
          name: "total_unduplicated_calls",
          label: "Total # of unduplicated calls",
          subtitle: "(including children in custody)",
        },
      ],

      hbFields: [
        {
          name: "total_visits_hb_pantry",
          label: "HB pantry room (total # of visits)",
        },
        {
          name: "total_visits_hb_donations_room",
          label: "HB donation room (total # of visits)",
        },
        {
          name: "total_served_hb_pantry",
          label: "HB pantry room (total # of people served)",
        },
        {
          name: "total_served_hb_donations_room",
          label: "HB donation room (total # of people served)",
        },
      ],

      placentiaFields: [
        {
          name: "total_visits_placentia_neighborhood",
          label: "Placentia neighborhood (total # of visits)",
        },
        {
          name: "total_visits_placentia_pantry",
          label: "Placentia pantry room (total # of visits)",
        },
        {
          name: "total_served_placentia_neighborhood",
          label: "Placentia neighborhood (total # of people served)",
        },
        {
          name: "total_served_placentia_pantry",
          label: "Placentia pantry room (total # of people served)",
        },
      ],
    },
    spanish: {
      generalFields: [
        {
          name: "total_office_visits",
          label: "Total de Visitas a la Oficina",
          subtitle: "",
        },
        {
          name: "total_calls",
          label: "Total de Llamadas",
          subtitle: "(incluyendo niños bajo custodia)",
        },
        {
          name: "total_unduplicated_calls",
          label: "Total de Llamadas No Duplicadas",
          subtitle: "(incluyendo niños bajo custodia)",
        },
      ],

      hbFields: [
        {
          name: "total_visits_hb_pantry",
          label: "Sala de Despensa HB (total de visitas)",
        },
        {
          name: "total_visits_hb_donations_room",
          label: "Sala de Donaciones HB (total de visitas)",
        },
        {
          name: "total_served_hb_pantry",
          label: "Sala de Despensa HB (total de personas atendidas)",
        },
        {
          name: "total_served_hb_donations_room",
          label: "Sala de Donaciones HB (total de personas atendidas)",
        },
      ],

      placentiaFields: [
        {
          name: "total_visits_placentia_neighborhood",
          label: "Vecindario de Placentia (total de visitas)",
        },
        {
          name: "total_visits_placentia_pantry",
          label: "Sala de Despensa de Placentia (total de visitas)",
        },
        {
          name: "total_served_placentia_neighborhood",
          label: "Vecindario de Placentia (total de personas atendidas)",
        },
        {
          name: "total_served_placentia_pantry",
          label: "Sala de Despensa de Placentia (total de personas atendidas)",
        },
      ],
    },
  };
  const language = spanish ? "spanish" : "english";

  const monthOptions = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const currentYear = new Date().getFullYear();
  // Show a reasonable range (current year back 15 years, plus next year)
  const yearOptions = Array.from({ length: 17 }, (_, i) => String(currentYear + 1 - i)).map(
    (y) => ({ label: y, value: y })
  );

  const normalizeDigits = (value: string, maxLen: number) =>
    value.replace(/\D/g, "").slice(0, maxLen);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    if (name === "month") {
      setMonth(normalizeDigits(String(value), 2));
    } else if (name === "year") {
      setYear(normalizeDigits(String(value), 4));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name as keyof FrontDeskFormData]: String(value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const key of Object.keys(formData) as Array<keyof FrontDeskFormData>) {
      if (key === "cmId") continue;
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
      const monthNum = Number(month);
      const yearNum = Number(year);

      if (!Number.isInteger(monthNum) || monthNum < 1 || monthNum > 12) {
        toast({
          title: "Invalid Date",
          description: "Please enter a valid month (1-12).",
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      // Prevent "1-01-01" / "0001-01-01" by requiring a real 4-digit year.
      if (!Number.isInteger(yearNum) || year.length !== 4 || yearNum < 1900) {
        toast({
          title: "Invalid Date",
          description: "Please enter a valid 4-digit year (e.g. 2026).",
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      const monthlyStatData = {
        date: `${String(yearNum).padStart(4, "0")}-${String(monthNum).padStart(2, "0")}-01`,
        case_manager: formData.case_manager,
        total_office_visits: parseInt(formData.total_office_visits || "0", 10),
        total_calls: parseInt(formData.total_calls || "0", 10),
        //This one isn't in the figma but its in the schema, idk what its supposed to be, just placeholder for now
        number_of_people: 0,
        total_unduplicated_calls: parseInt(
          formData.total_unduplicated_calls || "0",
          10
        ),
        total_visits_hb_pantry: parseInt(
          formData.total_visits_hb_pantry || "0",
          10
        ),
        total_visits_hb_donations_room: parseInt(
          formData.total_visits_hb_donations_room || "0",
          10
        ),
        total_served_hb_pantry: parseInt(
          formData.total_served_hb_pantry || "0",
          10
        ),
        total_served_hb_donations_room: parseInt(
          formData.total_served_hb_donations_room || "0",
          10
        ),
        total_visits_placentia_neighborhood: parseInt(
          formData.total_visits_placentia_neighborhood || "0",
          10
        ),
        total_visits_placentia_pantry: parseInt(
          formData.total_visits_placentia_pantry || "0",
          10
        ),
        total_served_placentia_neighborhood: parseInt(
          formData.total_served_placentia_neighborhood || "0",
          10
        ),
        total_served_placentia_pantry: parseInt(
          formData.total_served_placentia_pantry || "0",
          10
        ),
      };


      await backend.post("/frontDesk", monthlyStatData);
      toast({
        title: "Successfully submitted form",
        description: `Front Desk Monthly Statistics Form - ${new Date().toLocaleString()}`,
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
      // onFormSubmitSuccess();
      // navigate("/forms-hub");
    } catch (error) {
      console.error("Error submitting form:", error);
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
      <Box
        backgroundColor={"gray.100"}
        width={"100vw"}
        zIndex={-1}
        top={0}
        left={0}
        pt={10}
        pb={10}
      >
        <HStack position="absolute" p="4">
          <Button
            variant="ghost"
            colorScheme="blue"
            leftIcon={<ArrowBackIcon />}
            onClick={() => navigate("/forms-hub")}
          >
            Back
          </Button>
        </HStack>
        <Card
          maxW="100%"
          marginX={"20%"}
          justifyContent={"center"}
          backgroundColor={"white"}
          padding={10}
        >
          <Text
            justifySelf="center"
            text-align="center"
            fontSize={30}
            paddingBottom={"50px"}
          >
            <b>Front Desk Monthly Statistics Form</b>
          </Text>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <HStack
              key="date"
              direction="row"
              w="100%"
              justifyContent="stretch"
              spacing={4}
              alignItems="center"
            >
              <Box key="month" flex="1" minW={0}>
                <SelectInputComponent
                  label="Month"
                  name="month"
                  value={month}
                  onChange={handleChange}
                  options={monthOptions}
                  placeholder="Select month"
                  width="100%"
                />
              </Box>
              <Box key="year" flex="1" minW={0}>
                <SelectInputComponent
                  label="Year"
                  name="year"
                  value={year}
                  onChange={handleChange}
                  options={yearOptions}
                  placeholder="Select year"
                  width="100%"
                />
              </Box>

              <Box flex="1" minW={0}>
                <SelectInputComponent
                  label="Case Manager"
                  name="caseManager"
                  value={formData.case_manager || ""}
                  onChange={(e) => {
                    const selectedCaseManager = cms.find(
                      (user) =>
                        `${user.firstName} ${user.lastName}` === e.target.value
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
                  width="100%"
                />
              </Box>
            </HStack>

            <Stack mt={12} w="100%">
              {fields[language]["generalFields"].map(({ name, subtitle, label }) => (
                <HStack
                  key={name}
                  p={2}
                  justifyContent="space-between"
                >
                  <Stack>
                    <Text textAlign="left" >{label}</Text>
                    {subtitle && <Text fontSize="xs" textAlign="left">{subtitle}</Text>}
                  </Stack>
                  
                  <Input
                    type="number"
                    width="20%"
                    name={name}
                    value={String(formData[name as keyof FrontDeskFormData] ?? "")}
                    onChange={handleChange}
                    placeholder="Type Here"
                  />
                </HStack>
              ))}
            </Stack>

            <Stack w="100%">
              <Text
                fontWeight={"bold"}
                p={2}
                mt={12}
                fontSize="lg"
              >
                Huntington Beach (HB)
              </Text>
              {fields[language]["hbFields"].map(({ name, label }) => (
                <HStack
                  key={name}
                  p={2}
                  justifyContent="space-between"
                >
                  <Text width="50%">{label}</Text>
                  <Input
                    type={name === "date" ? "date" : "number"}
                    width="20%"
                    name={name}
                    value={String(formData[name as keyof FrontDeskFormData] ?? "")}
                    onChange={handleChange}
                    placeholder="Type Here"
                  />
                </HStack>
              ))}
            </Stack>

            <Stack w="100%">
              <Text
                fontWeight={"bold"}
                p={2}
                paddingTop={"30px"}
                fontSize="lg"
              >
                Placentia
              </Text>
              {fields[language]["placentiaFields"].map(({ name, label }) => (
                <HStack
                  key={name}
                  justifyContent="space-between"
                  p={2}
                >
                  <Text width="50%">{label}</Text>
                  <Input
                    type={name === "date" ? "date" : "number"}
                    width="20%"
                    name={name}
                    value={String(formData[name as keyof FrontDeskFormData] ?? "")}
                    onChange={handleChange}
                    placeholder="Type Here"
                  />
                </HStack>
              ))}
            </Stack>
            <HStack justifyContent="flex-end" mt={12}>
              <Button
                colorScheme="gray"
                mr={3}
                onClick={() => navigate("/forms-hub")}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
              >
                Submit
              </Button>
            </HStack>
          </form>
        </Card>
      </Box>
    </>
  );
}

export default FormFrontDesk;
