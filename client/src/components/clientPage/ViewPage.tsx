import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  HStack,
  Image,
  Input,
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
  VStack,
} from "@chakra-ui/react";

import { useParams } from "react-router-dom";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import toSnakeCase from "../../utils/snakeCase";
import ChildrenCards from "./childrenCards";
import Comments from "./comments";
import CSVButton from "./CSVButton";
import Forms from "./forms";
import image from "./pfp.jpeg";
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
  dateOfBirth: "",
  destinationcity: "",
  disabledChildren: false,
  email: "",
  emergencyContactName: "",
  emergencyContactPhoneNumber: "",
  employmentGained: false,
  entranceDate: "",
  estimatedExitdate: "",
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
  unitId: 0,
  comments: "",
};

export interface Children {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: number;
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

  useEffect(() => {
    const fetchChildren = async (id: number) => {
      try {
        const response = await backend.get(`/children/${id}`);
        setChildren(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    const fetchClient = async (id: number) => {
      try {
        const response = await backend.get(`/clients/${id}`);
        setClient(response.data[0]);
      } catch (err: any) {
        setError(err.message);
      }
    };

    const fetchForms = async (id: number) => {
      try {
        const response = await backend.get(`/formsCombined/${id}`);
        setFormItems(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      if (params.id) {
        const intId = parseInt(params.id);
        await Promise.all([
          fetchChildren(intId),
          fetchClient(intId),
          fetchForms(intId),
        ]);
      }
      setLoading(false);
    };

    fetchData();
  }, [backend, params.id]);

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
      if (!client) {
        console.error("Client data is undefined!");
        return;
      }
      const updatedClient = { ...client, ...edits };
      const clientDataSnakeCase = toSnakeCase(updatedClient);
      await backend.put(`/clients/${client.id}`, clientDataSnakeCase);
      setClient(updatedClient);
      setEdits({});
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating client information:", error.message);
    }
  };

  const renderField = (
    fieldName: keyof Client,
    displayValue: any,
    options?: { isBoolean?: boolean; isNumeric?: boolean }
  ) => {
    if (isEditing) {
      return (
        <Input
          value={
            edits[fieldName] !== undefined ? edits[fieldName] : displayValue
          }
          onChange={(e) => {
            let value: any = e.target.value;
            if (options?.isBoolean) {
              value = value.toLowerCase() === "yes";
            }
            if (options?.isNumeric) {
              value = parseInt(value);
            }
            setEdits({ ...edits, [fieldName]: value });
          }}
        />
      );
    }
    if (options?.isBoolean) {
      return displayValue ? "Yes" : "No";
    }
    return displayValue;
  };

  return (
    <div>
      <Box
        w="100%"
        p={4}
      >
        <HStack
          w="100%"
          align="flex-start"
        >
          <HStack
            w="60%"
            spacing={8}
            align="center"
          >
            <Image
              boxSize="120px"
              objectFit="cover"
              borderRadius="full"
              src={image}
              alt={`${client.firstName} ${client.lastName}`}
            />
            <VStack
              align="start"
              spacing={1}
            >
              <Text
                fontSize="4xl"
                fontWeight="bold"
              >
                {client.firstName} {client.lastName}
              </Text>
              <Text
                fontSize="xs"
                color="gray.600"
              >
                Last Updated: MM/DD/YYYY HH:MM XX
              </Text>
            </VStack>
          </HStack>
          <HStack
            w="40%"
            justify="flex-end"
          >
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
                <Text
                  fontWeight="medium"
                  fontSize="md"
                >
                  {client.email}
                </Text>
                <Text
                  fontWeight="medium"
                  fontSize="md"
                >
                  {client.phoneNumber}
                </Text>
              </HStack>
            </Card>
          </HStack>
        </HStack>
      </Box>
      <Tabs>
        <TabList
          w="fit-content"
          ml="3vh"
        >
          <Tab>Children</Tab>
          <Tab>Forms</Tab>
          <Tab>Comments</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ChildrenCards items={children} />
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
        <Box
          mb={6}
          mr={4}
          ml={4}
        >
          <HStack mt="5%" w="95%" mx="2.5%">
            <Text fontWeight="semibold">Client Information</Text>
            <Spacer />
            <Stack direction="row">
              <Button
                onClick={toggleEditForm}
                bg={isEditing ? "#EDF2F7" : "#3182CE"}
                color={isEditing ? "black" : "white"}
              >
                {isEditing ? "Cancel" : "Edit Information"}
              </Button>
              {isEditing && (
                <Box>
                  <Button
                    bg="#3182CE"
                    color="white"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Stack>
          </HStack>
          <TableContainer
            sx={{
              overflowX: "auto",
              overflowY: "auto",
              border: "1px solid gray",
              borderColor: "gray.100",
              borderRadius: "md",
            }}
            mx="2.5%"
              w="95%"
            mt={4}
          >
            <Table
              variant="simple"

            >
              <Thead>
                <Tr>
                  <Th fontSize="md" color="black">Question</Th>
                  <Th fontSize="md" color="black">Answer</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>ID</Td>
                  <Td>{client.id}</Td>
                </Tr>
                <Tr>
                  <Td>First Name</Td>
                  <Td>{renderField("firstName", client.firstName)}</Td>
                </Tr>
                <Tr>
                  <Td>Last Name</Td>
                  <Td>{renderField("lastName", client.lastName)}</Td>
                </Tr>
                <Tr>
                  <Td>Age</Td>
                  <Td>{renderField("age", client.age, { isNumeric: true })}</Td>
                </Tr>
                <Tr>
                  <Td>Date of Birth</Td>
                  <Td>{renderField("dateOfBirth", client.dateOfBirth)}</Td>
                </Tr>
                <Tr>
                  <Td>Email</Td>
                  <Td>{renderField("email", client.email)}</Td>
                </Tr>
                <Tr>
                  <Td>Phone Number</Td>
                  <Td>{renderField("phoneNumber", client.phoneNumber)}</Td>
                </Tr>
                <Tr>
                  <Td>Created By</Td>
                  <Td>
                    {renderField("createdBy", client.createdBy, {
                      isNumeric: true,
                    })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Grant</Td>
                  <Td>{renderField("grant", client.grant)}</Td>
                </Tr>
                <Tr>
                  <Td>Status</Td>
                  <Td>{renderField("status", client.status)}</Td>
                </Tr>
                <Tr>
                  <Td>Ethnicity</Td>
                  <Td>{renderField("ethnicity", client.ethnicity)}</Td>
                </Tr>
                <Tr>
                  <Td>Race</Td>
                  <Td>{renderField("race", client.race)}</Td>
                </Tr>
                <Tr>
                  <Td>Medical</Td>
                  <Td>
                    {renderField("medical", client.medical, { isBoolean: true })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Emergency Contact Name</Td>
                  <Td>
                    {renderField(
                      "emergencyContactName",
                      client.emergencyContactName
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Emergency Contact Phone</Td>
                  <Td>
                    {renderField(
                      "emergencyContactPhoneNumber",
                      client.emergencyContactPhoneNumber
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Homelessness Length (years)</Td>
                  <Td>
                    {renderField(
                      "homelessnessLength",
                      client.homelessnessLength,
                      { isNumeric: true }
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Reunified</Td>
                  <Td>
                    {renderField("reunified", client.reunified, {
                      isBoolean: true,
                    })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Successful Completion</Td>
                  <Td>
                    {renderField(
                      "successfulCompletion",
                      client.successfulCompletion,
                      { isBoolean: true }
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Pregnant Upon Entry</Td>
                  <Td>
                    {renderField("pregnantUponEntry", client.pregnantUponEntry, {
                      isBoolean: true,
                    })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Disabled Children</Td>
                  <Td>
                    {renderField("disabledChildren", client.disabledChildren, {
                      isBoolean: true,
                    })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Attending School Upon Entry</Td>
                  <Td>
                    {renderField(
                      "attendingSchoolUponEntry",
                      client.attendingSchoolUponEntry,
                      { isBoolean: true }
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Attending School Upon Exit</Td>
                  <Td>
                    {renderField(
                      "attendingSchoolUponExit",
                      client.attendingSchoolUponExit,
                      { isBoolean: true }
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Savings Amount</Td>
                  <Td>{renderField("savingsAmount", client.savingsAmount)}</Td>
                </Tr>
                <Tr>
                  <Td>Specific Destination</Td>
                  <Td>
                    {renderField(
                      "specificDestination",
                      client.specificDestination
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Estimated Exit Date</Td>
                  <Td>
                    {renderField("estimatedExitdate", client.estimatedExitdate)}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Exit Date</Td>
                  <Td>{renderField("exitDate", client.exitDate)}</Td>
                </Tr>
                <Tr>
                  <Td>Unit ID</Td>
                  <Td>
                    {renderField("unitId", client.unitId, { isNumeric: true })}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Prior Living</Td>
                  <Td>{renderField("priorLiving", client.priorLiving)}</Td>
                </Tr>
                <Tr>
                  <Td>Prior Living City</Td>
                  <Td>
                    {renderField("priorLivingCity", client.priorLivingCity)}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Shelter in Last Five Years</Td>
                  <Td>
                    {renderField(
                      "shelterInLastFiveYears",
                      client.shelterInLastFiveYears,
                      { isBoolean: true }
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Specific Reason for Leaving</Td>
                  <Td>
                    {renderField(
                      "specificReasonForLeaving",
                      client.specificReasonForLeaving
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Reason for Leaving</Td>
                  <Td>
                    {renderField("reasonForLeaving", client.reasonForLeaving)}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>

          {/* {!isEditing ? <CSVButton data={client} ml={4}/> : <></>} */}
        </Box>
      </Box>
    </div>
  );
};
