import { useEffect, useState } from "react";

import { Box, Textarea } from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import toSnakeCase from "../../utils/snakeCase";

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

interface ClientProps {
  clientId: number;
}

function Comments({ clientId }: ClientProps) {
  const { backend } = useBackendContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client>(emptyClient);

  // Fetch client data by id
  const fetchClient = async (id: number) => {
    try {
      const response = await backend.get(`/clients/${id}`);
      setClient(response.data[0]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (clientId) {
        await fetchClient(clientId);
      }
      setLoading(false);
    };
    fetchData();
  }, [clientId]);

  const handleSaveChanges = async () => {
    try {
      if (!client) {
        return;
      }
      const clientData = toSnakeCase(client);
      await backend.put(`/clients/${client.id}`, clientData);
    } catch (error: any) {
      console.error("Error updating client information:", error.message);
    }
  };

  return (
    <Box
      mb="4vh"
      p={2}
      overflow="hidden"
    >
      <Textarea
        width="100%"
        h="40vh"
        resize="vertical" // Allows users to adjust the height vertically
        fontSize="md"
        value={client.comments}
        placeholder="Type Here"
        onChange={(e) => setClient({ ...client, comments: e.target.value })}
      />
    </Box>
  );
}

export default Comments;
