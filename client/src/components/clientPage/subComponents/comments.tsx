import { useEffect, useState, useRef } from "react";

import { Box, Textarea, useToast } from "@chakra-ui/react";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import toSnakeCase from "../../../utils/snakeCase";

type Nullable<T> = T | null;

interface Client {
  age: Nullable<number>;
  attendingSchoolUponEntry: Nullable<boolean>;
  attendingSchoolUponExit: Nullable<boolean>;
  bedNights: Nullable<number>;
  bedNightsChildren: Nullable<number>;
  chronicallyHomeless: Nullable<boolean>;
  cityOfLastPermanentResidence: Nullable<string>;
  createdBy: number;
  dateOfBirth: Nullable<string>;
  destinationcity: Nullable<string>;
  disabledChildren: Nullable<boolean>;
  email: Nullable<string>;
  emergencyContactName: Nullable<string>;
  emergencyContactPhoneNumber: Nullable<string>;
  employmentGained: Nullable<boolean>;
  entranceDate: Nullable<string>;
  estimatedExitDate: Nullable<string>;
  ethnicity: Nullable<string>;
  exitDate: Nullable<string>;
  firstName: string;
  grant: Nullable<string>;
  homelessnessLength: Nullable<number>;
  id: number;
  lastName: string;
  medical: Nullable<boolean>;
  phoneNumber: Nullable<string>;
  pregnantUponEntry: Nullable<boolean>;
  priorLiving: Nullable<string>;
  priorLivingCity: Nullable<string>;
  race: Nullable<string>;
  reasonForLeaving: Nullable<string>;
  reunified: Nullable<boolean>;
  savingsAmount: Nullable<string>;
  shelterInLastFiveYears: Nullable<boolean>;
  specificDestination: Nullable<string>;
  specificReasonForLeaving: Nullable<string>;
  status: string;
  successfulCompletion: Nullable<boolean>;
  unitName: string;
  comments: Nullable<string>;
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

interface ClientProps {
  clientId: number;
}

function Comments({ clientId }: ClientProps) {
  const { backend } = useBackendContext();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<Client>(emptyClient);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchClient = async (id: number) => {
      try {
        const response = await backend.get(`/clients/${id}`);
        setClient(response.data[0]);
      } catch (err: unknown) {
        const error = err as { message?: string };
        console.error("Error fetching client:", error.message);
        toast({
          title: "Error loading comments",
          description: error.message || "Failed to load client comments.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const fetchData = async () => {
      setLoading(true);
      if (clientId) {
        await fetchClient(clientId);
      }
      setLoading(false);
    };
    fetchData();
  }, [clientId, backend, toast]);

  const handleSaveChanges = async () => {
    if (!client || !client.id) {
      return;
    }
    
    try {
      setIsSaving(true);
      const clientData = toSnakeCase(client);
      await backend.put(`/clients/${client.id}`, clientData);
      
      toast({
        title: "Comments saved",
        description: "Your comments have been saved successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error("Error updating client information:", error.message);
      toast({
        title: "Error saving comments",
        description: error.message || "Failed to save comments. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClient({ ...client, comments: e.target.value });
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Auto-save after 2 seconds of no typing (debounced)
    saveTimeoutRef.current = setTimeout(() => {
      handleSaveChanges();
    }, 2000);
  };

  const handleBlur = () => {
    // Clear any pending timeout and save immediately
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    handleSaveChanges();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box
      mb="4vh"
      p={2}
      overflow="hidden"
    >
      <Textarea
        width="100%"
        h="40vh"
        resize="vertical"
        fontSize="md"
        value={client.comments ?? ""}
        placeholder="Type Here"
        onChange={handleChange}
        onBlur={handleBlur}
        isDisabled={loading || isSaving}
        opacity={isSaving ? 0.7 : 1}
      />
      {isSaving && (
        <Box mt={2} fontSize="sm" color="gray.500">
          Saving...
        </Box>
      )}
    </Box>
  );
}

export default Comments;
