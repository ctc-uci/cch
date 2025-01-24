import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input, Stack, Button, ButtonGroup } from "@chakra-ui/react";

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
}

interface Children {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: number;
}

export const ViewPage = () => {
  const { backend } = useBackendContext();
  const [client, setClient] = useState<Client>();
  const [children, setChildren] = useState<Children[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Toggles visibility
  const [isEditing, setIsEditing] = useState(false);

  //fetches the database for children
  const fetchChildren = async () => {
    try {
      const response = await backend.get('/children/children/2');
      setChildren(response.data); // Adjust this if the response structure is different
    } catch (err) {
      setError(err.message);
    }
  };

  //fetches the database for clients
  const fetchClient = async () => {
    try {
      const response = await backend.get('/clients'); // Replace `/client/1` with the correct endpoint
      setClient(response.data[0]); // Adjust this if the response structure is different
      console.log(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  //fetches info from both data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchChildren(), fetchClient()]); // Fetch both routes simultaneously
      setLoading(false);
    };
    fetchData();
  }, []); // Fetch data once when the component mounts

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  const toggleEditForm = () => {
    setIsEditing(!isEditing); // Toggle the editing state
  };

  //TODO: WORK ON THIS
  // Function to handle saving changes (dummy example for now)
  const handleSaveChanges = () => {
      setIsEditing(false); // Hide the form after saving
  };

  //Table for Children Info
  return (
    <Box>
      <Box>
        <h2>Children Information</h2>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>DOB</Th>
              <Th>Age</Th>
              <Th>Custody</Th>
              <Th>School</Th>
              <Th>Grade</Th>
              <Th>Comments</Th>
            </Tr>
          </Thead>
          <Tbody>
            {children.map((item) => (
              <Tr key={item.id}>
                <Td>{`${item.firstName} ${item.lastName}`}</Td>
                <Td>{item.dateOfBirth}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Box mb={6}>
        {!isEditing?(
          <h2>Client Information</h2>
        ) : <p></p>
        }
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
              <Td>{client.medical ? 'Yes' : 'No'}</Td>
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
              <Td>{client.reunified ? 'Yes' : 'No'}</Td>
            </Tr>
            <Tr>
              <Td>Successful Completion</Td>
              <Td>{client.successfulCompletion ? 'Yes' : 'No'}</Td>
            </Tr>
            <Tr>
              <Td>Pregnant Upon Entry</Td>
              <Td>{client.pregnantUponEntry ? 'Yes' : 'No'}</Td>
            </Tr>
            <Tr>
              <Td>Disabled Children</Td>
              <Td>{client.disabledChildren ? 'Yes' : 'No'}</Td>
            </Tr>
            <Tr>
              <Td>Attending School Upon Entry</Td>
              <Td>{client.attendingSchoolUponEntry ? 'Yes' : 'No'}</Td>
            </Tr>
            <Tr>
              <Td>Attending School Upon Exit</Td>
              <Td>{client.attendingSchoolUponExit ? 'Yes' : 'No'}</Td>
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
              <Td>{client.shelterInLastFiveYears ? 'Yes' : 'No'}</Td>
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

        <Button colorScheme="blue" onClick={toggleEditForm}>
          {isEditing ? 'Cancel' : 'Edit Client Information'}
        </Button>

        {/* Conditionally render the edit form */}
        {isEditing && (
              <Box mt={4}>
                <h3>Edit Client Information</h3>
                <Stack spacing={3}>
                  <Input 
                    placeholder="First Name"
                    defaultValue={client.firstName}
                    onChange={(e) => setClient({ ...client, firstName: e.target.value })}
                  />
                  <Input 
                    placeholder="Last Name"
                    defaultValue={client.lastName}
                    onChange={(e) => setClient({ ...client, lastName: e.target.value })}
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
  );
};