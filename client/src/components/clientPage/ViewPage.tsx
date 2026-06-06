import { useEffect, useState, useCallback } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { calculateAge } from "../../utils/dateUtils";
import toSnakeCase from "../../utils/snakeCase";
import ChildrenCards from "./subComponents/childrenCards";
import Comments from "./subComponents/comments";
import Forms from "./subComponents/forms";
import { Client, FormItems } from "./types";

const emptyClient: Client = {
  age: 0,
  attendingSchoolUponEntry: false,
  attendingSchoolUponExit: false,
  bedNights: 0,
  bedNightsChildren: 0,
  chronicallyHomeless: false,
  cityOfLastPermanentResidence: "",
  createdBy: 0,
  caseManagerFirstName: "",
  caseManagerLastName: "",
  dateOfBirth: "",
  destinationcity: "",
  disabledChildren: false,
  email: "",
  emergencyContactName: "",
  emergencyContactPhoneNumber: "",
  employmentGained: false,
  entranceDate: "",
  estimatedExitDate: "",
  ethnicity: "",
  exitDate: "",
  firstName: "",
  grant: "",
  homelessnessLength: 0,
  id: 0,
  lastName: "",
  medical: false,
  phoneNumber: "",
  pregnantUponEntry: false,
  priorLiving: "",
  priorLivingCity: "",
  race: "",
  reasonForLeaving: "",
  reunified: false,
  savingsAmount: "",
  shelterInLastFiveYears: false,
  specificDestination: "",
  specificReasonForLeaving: "",
  status: "",
  successfulCompletion: false,
  unitName: "",
  comments: "",
};

export interface Children {
  id: number;
  firstName: string;
  lastName: string;
  parentId: number;
  dateOfBirth: string;
  reunified: boolean;
  comments: string;
}

export const ViewPage = () => {
  const { backend } = useBackendContext();
  const [client, setClient] = useState<Client>(emptyClient);
  const [edits, setEdits] = useState<Partial<Client>>({});
  const [children, setChildren] = useState<Children[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ id: string }>();
  const [formItems, setFormItems] = useState<FormItems[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const cellHeight = "40px";
  const toast = useToast();

  // Auto-populate age whenever the user changes the date of birth while editing
  useEffect(() => {
    if (edits.dateOfBirth === undefined) return;
    const iso = String(edits.dateOfBirth).trim();
    if (!iso) return;
    const age = calculateAge(iso);
    if (!isNaN(age)) setEdits((prev) => ({ ...prev, age }));
  }, [edits.dateOfBirth]);

  // Converts any stored date string to YYYY-MM-DD for <input type="date">
  const toIsoDate = (raw: string | undefined | null): string => {
    if (!raw) return "";
    const s = String(raw).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.split("T")[0];
    const parts = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (parts) {
      const [, m, d, y] = parts;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    return "";
  };

  // Converts any stored date string to M/D/YYYY for display
  const formatDisplayDate = (raw: string | undefined | null): string => {
    if (!raw) return "";
    const iso = toIsoDate(raw);
    if (!iso) return String(raw);
    const [y, m, d] = iso.split("-");
    return `${parseInt(m)}/${parseInt(d)}/${y}`;
  };

  const renderField = (
    fieldName: keyof Client,
    displayValue: any,
    options?: { isBoolean?: boolean; isNumeric?: boolean; isDate?: boolean }
  ) => {
    const currentValue =
      edits[fieldName] !== undefined ? edits[fieldName] : displayValue;

    if (isEditing) {
      if (options?.isBoolean) {
        const currentVal = edits[fieldName] !== undefined ? edits[fieldName] : displayValue;
        return (
          <RadioGroup
            value={currentVal ? "true" : "false"}
            onChange={(val) => setEdits({ ...edits, [fieldName]: val === "true" })}
          >
            <HStack spacing={6}>
              <Radio value="true">Yes</Radio>
              <Radio value="false">No</Radio>
            </HStack>
          </RadioGroup>
        );
      }

      if (options?.isDate) {
        const isoValue = edits[fieldName] !== undefined
          ? String(edits[fieldName])
          : toIsoDate(String(displayValue ?? ""));
        return (
          <Box w="100%" h={cellHeight} bg="#EDF2F7" display="flex" alignItems="center" p={0} m={0}>
            <Input
              type="date"
              variant="unstyled"
              size="sm"
              w="100%"
              p={3}
              m={0}
              border="1px solid"
              borderColor="#3182CE"
              value={isoValue}
              onChange={(e) => setEdits({ ...edits, [fieldName]: e.target.value })}
            />
          </Box>
        );
      }

      return (
        <Box
          w="100%"
          h={cellHeight}
          bg="#EDF2F7"
          display="flex"
          alignItems="center"
          p={0}
          m={0}
        >
          <Input
            variant="unstyled"
            size="sm"
            w="100%"
            p={3}
            m={0}
            border="1px solid"
            borderColor="#3182CE"
            value={currentValue ?? ""}
            onChange={(e) => {
              let newValue = e.target.value;
              if (options?.isNumeric) {
                if (newValue !== "" && !/^\d+$/.test(newValue)) return;
              }
              setEdits({ ...edits, [fieldName]: newValue });
            }}
          />
        </Box>
      );
    }

    return (
      <Box w="100%" h={cellHeight} display="flex" alignItems="center" p={0}>
        {options?.isBoolean
          ? displayValue === null || displayValue === undefined
            ? ""
            : displayValue
              ? "Yes"
              : "No"
          : options?.isDate
          ? formatDisplayDate(String(displayValue ?? ""))
          : displayValue ?? ""}
      </Box>
    );
  };

  function NoEditToast() {
    toast({
      title: "Did Not Save Changes",
      description: "There was an error while saving changes",
      status: "warning",
      duration: 800,
      isClosable: true,
      position: "bottom-right"
    });
  };

  function SaveEditToast() {
    toast({
      title: "Successfully Saved Changes",
      description: "Initial Screen Comment Form.",
      status: "success",
      duration: 800,
      isClosable: true,
      position: "bottom-right"
    })
  }

  const fetchChildren = useCallback(async (id: number) => {
    try {
      const response = await backend.get(`/children/${id}`);
      setChildren(response.data);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Failed to fetch children");
    }
  }, [backend]);

  const refreshChildren = useCallback(() => {
    if (params.id) {
      fetchChildren(parseInt(params.id));
    }
  }, [params.id, fetchChildren]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (params.id) {
        const intId = parseInt(params.id);

        const [clientRes, formsRes] = await Promise.allSettled([
          backend.get(`/clients/${intId}`),
          backend.get(`/formsCombined/${intId}`),
        ]);

        await fetchChildren(intId);

        if (clientRes.status === "fulfilled" && clientRes.value.data?.[0]) {
          setClient({ ...emptyClient, ...clientRes.value.data[0] });
        } else if (clientRes.status === "rejected") {
          setError((clientRes.reason as { message?: string })?.message ?? "Failed to fetch client");
        }

        if (formsRes.status === "fulfilled") {
          setFormItems(formsRes.value.data);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [backend, params.id, fetchChildren]);

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  const toggleEditForm = () => {
    if (isEditing) {
      setEdits({});
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      if (!client || Object.keys(edits).length === 0) {
        return;
      }
      const clientDataSnakeCase = toSnakeCase(edits);
      await backend.put(`/clients/${client.id}`, clientDataSnakeCase);
      setClient({ ...client, ...edits });
      setEdits({});
      SaveEditToast();
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Did Not Save Changes",
        description: "There was an error while saving changes",
        status: "warning",
        duration: 800,
        isClosable: true,
      });
      console.error("Error updating client information:", error.message);
    }
  };

  return (
    <>
      <Box w="100%" p={4}>
        <HStack w="100%" align="flex-start">
          <HStack w="60%" spacing={8} align="center">
            <Avatar
              name={`${client.firstName} ${client.lastName}`}
              boxSize="120px"
              fontSize="3rem"
              sx={{ "& .chakra-avatar__initials": { fontSize: "3rem" } }}
            />
            <VStack align="start" spacing={1}>
              <Text fontSize="4xl" fontWeight="bold">
                {client.firstName} {client.lastName}
              </Text>
            </VStack>
          </HStack>
          <HStack w="40%" justify="flex-end">
            <Card
              bg="white"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.100"
              borderRadius="md"
              px={4}
              py={2}
              minW="200px"
              maxW="fit-content"
              padding={4}
              marginTop={5}
            >
              <HStack spacing={10}>
                <Text fontWeight="medium" fontSize="md">
                  {client.email}
                </Text>
                <Text fontWeight="medium" fontSize="md">
                  {client.phoneNumber}
                </Text>
              </HStack>
            </Card>
          </HStack>
        </HStack>
      </Box>
      <Tabs>
        <TabList w="fit-content" ml="3vh">
          <Tab>Children</Tab>
          <Tab>Forms</Tab>
          <Tab>Comments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ChildrenCards items={children} parentId={client.id} onRefresh={refreshChildren} />
          </TabPanel>
          <TabPanel>
            <Forms forms={[...formItems]} />
          </TabPanel>
          <TabPanel>
            <Comments clientId={client.id} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Box>
        <Box mb={6} mr={4} ml={4}>
          <HStack mt="5%" w="95%" mx="2.5%">
            <Text fontSize='xl' fontWeight="semibold">Client Information</Text>
            <Spacer />
            <Stack direction="row">
              <Button
                onClick={() => {
                  if (isEditing) {
                    NoEditToast();
                  }
                  toggleEditForm();
                }}
                bg={isEditing ? "#EDF2F7" : "#3182CE"}
                color={isEditing ? "black" : "white"}
              >
                {isEditing ? "Cancel" : "Edit Information"}
              </Button>
              {isEditing && (
                <Box>
                  <Button bg="#3182CE" color="white" onClick={handleSaveChanges} isDisabled={Object.keys(edits).length === 0}>
                    Save
                  </Button>
                </Box>
              )}
            </Stack>
          </HStack>
          <TableContainer
            sx={{
              overflowX: "auto",
              overflowY: "auto",
              border: "2px solid",
              borderColor: "#E2E8F0",
              borderRadius: "lg",
            }}
            mx="2.5%"
            w="95%"
            mt={4}
          >
            <Table sx={{ tableLayout: "fixed", width: "100%" }}>
              <Thead h='7vh' >
                <Tr>
                  <Th fontSize="md" color="black"  >
                    Question
                  </Th>
                  <Th fontSize="md" color="black">
                    Answer
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>ID</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {client.id}
                  </Td>
                </Tr>
                <Tr>
                  <Td>First Name</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("firstName", client.firstName)}</Td>
                </Tr>
                <Tr>
                  <Td>Last Name</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("lastName", client.lastName)}</Td>
                </Tr>
                <Tr>
                  <Td>Date of Birth</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField("dateOfBirth", client.dateOfBirth, { isDate: true })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Age</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("age", client.age, { isNumeric: true })}
                  </Td>
                </Tr>

                <Tr>
                  <Td>Email</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("email", client.email)}</Td>
                </Tr>
                <Tr>
                  <Td>Phone Number</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("phoneNumber", client.phoneNumber)}</Td>
                </Tr>
                <Tr>
                  <Td>Created By</Td>
                  <Td bgColor="white" p={4}>
                    <Box w="100%" h="40px" display="flex" alignItems="center">
                      {[client.caseManagerFirstName, client.caseManagerLastName].filter(Boolean).join(" ") || "—"}
                    </Box>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Grant</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("grant", client.grant)}</Td>
                </Tr>
                <Tr>
                  <Td>Status</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("status", client.status)}</Td>
                </Tr>
                <Tr>
                  <Td>Ethnicity</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("ethnicity", client.ethnicity)}</Td>
                </Tr>
                <Tr>
                  <Td>Race</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("race", client.race)}</Td>
                </Tr>
                <Tr>
                  <Td>Medical</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField("medical", client.medical, { isBoolean: true })}
                  </Td>
                </Tr>
                <Tr>
                  <Td >Emergency Contact Name</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField("emergencyContactName", client.emergencyContactName)}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Emergency Contact Phone</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField(
                      "emergencyContactPhoneNumber",
                      client.emergencyContactPhoneNumber
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Homelessness Length (years)</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField(
                      "homelessnessLength",
                      client.homelessnessLength,
                      { isNumeric: true }
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Reunified</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField("reunified", client.reunified, { isBoolean: true })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Successful Completion</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField(
                      "successfulCompletion",
                      client.successfulCompletion,
                      { isBoolean: true }
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Pregnant Upon Entry</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField("pregnantUponEntry", client.pregnantUponEntry, {
                      isBoolean: true,
                    })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Disabled Children</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField("disabledChildren", client.disabledChildren, {
                      isBoolean: true,
                    })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Attending School Upon Entry</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField(
                      "attendingSchoolUponEntry",
                      client.attendingSchoolUponEntry,
                      { isBoolean: true }
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Attending School Upon Exit</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField(
                      "attendingSchoolUponExit",
                      client.attendingSchoolUponExit,
                      { isBoolean: true }
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Savings Amount</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("savingsAmount", client.savingsAmount)}</Td>
                </Tr>
                <Tr>
                  <Td>Specific Destination</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField("specificDestination", client.specificDestination)}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Estimated Exit Date</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField("estimatedExitDate", client.estimatedExitDate, { isDate: true })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Exit Date</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField("exitDate", client.exitDate, { isDate: true })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Unit Name</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField("unitName", client.unitName, { isNumeric: false })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Prior Living</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("priorLiving", client.priorLiving)}</Td>
                </Tr>
                <Tr>
                  <Td>Prior Living City</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("priorLivingCity", client.priorLivingCity)}</Td>
                </Tr>
                <Tr>
                  <Td>Shelter in Last Five Years</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField(
                      "shelterInLastFiveYears",
                      client.shelterInLastFiveYears,
                      { isBoolean: true }
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Specific Reason for Leaving</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>
                    {renderField(
                      "specificReasonForLeaving",
                      client.specificReasonForLeaving
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Reason for Leaving</Td>
                  <Td bgColor={isEditing ? "#EDF2F7" : "white"} p={4}>{renderField("reasonForLeaving", client.reasonForLeaving)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};
