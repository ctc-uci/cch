import React, { useEffect, useState } from "react";

import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useLocation, useNavigate } from "react-router-dom";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

interface caseManager {
  firstName: string;
  lastName: string;
  id: number;
}

const CommentForm: React.FC = () => {
  const { backend } = useBackendContext();
  const [caseManagers, setCaseManagers] = useState<caseManager[]>([]);
  const [clientFN, setClientFN] = useState<string>("");
  const [clientLN, setClientLN] = useState<string>("");
  const [clientCM, setClientCM] = useState<string>("");
  const [appType, setAppType] = useState<string>("");
  const [willingness, setWillingness] = useState<number>(0);
  const [attitude, setAttitude] = useState<number>(0);
  const [employability, setEmployability] = useState<number>(0);
  const [length, setLength] = useState<number | "">("");
  const [tx, setTx] = useState<boolean>(true);
  const [h1, seth1] = useState<string>("");
  const [h2, seth2] = useState<string>("");
  const [h3, seth3] = useState<string>("");
  const [dCondition, setDCondition] = useState<string>("");
  const [employed, setEmployed] = useState<boolean>(true);
  const [dLicense, setDLicense] = useState<boolean>(true);
  const [numChildren, setNumChildren] = useState<number | "">("");
  const [numCustody, setNumCustody] = useState<number | "">("");
  const [lastCity, setLastCity] = useState<string>("");
  const [accept, setAccept] = useState<boolean>(true);
  const [comments, setComments] = useState<string>("");
  const [formID, setFormID] = useState<number>(0);
  const [initialID, setInitialID] = useState<number>(0);
  const location = useLocation();
  const locationState = (location.state as { sessionId?: string; returnPath?: string } | null) ?? {};
  const sessionId = locationState.sessionId ?? null;
  const returnPath = locationState.returnPath ?? "/initial-screener-table";

  const toast = useToast();
  const navigate = useNavigate();

  // Helper function to navigate back to the source page
  const navigateBack = () => {
    navigate(returnPath);
  };

  // (fields array removed; controls rendered explicitly below)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get(`/caseManagers/names`);
        const managers = response.data || [];
        setCaseManagers(managers);
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };
    fetchData();
  }, [backend]);

  // Set default case manager when case managers are loaded and no CM is selected
  // This will run if:
  // 1. New form (no existing data) - sets default
  // 2. Existing form with no CM - sets default (which is fine)
  // 3. Existing form with CM - clientCM won't be empty, so won't override
  useEffect(() => {
    if (caseManagers.length > 0 && !clientCM && caseManagers[0]) {
      const defaultCM = `${caseManagers[0].firstName} ${caseManagers[0].lastName}`;
      setClientCM(defaultCM);
    }
  }, [caseManagers, clientCM]);

  type SessionCommentRecord = {
    clientName: string | null;
    clientFirstName: string | null;
    clientLastName: string | null;
    cmFirstName: string | null;
    cmLastName: string | null;
    applicantType: string | null;
    willingness: number | null;
    attitude: number | null;
    employability: number | null;
    lengthOfSobriety: number | null;
    completedTx: boolean | string | null;
    homelessEpisodeOne: string | null;
    homelessEpisodeTwo: string | null;
    homelessEpisodeThree: string | null;
    disablingCondition: string | null;
    employed: boolean | string | null;
    driversLicense: boolean | string | null;
    numOfChildren: number | null;
    childrenInCustody: number | null;
    lastCityPermResidence: string | null;
    decision: boolean | string | null;
    additionalComments: string | null;
    id: number;
    initialid: number | null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!sessionId) return;

        const response = await backend.get(`/screenerComment/session/${sessionId}`);
        const data = Array.isArray(response.data) ? response.data : [];

        if (data.length <= 0) {
          return;
        }

        const record = data[0] as SessionCommentRecord;

        const parseBool = (v: unknown): boolean => {
          if (typeof v === "boolean") return v;
          const s = String(v ?? "").toLowerCase().trim();
          return s === "true" || s === "t" || s === "yes" || s === "y" || s === "1";
        };

        // Prefer separate first_name/last_name fields, fallback to parsing clientName
        let firstName = record.clientFirstName ?? "";
        let lastName = record.clientLastName ?? "";
        
        // If separate fields aren't available, try parsing the full name
        if (!firstName && !lastName && record.clientName) {
          const nameParts = record.clientName.trim().split(/\s+/);
          firstName = nameParts[0] ?? "";
          lastName = nameParts.slice(1).join(" ") ?? "";
        }

        setClientFN(firstName);
        setClientLN(lastName);
        const cmName = `${record.cmFirstName ?? ""} ${record.cmLastName ?? ""}`.trim();
        // Only set CM if it exists in the record, otherwise leave empty for default to fill
        if (cmName) {
          setClientCM(cmName);
        }
        const fetchedAppType = (record.applicantType ?? "").toLowerCase();
        if (fetchedAppType === "single" || fetchedAppType === "family") {
          setAppType(fetchedAppType);
        } else {
          setAppType("");
        }
        setWillingness(Number(record.willingness ?? 0));
        setAttitude(Number(record.attitude ?? 0));
        setEmployability(Number(record.employability ?? 0));
        setLength(record.lengthOfSobriety !== null && record.lengthOfSobriety !== undefined ? record.lengthOfSobriety : "");
        setTx(parseBool(record.completedTx));
        seth1(record.homelessEpisodeOne ?? "");
        seth2(record.homelessEpisodeTwo ?? "");
        seth3(record.homelessEpisodeThree ?? "");
        setDCondition(record.disablingCondition ?? "");
        setEmployed(parseBool(record.employed));
        setDLicense(parseBool(record.driversLicense));
        setNumChildren(record.numOfChildren !== null && record.numOfChildren !== undefined ? record.numOfChildren : "");
        setNumCustody(record.childrenInCustody !== null && record.childrenInCustody !== undefined ? record.childrenInCustody : "");
        setLastCity(record.lastCityPermResidence ?? "");
        setAccept(parseBool(record.decision));
        setComments(record.additionalComments ?? "");
        setFormID(Number(record.id ?? 0));
        setInitialID(Number(record.initialid ?? 0));
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
    fetchData();
  }, [backend, sessionId]);

  const handleSubmit = async () => {
    const caseManagerMap = new Map<string, number>(
      caseManagers.map((cm) => [`${cm.firstName} ${cm.lastName}`, cm.id])
    );

    const cm_id = caseManagerMap.get(clientCM);

    try {
      if (!cm_id) {
        toast({
          title: "Missing case manager",
          description: "Please select a case manager before submitting.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Normalize applicant_type_status to ensure it's a valid enum value
      const normalizedAppType = appType && (appType.toLowerCase() === 'single' || appType.toLowerCase() === 'family')
        ? appType.toLowerCase()
        : null;

      const screenerData = {
        cm_id: cm_id,
        willingness: willingness,
        employability: employability,
        attitude: attitude,
        length_of_sobriety: length === "" ? 0 : length,
        completed_tx: tx,
        homeless_episode_one: h1,
        homeless_episode_two: h2,
        homeless_episode_three: h3,
        disabling_condition: dCondition,
        employed: employed,
        driver_license: dLicense,
        num_of_children: numChildren === "" ? 0 : numChildren,
        children_in_custody: numCustody === "" ? 0 : numCustody,
        last_city_perm_residence: lastCity,
        decision: accept,
        additional_comments: comments,
        session_id: sessionId,
        applicant_type_status: normalizedAppType,
      };


      let response;

      // If we have a sessionId, check if a screener comment already exists for this session
      if (sessionId) {
        try {
          const existingRes = await backend.get(`/screenerComment/session/${sessionId}`);
          const existingData = Array.isArray(existingRes.data) ? existingRes.data : [];
          
          if (existingData.length > 0 && existingData[0].id) {
            // Update existing screener_comment for this session
            response = await backend.patch(
              `/screenerComment/${existingData[0].id}`,
              screenerData
            );
          } else {
            // No existing record found, create a new one
            response = await backend.post(`/screenerComment`, screenerData);
          }
        } catch (error: unknown) {
          // If 404 or any error, assume no existing record and create new one
          if ((error as { response?: { status?: number } })?.response?.status === 404) {
            response = await backend.post(`/screenerComment`, screenerData);
          } else {
            throw error;
          }
        }
      } else if (formID) {
        // Legacy fallback: update by existing screener_comment id
        response = await backend.patch(
          `/screenerComment/${formID}`,
          screenerData
        );
      } else {
        // Legacy fallback: create a new screener_comment without sessionId
        response = await backend.post(`/screenerComment`, screenerData);
      }

      if (response) {
        toast({
          title: "Comment Form Saved",
          description:
            "The comment form has been saved successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigateBack();
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast({
        title: "Error!",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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

      <Flex
        flexBasis={"row"}
        justifyContent={"flex-start"}
        paddingBottom={"40px"}
      >
        <ArrowBackIcon
          onClick={navigateBack}
          color="blue.500"
          cursor="pointer"
          _hover={{
            bg: "gray.700",
            borderRadius: "md",
            color: "white"
          }}
          boxSize={6}
        />
      </Flex>

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
        <FormControl>
          <HStack
            justify="flex-start"
            spacing={25}
          >
            <FormLabel w="40%">Entering as single or family?</FormLabel>
            <Select
              value={appType}
              onChange={(e) => setAppType(String(e.target.value))}
              w="200px"
              borderRadius="xl"
              placeholder="Select type"
            >
              <option value="single">Single</option>
              <option value="family">Family</option>
            </Select>
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
              value={length === "" ? "" : length}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") setLength("");
                else {
                  const n = Number(raw);
                  setLength(Number.isNaN(n) ? "" : n);
                }
              }}
              w="200px"
              borderRadius="xl"
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%">Completed Tx</FormLabel>
            <RadioGroup
              value={String(tx)}
              onChange={(value) => setTx(value === "true")}
              w="200px"
            >
              <HStack spacing={4} ml={4}>
                <Radio value="true">Yes</Radio>
                <Radio value="false">No</Radio>
              </HStack>
            </RadioGroup>
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
            <FormLabel>3</FormLabel>
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
        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%">Disabling Condition?</FormLabel>
            <Input
              w="200px"
              borderRadius="xl"
              placeholder="Type Here"
              value={dCondition}
              onChange={(e) => setDCondition(e.target.value)}
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%">Employment?</FormLabel>
            <RadioGroup
              value={String(employed)}
              onChange={(value) => setEmployed(value === "true")}
              w="200px"
            >
              <HStack spacing={4} ml={4}>
                <Radio value="true">Yes</Radio>
                <Radio value="false">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%">Driver&apos;s License?</FormLabel>
            <RadioGroup
              value={String(dLicense)}
              onChange={(value) => setDLicense(value === "true")}
              w="200px"
            >
              <HStack spacing={4} ml={4} >
                <Radio value="true">Yes</Radio>
                <Radio value="false">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%">Total # of children?</FormLabel>
            <Input
              w="200px"
              borderRadius="xl"
              type="number"
              value={numChildren === "" ? "" : numChildren}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") setNumChildren("");
                else {
                  const n = Number(raw);
                  setNumChildren(Number.isNaN(n) ? "" : n);
                }
              }}
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%">Total # of children in custody?</FormLabel>
            <Input
              w="200px"
              borderRadius="xl"
              type="number"
              value={numCustody === "" ? "" : numCustody}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") setNumCustody("");
                else {
                  const n = Number(raw);
                  setNumCustody(Number.isNaN(n) ? "" : n);
                }
              }}
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%">Last City of Permanent Residence?</FormLabel>
            <Input
              w="200px"
              borderRadius="xl"
              placeholder="Type Here"
              value={lastCity}
              onChange={(e) => setLastCity(e.target.value)}
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%">Would you accept this client into CCH?</FormLabel>
            <RadioGroup
              value={String(accept)}
              onChange={(value) => setAccept(value === "true")}
              w="200px"
            >
              <HStack spacing={4} ml={4}>
                <Radio value="true">Yes</Radio>
                <Radio value="false">No</Radio>
              </HStack>
            </RadioGroup>
          </HStack>
        </FormControl>

        <FormControl>
          <HStack spacing={25}>
            <FormLabel w="40%">Additional comments or concerns?</FormLabel>
            <Input
              w="200px"
              borderRadius="xl"
              placeholder="Type Here"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </HStack>
        </FormControl>
      </VStack>

      <HStack
        spacing={4}
        mt={6}
        justify="flex-end"
      >
        <Button
          type="submit"
          variant="outline"
          onClick={navigateBack}
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
