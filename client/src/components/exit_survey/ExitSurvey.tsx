import { useEffect, useState } from "react";

import {
  Button,
  Center,
  Link as ChakraLink,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const ExitSurvey = () => {
  type CaseManager = {
    id: number;
    role: string;
    firstName: string;
    lastName: string;
    phone_number: string;
    email: string;
  };

  type Location = {
    id: number;
    cm_id: number;
    name: string;
    date: Date;
    caloptima_funded: boolean;
  };

  const [locations, setLocations] = useState([]);
  const [caseManagers, setCaseManagers] = useState([]);
  const { backend } = useBackendContext();
  const toast = useToast();

  useEffect(() => {
    const getLocations = async () => {
      try {
        const response = await backend.get("/locations");
        setLocations(response.data);
      } catch (e) {
        toast({
          title: "An error occurred",
          description: `Locations were not fetched: ${e.message}`,
          status: "error",
        });
      }
    };

    const getCaseManagers = async () => {
      try {
        const response = await backend.get("/caseManagers");
        setCaseManagers(response.data);
      } catch (e) {
        toast({
          title: "An error occurred",
          description: `Case Managers were not fetched: ${e.message}`,
          status: "error",
        });
      }
    };
    getLocations();
    getCaseManagers();
  }, [backend, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      await backend.post("/exitSurvey", data);
      toast({
        title: "Form submitted",
        description: `Thanks for your feedback!`,
        status: "success",
      });
    } catch (e) {
      toast({
        title: "An error occurred",
        description: `Exit survey response was not created: ${e.message}`,
        status: "error",
      });
    }
  };

  return (
    <VStack
      spacing={8}
      sx={{ width: 800, marginX: "auto" }}
    >
      <Heading textAlign={"center"}>
        Colette’s Children’s Home <br />
        Participant Satisfaction Survey
      </Heading>

      <form
        style={{ width: "100%" }}
        onSubmit={handleSubmit}
      >
        <Stack spacing={4}>
          <HStack spacing={2}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                placeholder="Name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Case Manager</FormLabel>
              <Select
                name="cmId"
                placeholder="Select your case manager"
              >
                {caseManagers.map((manager: CaseManager) => (
                  <option
                    key={manager.id}
                    value={manager.id}
                  >
                    {manager.firstName} {manager.lastName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Site</FormLabel>
              <Select
                name="site"
                placeholder="Site"
              >
                {locations.map((location: Location) => (
                  <option
                    key={location.id}
                    value={location.id}
                  >
                    {location.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </HStack>

          <FormControl isRequired>
            <FormLabel>Date of Program Completion</FormLabel>
            <Input
              name="programDateCompletion"
              type="date"
              placeholder="Date"
            />
          </FormControl>

          <Text
            style={{
              fontWeight: "bold",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            Thank you for taking the time to complete this survey. We value your
            feedback and use your suggestions to make important program
            improvements.{" "}
          </Text>

          <Text style={{ fontWeight: "bold" }}>Overall Program</Text>

          <FormControl isRequired>
            <FormLabel>
              How would you rate Colette’s Children’s Home overall? (circle one)
            </FormLabel>
            <RadioGroup name="cchRating">
              <HStack spacing={4}>
                <Radio value="Excellent">Excellent</Radio>
                <Radio value="Good">Good</Radio>
                <Radio value="Fair">Fair</Radio>
                <Radio value="Poor">Unsatisfactory</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              What did you like most about Colette’s Children’s Home?
            </FormLabel>
            <Textarea
              name="cchLikeMost"
              placeholder="Enter your response..."
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              What would make Colette’s Children’s home better?
            </FormLabel>
            <Textarea
              name="cchCouldBeImproved"
              placeholder="Enter your response..."
            />
          </FormControl>

          <Text style={{ fontWeight: "bold" }}>Life Skills</Text>

          <FormControl isRequired>
            <FormLabel>
              How helpful were the Life Skills Meetings? (circle one)
            </FormLabel>
            <RadioGroup name="lifeSkillsRating">
              <HStack spacing={4}>
                <Radio value="very helpful">Very Helpful</Radio>
                <Radio value="helpful">Helpful</Radio>
                <Radio value="not very helpful">Not Very Helpful</Radio>
                <Radio value="not helpful at all">Not Helpful at All</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>What topics were the most helpful for you?</FormLabel>
            <Textarea
              name="lifeSkillsHelpfulTopics"
              placeholder="Enter your response..."
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              What topics would you like CCH to offer in the future?
            </FormLabel>
            <Textarea
              name="lifeSkillsOfferTopicsInTheFuture"
              placeholder="Enter your response..."
            />
          </FormControl>

          <Text style={{ fontWeight: "bold" }}>Case Manager</Text>

          <FormControl isRequired>
            <FormLabel>How helpful was case management?</FormLabel>
            <RadioGroup name="cmRating">
              <HStack spacing={4}>
                <Radio value="very helpful">Very Helpful</Radio>
                <Radio value="helpful">Helpful</Radio>
                <Radio value="not very helpful">Not Very Helpful</Radio>
                <Radio value="not helpful at all">Not Helpful at All</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>What would you change about case management?</FormLabel>
            <Textarea
              name="cmChangeAbout"
              placeholder="Enter your response..."
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              What was the most beneficial part of case management?
            </FormLabel>
            <Textarea
              name="cmMostBeneficial"
              placeholder="Enter your response..."
            />
          </FormControl>

          <Text style={{ fontWeight: "bold" }}>Outcomes</Text>

          <FormControl isRequired>
            <FormLabel>
              How do you think that your experience at CCH will change your
              future?
            </FormLabel>
            <Textarea
              name="experienceTakeaway"
              placeholder="Enter your response..."
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>
              What have you learned/accomplished while during your stay?
            </FormLabel>
            <Textarea
              name="experienceAccomplished"
              placeholder="Enter your response..."
            />
          </FormControl>

          <FormControl>
            <FormLabel>What else would you like us to know? </FormLabel>
            <Textarea
              name="experienceExtraNotes"
              placeholder="Enter your response..."
            />
          </FormControl>

          <Text style={{ fontWeight: "bold" }}>Thank you!</Text>

          <Button
            type="submit"
            size={"lg"}
            sx={{ width: "100%" }}
            //isDisabled={Object.keys(errors).length > 0}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </VStack>
  );
};
