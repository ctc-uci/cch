import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import { useParams } from "react-router-dom";
import CSVButton from "./CSVButton";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import Comments from "./comments";
import ChildrenCards from "./childrenCards";
import Forms from "./forms"
interface Client {
  age: number;
  attendingSchoolUponEntry: boolean;
  attendingSchoolUponExit: boolean;
  bedNights: number;
  bedNightsChildren: number;
  chronicallyHomeless: boolean;
  cityOfLastPermanentResidence: string;
  createdBy: number;
  dateOfBirth: string;
  destinationcity: string;
  disabledChildren: boolean;
  email: string;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  employmentGained: boolean;
  entranceDate: string;
  estimatedExitdate: string;
  ethnicity: string;
  exitDate: string;
  firstName: string;
  grant: string;
  homelessnessLength: number;
  id: number;
  lastName: string;
  medical: boolean;
  phoneNumber: string;
  pregnantUponEntry: boolean;
  priorLiving: string;
  priorLivingCity: string;
  race: string;
  reasonForLeaving: string;
  reunified: boolean;
  savingsAmount: string;
  shelterInLastFiveYears: boolean;
  specificDestination: string;
  specificReasonForLeaving: string;
  status: string;
  successfulCompletion: boolean;
  unitId: number;
  comments: string;
}

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
}

export const ViewPage = () => {
  const { backend } = useBackendContext();
  const [client, setClient] = useState<Client>(emptyClient);
  const [children, setChildren] = useState<Children[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ id: string }>();

  //Toggles visibility
  const [isEditing, setIsEditing] = useState(false);

  //fetches the database for children
  const fetchChildren = async (id: number) => {
    try {
      const response = await backend.get(`/children/${id}`);
      setChildren(response.data); // Adjust this if the response structure is different
    } catch (err) {
      setError(err.message);
    }
  };

  //fetches the database for clients
  const fetchClient = async (id: number) => {
    try {
      const response = await backend.get(`/clients/${id}`);
      setClient(response.data[0]);
    } catch (err) {
      setError(err.message);
    }
  };

  //fetches info from both data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (params.id) {
        const intId = parseInt(params.id);
        await Promise.all([fetchChildren(intId), fetchClient(intId)]); // Fetch both routes simultaneously
      }
      setLoading(false);
    };
    fetchData();
  }, []); // Fetch data once when the component mounts

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  const toggleEditForm = () => {
    setIsEditing(!isEditing); // Toggle the editing state
  };
  /*
  //TODO: WORK ON THIS
  // Function to handle saving changes (dummy example for now)
  const handleSaveChanges = () => {
      setIsEditing(false); // Hide the form after saving
  };
*/
  // Function to convert camelCase to snake_case
  function toSnakeCase(obj: { [key: string]: any }): { [key: string]: any } {
    const snakeCased: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      snakeCased[snakeKey] = value;
    }

    return snakeCased;
  }

  const handleSaveChanges = async () => {
    try {
      if (!client) {
        console.error("Client data is undefined!");
        return; // Exit early if `client` is undefined
      }

      // Convert client object from camelCase to snake_case before sending it to the backend
      const clientData = toSnakeCase(client);
      console.log("Saving client changes...", clientData);
      // Send the updated client data in snake_case format
      await backend.put(`/clients/${client.id}`, clientData);

      console.log("Client information updated successfully!");
      setIsEditing(false); // Hide the form after saving
    } catch (error) {
      console.error("Error updating client information:", error.message);
    }
  };
  //Table for Children Info
  return (
    <div>
      <Tabs>
        <TabList>
          <Tab>Children</Tab>
          <Tab>Forms</Tab>
          <Tab>Comments</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ChildrenCards items={children} />
          </TabPanel>
          <TabPanel>
            <Forms/>
          </TabPanel>
          <TabPanel>
            <Comments clientId={client.id}/>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Box>
        <Box mb={6}>
          {!isEditing ? <h2>Client Information</h2> : <p></p>}
          {!isEditing && client ? (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Question</Th>
                  <Th>Answer</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>ID</Td>
                  <Td>{client.id}</Td>
                </Tr>
                <Tr>
                  <Td>First Name</Td>
                  <Td>{client.firstName}</Td>
                </Tr>
                <Tr>
                  <Td>Last Name</Td>
                  <Td>{client.lastName}</Td>
                </Tr>
                <Tr>
                  <Td>Age</Td>
                  <Td>{client.age}</Td>
                </Tr>
                <Tr>
                  <Td>Date of Birth</Td>
                  <Td>{client.dateOfBirth}</Td>
                </Tr>
                <Tr>
                  <Td>Email</Td>
                  <Td>{client.email}</Td>
                </Tr>
                <Tr>
                  <Td>Phone Number</Td>
                  <Td>{client.phoneNumber}</Td>
                </Tr>
                <Tr>
                  <Td>Created By</Td>
                  <Td>{client.createdBy}</Td>
                </Tr>
                <Tr>
                  <Td>Grant</Td>
                  <Td>{client.grant}</Td>
                </Tr>
                <Tr>
                  <Td>Status</Td>
                  <Td>{client.status}</Td>
                </Tr>
                <Tr>
                  <Td>Ethnicity</Td>
                  <Td>{client.ethnicity}</Td>
                </Tr>
                <Tr>
                  <Td>Race</Td>
                  <Td>{client.race}</Td>
                </Tr>
                <Tr>
                  <Td>Medical</Td>
                  <Td>{client.medical ? "Yes" : "No"}</Td>
                </Tr>
                <Tr>
                  <Td>Emergency Contact Name</Td>
                  <Td>{client.emergencyContactName}</Td>
                </Tr>
                <Tr>
                  <Td>Emergency Contact Phone</Td>
                  <Td>{client.emergencyContactPhoneNumber}</Td>
                </Tr>
                <Tr>
                  <Td>Homelessness Length</Td>
                  <Td>{client.homelessnessLength} years</Td>
                </Tr>
                <Tr>
                  <Td>Reunified</Td>
                  <Td>{client.reunified ? "Yes" : "No"}</Td>
                </Tr>
                <Tr>
                  <Td>Successful Completion</Td>
                  <Td>{client.successfulCompletion ? "Yes" : "No"}</Td>
                </Tr>
                <Tr>
                  <Td>Pregnant Upon Entry</Td>
                  <Td>{client.pregnantUponEntry ? "Yes" : "No"}</Td>
                </Tr>
                <Tr>
                  <Td>Disabled Children</Td>
                  <Td>{client.disabledChildren ? "Yes" : "No"}</Td>
                </Tr>
                <Tr>
                  <Td>Attending School Upon Entry</Td>
                  <Td>{client.attendingSchoolUponEntry ? "Yes" : "No"}</Td>
                </Tr>
                <Tr>
                  <Td>Attending School Upon Exit</Td>
                  <Td>{client.attendingSchoolUponExit ? "Yes" : "No"}</Td>
                </Tr>
                <Tr>
                  <Td>Savings Amount</Td>
                  <Td>{client.savingsAmount}</Td>
                </Tr>
                <Tr>
                  <Td>Specific Destination</Td>
                  <Td>{client.specificDestination}</Td>
                </Tr>
                <Tr>
                  <Td>Estimated Exit Date</Td>
                  <Td>{client.estimatedExitdate}</Td>
                </Tr>
                <Tr>
                  <Td>Exit Date</Td>
                  <Td>{client.exitDate}</Td>
                </Tr>
                <Tr>
                  <Td>Unit ID</Td>
                  <Td>{client.unitId}</Td>
                </Tr>
                <Tr>
                  <Td>Prior Living</Td>
                  <Td>{client.priorLiving}</Td>
                </Tr>
                <Tr>
                  <Td>Prior Living City</Td>
                  <Td>{client.priorLivingCity}</Td>
                </Tr>
                <Tr>
                  <Td>Shelter in Last Five Years</Td>
                  <Td>{client.shelterInLastFiveYears ? "Yes" : "No"}</Td>
                </Tr>
                <Tr>
                  <Td>Specific Reason for Leaving</Td>
                  <Td>{client.specificReasonForLeaving}</Td>
                </Tr>
                <Tr>
                  <Td>Reason for Leaving</Td>
                  <Td>{client.reasonForLeaving}</Td>
                </Tr>
              </Tbody>
            </Table>
          ) : (
            <p></p>
          )}

          <Button
            colorScheme="blue"
            onClick={toggleEditForm}
          >
            {isEditing ? "Cancel" : "Edit Client Information"}
          </Button>
          <CSVButton data={client} />

          {/* Conditionally render the edit form */}
          {isEditing && (
            <Box mt={4}>
              <h3>Edit Client Information</h3>
              <Stack spacing={3}>
                <Input
                  placeholder="First Name"
                  defaultValue={client.firstName}
                  onChange={(e) =>
                    setClient({ ...client, firstName: e.target.value })
                  }
                />
                <Input
                  placeholder="Last Name"
                  defaultValue={client.lastName}
                  onChange={(e) =>
                    setClient({ ...client, lastName: e.target.value })
                  }
                />
                <Input
                  placeholder="Age"
                  defaultValue={client.age}
                  onChange={(e) =>
                    setClient({ ...client, age: parseInt(e.target.value) })
                  }
                />
                <Input
                  placeholder="Date of Birth"
                  defaultValue={client?.dateOfBirth}
                  onChange={(e) =>
                    setClient({ ...client, dateOfBirth: e.target.value })
                  }
                />
                <Input
                  placeholder="Email"
                  defaultValue={client?.email}
                  onChange={(e) =>
                    setClient({ ...client, email: e.target.value })
                  }
                />
                <Input
                  placeholder="Phone Number"
                  defaultValue={client?.phoneNumber}
                  onChange={(e) =>
                    setClient({ ...client, phoneNumber: e.target.value })
                  }
                />
                    <Input
                      placeholder="Grant"
                      defaultValue={client?.grant}
                      onChange={(e) => setClient({ ...client, grant: e.target.value })}
                    />
                    <Input
                      placeholder="Status"
                      defaultValue={client?.status}
                      onChange={(e) => setClient({ ...client, status: e.target.value })}
                    />
                    <Input
                      placeholder="Ethnicity"
                      defaultValue={client?.ethnicity}
                      onChange={(e) => setClient({ ...client, ethnicity: e.target.value })}
                    />
                    <Input
                      placeholder="Race"
                      defaultValue={client?.race}
                      onChange={(e) => setClient({ ...client, race: e.target.value })}
                    />
                    <Input
                      placeholder="Medical"
                      value={client.medical ? "Yes" : "No"}  // Show "Yes" if true, "No" if false
                      onChange={(e) =>
                        setClient({
                          ...client,
                          medical: e.target.value.toLowerCase() === "yes", // Convert to boolean
                        })
                      }
                    />
                    <Input
                      placeholder="Emergency Contact Name"
                      defaultValue={client?.emergencyContactName}
                      onChange={(e) => setClient({ ...client, emergencyContactName: e.target.value })}
                    />
                    <Input
                      placeholder="Emergency Contact Phone	"
                      defaultValue={client?.emergencyContactPhoneNumber}
                      onChange={(e) => setClient({ ...client, emergencyContactPhoneNumber: e.target.value })}
                    />
                    <Input
                      placeholder="Homelessness Length	"
                      defaultValue={client?.homelessnessLength}
                      onChange={(e) => setClient({ ...client, homelessnessLength: parseInt(e.target.value) })}
                    />
                    <Input
                      placeholder="Reunified"
                      value={client?.reunified ? "Yes" : "No"}  // Show "Yes" if true, "No" if false
                      onChange={(e) =>
                        setClient({
                          ...client,
                          reunified: e.target.value.toLowerCase() === "yes", // Convert to boolean
                        })
                      }
                    />
                    <Input
                      placeholder="Successful Completion"
                      value={client?.successfulCompletion ? "Yes" : "No"}  // Show "Yes" if true, "No" if false
                      onChange={(e) =>
                        setClient({
                          ...client,
                          successfulCompletion: e.target.value.toLowerCase() === "yes", // Convert to boolean
                        })
                      }
                    />
                    <Input
                      placeholder="Pregnant Upon Entry"
                      value={client?.pregnantUponEntry ? "Yes" : "No"}  // Show "Yes" if true, "No" if false
                      onChange={(e) =>
                        setClient({
                          ...client,
                          pregnantUponEntry: e.target.value.toLowerCase() === "yes", // Convert to boolean
                        })
                      }
                    />
                    <Input
                      placeholder="Disabled Children"
                      value={client?.disabledChildren ? "Yes" : "No"}  // Show "Yes" if true, "No" if false
                      onChange={(e) =>
                        setClient({
                          ...client,
                          disabledChildren: e.target.value.toLowerCase() === "yes", // Convert to boolean
                        })
                      }
                    />
                    <Input
                      placeholder="Attending School Upon Entry"
                      value={client?.attendingSchoolUponEntry ? "Yes" : "No"}  // Show "Yes" if true, "No" if false
                      onChange={(e) =>
                        setClient({
                          ...client,
                          attendingSchoolUponEntry: e.target.value.toLowerCase() === "yes", // Convert to boolean
                        })
                      }
                    />
                    <Input
                      placeholder="Attending School Upon Exit	"
                      value={client?.attendingSchoolUponExit ? "Yes" : "No"}  // Show "Yes" if true, "No" if false
                      onChange={(e) =>
                        setClient({
                          ...client,
                          attendingSchoolUponExit: e.target.value.toLowerCase() === "yes", // Convert to boolean
                        })
                      }
                    />
                    <Input
                      placeholder="Saving Account"
                      defaultValue={client?.savingsAmount}
                      onChange={(e) => setClient({ ...client, savingsAmount: e.target.value })}
                    />
                    <Input
                      placeholder="Specific Destination"
                      defaultValue={client?.specificDestination}
                      onChange={(e) => setClient({ ...client, specificDestination: e.target.value })}
                    />
                    <Input
                      placeholder="Estimated Exit Date"
                      defaultValue={client?.estimatedExitdate}
                      onChange={(e) => setClient({ ...client, estimatedExitdate: e.target.value })}
                    />
                    <Input
                      placeholder="Exit Date"
                      defaultValue={client?.exitDate}
                      onChange={(e) => setClient({ ...client, exitDate: e.target.value })}
                    />
                    <Input
                      placeholder="Unit ID"
                      defaultValue={client?.unitId}
                      onChange={(e) => setClient({ ...client, unitId: parseInt(e.target.value) })}
                    />
                    <Input
                      placeholder="Prior Living	"
                      defaultValue={client?.priorLiving}
                      onChange={(e) => setClient({ ...client, priorLiving: e.target.value })}
                    />
                    <Input
                      placeholder="Prior Living City"
                      defaultValue={client?.priorLivingCity}
                      onChange={(e) => setClient({ ...client, priorLivingCity: e.target.value })}
                    />
                    <Input
                      placeholder="Shelter in Last Five Years"
                      value={client?.shelterInLastFiveYears ? "Yes" : "No"}  // Show "Yes" if true, "No" if false
                      onChange={(e) =>
                        setClient({
                          ...client,
                          shelterInLastFiveYears: e.target.value.toLowerCase() === "yes", // Convert to boolean
                        })
                      }
                    />
                    <Input
                      placeholder="Specific Reason for Leaving"
                      defaultValue={client?.specificReasonForLeaving}
                      onChange={(e) => setClient({ ...client, specificReasonForLeaving: e.target.value })}
                    />
                    <Input
                      placeholder="Reason for Leaving"
                      defaultValue={client?.reasonForLeaving}
                      onChange={(e) => setClient({ ...client, reasonForLeaving: e.target.value })}
                    />
                    {/* Add more fields as needed for editing */}
                    <Button colorScheme="green" onClick={handleSaveChanges}>
                      Save Changes
                    </Button>
                  
                  </Stack>
                </Box>
          )}
        </Box>
      </Box>
    </div>
    
  );
};
