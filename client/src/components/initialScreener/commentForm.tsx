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

import { useParams } from "react-router-dom";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { application } from "express";

// interface ClientData {
//   name: string;
//   cmFirstName: string;
//   cmLastName: string;
//   maritalStatus: string;
//   willingness: number;
//   employability: number;
//   attitude: number;
//   lengthOfSobriety?: number;
//   completedTx?: boolean;
//   drugTestResults?: string;
//   homelessOne: string;
//   homelessTwo: string;
//   homelessThree: string;
//   disablingCondition?: string;
//   employment?: boolean;
//   driversLicense?: string;
//   totalChildren?: number;
//   childrenInCustody?: number;
//   lastCity?: string;
//   acceptCcrh?: boolean;
//   additionalComments?: string;
// }

interface clientID {
  id: number;
}

interface caseManager {
  firstName: string;
  lastName: string;
  id: number;
}

const CommentForm: React.FC = (clientID) => {
  const { backend } = useBackendContext();
  const [caseManagers, setCaseManagers] = useState<caseManager[]>([]);
  // const [clientData, setClientData] = useState<ClientData>();
  const [clientFN, setClientFN] = useState<string>("");
  const [clientLN, setClientLN] = useState<string>("");
  const [clientCM, setClientCM] = useState<string>("");
  const [appType, setAppType] = useState<string>("");
  const [willingness, setWillingness] = useState<number>(0);
  const [attitude, setAttitude] = useState<number>(0);
  const [employability, setEmployability] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [tx, setTx] = useState<boolean>(true);
  const [h1, seth1] = useState<string>("");
  const [h2, seth2] = useState<string>("");
  const [h3, seth3] = useState<string>("");
  const [dCondition, setDCondition] = useState<string>("");
  const [employed, setEmployed] = useState<boolean>(true);
  const [dLicense, setDLicense] = useState<boolean>(true);
  const [numChildren, setNumChildren] = useState<number>(0);
  const [numCustody, setNumCustody] = useState<number>(0);
  const [lastCity, setLastCity] = useState<string>("");
  const [accept, setAccept] = useState<boolean>(true);
  const [comments, setComments] = useState<string>("");
  const [formID, setFormID] = useState<number>(0);
  const [initialID, setInitialID] = useState<number>(0);
  const { id } = useParams();

  const fields = [
    ["Disabling Condition?", dCondition, setDCondition],
    ["Employment?", employed, setEmployed],
    ["Driver's License?", dLicense, setDLicense],
    ["Total # of children?", numChildren, setNumChildren],
    ["Total # of children in custody?", numCustody, setNumCustody],
    ["Last City of Permanent Residence?", lastCity, setLastCity],
    ["Would you accept this client into CCH?", accept, setAccept],
    ["Additional comments or concerns?", comments, setComments],
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get(`/caseManagers/names`);
        setCaseManagers(response.data);
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get(
          `/initialInterview/commentForm/${id}`
        );
        console.log(response.data[0]);

        // setClientData(response.data[0]);
        setClientFN(response.data[0].clientName.split(" ")[0]);
        setClientLN(response.data[0].clientName.split(" ")[1]);
        setClientCM(
          response.data[0].cmFirstName + " " + response.data[0].cmLastName
        );
        setAppType(response.data[0].applicantType);
        setWillingness(response.data[0].willingness);
        setAttitude(response.data[0].attitude);
        setEmployability(response.data[0].employability);
        setLength(response.data[0].lengthOfSobriety);
        setTx(response.data[0].completedTx);
        seth1(response.data[0].homelessEpisodeOne);
        seth2(response.data[0].homelessEpisodeTwo);
        seth3(response.data[0].homelessEpisodeThree);
        setDCondition(response.data[0].disablingCondition);
        setEmployed(response.data[0].employed);
        setDLicense(response.data[0].driversLicense);
        setNumChildren(response.data[0].numOfChildren);
        setNumCustody(response.data[0].childrenInCustody);
        setLastCity(response.data[0].lastCityPermResidence);
        setAccept(response.data[0].decision);
        setComments(response.data[0].additionalComments);
        setFormID(response.data[0].id);
        setInitialID(response.data[0].initialid)
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    const caseManagerMap = new Map<string, number>(
      caseManagers.map((cm) => [`${cm.firstName} ${cm.lastName}`, cm.id])
    );

    const cm_id: number = caseManagerMap.get(clientCM);

    try {
      const screenerData = {
        cm_id: cm_id,
        willingness: willingness,
        employability: employability,
        attitude: attitude,
        length_of_sobriety: length,
        completed_tx: tx,
        homeless_episode_one: h1,
        homeless_episode_two: h2,
        homeless_episode_three: h3,
        disabling_condition: dCondition,
        employed: employed,
        driver_license: dLicense,
        num_of_children: numChildren,
        children_in_custody: numCustody,
        last_city_perm_residence: lastCity,
        decision: accept,
        additional_comments: comments,
      };

      const initialInterviewData = {
        applicant_type: appType,
      }

      const response = await backend.patch(
        `/screenerComment/${formID}`,
        screenerData
      );

      const response2 = await backend.patch(`/initialInterview/app-status/${initialID}`, initialInterviewData)


    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

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

        <FormControl>
          <FormLabel>Case Manager</FormLabel>
          <Select
            value={clientCM}
            onChange={(e) => setClientCM(e.target.value)}
          >
            {caseManagers.map((cm, i) => {
              const fullName = `${cm.firstName} ${cm.lastName}`;
              return (
                <option
                  key={i}
                  value={fullName}
                >
                  {fullName}
                </option>
              );
            })}
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
          <HStack
            justify="flex-start"
            spacing={25}
          >
            <FormLabel w="40%">Entering as single or family?</FormLabel>
            <Input
              value={appType}
              onChange={(e) => setAppType(String(e.target.value))}
              w="200px"
              borderRadius="xl"
            />
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
        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%"> Willingness </FormLabel>
            <Select
              value={willingness}
              onChange={(e) => setWillingness(Number(e.target.value))}
              w="200px"
              borderRadius="xl"
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option
                  key={i}
                  value={i + 1}
                >
                  {i + 1}
                </option>
              ))}
            </Select>
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%"> Employability </FormLabel>
            <Select
              value={employability}
              onChange={(e) => setEmployability(Number(e.target.value))}
              w="200px"
              borderRadius="xl"
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option
                  key={i}
                  value={i + 1}
                >
                  {i + 1}
                </option>
              ))}
            </Select>
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%"> Attitude </FormLabel>
            <Select
              value={attitude}
              onChange={(e) => setAttitude(Number(e.target.value))}
              w="200px"
              borderRadius="xl"
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option
                  key={i}
                  value={i + 1}
                >
                  {i + 1}
                </option>
              ))}
            </Select>
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%">Length of Sobriety</FormLabel>
            <Input
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              w="200px"
              borderRadius="xl"
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%">Completed Tx</FormLabel>
            <Input
              value={String(tx)}
              onChange={(e) => setTx(Boolean(e.target.value))}
              placeholder="Type Here"
              w="200px"
              borderRadius="xl"
            />
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
        <FormControl>
          <HStack spacing={25}>
            <FormLabel>1</FormLabel>
            <Input
              value={h1}
              onChange={(e) => seth1(String(e.target.value))}
              borderRadius="xl"
              flex="1"
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel>2</FormLabel>
            <Input
              value={h2}
              onChange={(e) => seth2(String(e.target.value))}
              borderRadius="xl"
              flex="1"
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel>2</FormLabel>
            <Input
              value={h3}
              onChange={(e) => seth3(String(e.target.value))}
              borderRadius="xl"
              flex="1"
            />
          </HStack>
        </FormControl>
      </VStack>

      <VStack
        spacing={4}
        align="start"
        mt={12}
        width="100%"
      >
        {fields.map(([label, value, setter], i) => (
          <FormControl key={i}>
            <HStack spacing={25}>
              <FormLabel w="40%">{label}</FormLabel>
              <Input
                w="200px"
                borderRadius="xl"
                placeholder="Type Here"
                value={value} // Set value from state
                onChange={(e) => setter(e.target.value)} // Update state
              />
            </HStack>
          </FormControl>
        ))}
      </VStack>

      <HStack
        spacing={4}
        mt={6}
        justify="flex-end"
      >
        {/* do the onclick --> navigate back to the inital forms page */}
        <Button
          type="submit"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          colorScheme="blue"
        >
          Submit
        </Button>
      </HStack>
    </Box>
  );
};

export default CommentForm;
