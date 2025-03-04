import React, { useEffect, useState } from "react";


import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useParams } from "react-router-dom";

interface ClientData {
  name: string;
  cmFirstName: string;
  cmLastName: string;
  maritalStatus: string;
  willingness: number;
  employability: number;
  attitude: number;
  lengthOfSobriety?: number;
  completedTx?: boolean;
  drugTestResults?: string;
  homelessOne: string;
  homelessTwo: string;
  homelessThree: string;
  disablingCondition?: string;
  employment?: boolean;
  driversLicense?: string;
  totalChildren?: number;
  childrenInCustody?: number;
  lastCity?: string;
  acceptCcrh?: boolean;
  additionalComments?: string;
}

interface clientID {
  id: number;
}

interface caseManager {
  firstName: string;
  lastName: string;
}

const CommentForm: React.FC = (clientID) => {
  const { backend } = useBackendContext();
  const [caseManagers, setCaseManagers] = useState<caseManager[]>([]);
  const [clientData, setClientData] = useState<ClientData>();
  const [clientFN, setClientFN] = useState<string>("")
  const [clientLN, setClientLN] = useState<string>("")
  const [clientCM, setClientCM] = useState<string>("")

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          await backend.get(`/caseManagers/names`);
        setCaseManagers(response.data);
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };
    fetchData();
  }, [backend]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get(`/initialInterview/commentForm/${id}`);
        setClientData(response.data[0]);
        setClientFN(response.data[0].clientName.split(" ")[0]);
        setClientLN(response.data[0].clientName.split(" ")[1]);
        setClientCM(response.data[0].cmFirstName + " " + response.data[0].cmLastName);

      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
    fetchData();
  }, [backend, id]);

  return (
    <Box
      maxW="800px"
      mx="auto"
      p={8}
    >
      <Heading
        size="lg"
        textAlign="center"
        mb={6}
      >
        Initial Screener Comment Form
      </Heading>

      <HStack
        spacing={8}
        width="100%"
      >
        <FormControl isDisabled>
          <FormLabel>First Name</FormLabel>
          <Input
            value={clientFN}
            isReadOnly
          />
        </FormControl>

        <FormControl isDisabled>
          <FormLabel>Last Name</FormLabel>
          <Input
            value={clientLN}
            isReadOnly
          />
        </FormControl>

        {/* make a route that's just list of case managers */}
        <FormControl>
          <FormLabel>Case Manager</FormLabel>
          <Select defaultValue={clientCM}>
            {[...caseManagers].map((_, i) => (
              <option
                key={i}
                value={i + 1}
              >
                {caseManagers[i]?.firstName + " " + caseManagers[i]?.lastName}
              </option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      <VStack
        spacing={4}
        align="start"
        mt={6}
        width="100%"
      >
        {/* this one isn't right -- im using marital status because single/family doesn't exist in the schema */}
        <FormControl>
          <HStack justify="flex-start" spacing={25}>
            <FormLabel w="40%">Entering as single or family?</FormLabel>
            <Input placeholder={clientData?.maritalStatus} w="200px" borderRadius="xl"   />
          </HStack>
        </FormControl>
      </VStack>

      <Heading
        size="md"
        mt={6}
      >
        Please Rate 1-10
      </Heading>
      <VStack
        spacing={4}
        align="start"
        mt={2}
        width="100%"
      >
        {["Willingness", "Employability", "Attitude"].map((label) => (
          <FormControl key={label}>
            <HStack spacing={25}>
              <FormLabel w="40%">{label}</FormLabel>
              <Select defaultValue="10" w="200px" borderRadius="xl"  >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </Select>
            </HStack>
          </FormControl>
        ))}

        <FormControl>
          <HStack spacing={25}>
          <FormLabel w="40%">Length of Sobriety</FormLabel>
          <Input placeholder="Type Here" w="200px" borderRadius="xl"   />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
          <FormLabel w="40%">Completed Tx</FormLabel>
          <Input placeholder="Type Here" w="200px" borderRadius="xl"   />
          </HStack>
        </FormControl>
      </VStack>

      <Heading
        size="md"
        mt={6}
      >
        Homeless Episodes
      </Heading>
      <VStack
        spacing={4}
        align="start"
        mt={2}
        width="100%"
      >
        {[1, 2, 3].map((num) => (
          <FormControl key={num}>
            <HStack spacing={25}>
            <FormLabel>{num}</FormLabel>
            <Input borderRadius="xl" placeholder="Type Here" flex="1" />
            </HStack>
          </FormControl>
        ))}
      </VStack>

      <VStack
        spacing={4}
        align="start"
        mt={12}
        width="100%"
      >
        {[
          "Disabling Condition?",
          "Employment?",
          "Driver's License?",
          "Total # of children?",
          "Total # of children in custody?",
          "Last City of Permanent Residence?",
          "Would you accept this client into CCH?",
          "Additional comments or concerns?",
        ].map((label) => (
          <FormControl key={label}>
            <HStack spacing={25}>
            <FormLabel w="40%">{label}</FormLabel>
            <Input w="200px" borderRadius="xl"  placeholder="Type Here" />
            </HStack>
          </FormControl>
        ))}
      </VStack>

      <HStack
        spacing={4}
        mt={6}
        justify="flex-end"
      >
        <Button variant="outline">Cancel</Button>
        <Button colorScheme="blue">Submit</Button>
      </HStack>
    </Box>
  );
};

export default CommentForm;

