import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Select,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import PrintForm from "../../printForm/PrintForm";
import { SuccessStory } from "../types/SuccessStory";

interface SuccessStoryModalProps {
  form: { id: number; type: string; title?: string };
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessStoryModal({
  form,
  isOpen,
  onClose,
}: SuccessStoryModalProps) {
  const { backend } = useBackendContext();
  const toast = useToast();

  const [storyData, setStoryData] = useState<SuccessStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState<Partial<SuccessStory>>({});

  const cellHeight = "40px";

  const selectFields: Record<keyof SuccessStory, readonly string[] | undefined> = {
    id: undefined,
    date: undefined,
    clientId: undefined,
    name: undefined,
    cmId: undefined,
    previousSituation: undefined,
    cchImpact: undefined,
    whereNow: undefined,
    tellDonors: undefined,
    quote: undefined,
    consent: ["true", "false"],
  };

  const toSnake = (s: string): string => {
    return s.replace(/([A-Z])/g, "_$1").toLowerCase();
  }


  useEffect(() => {
    if (!isOpen || !form.id) return;
    setLoading(true);
    backend
      .get<SuccessStory[]>(`/successStory/${form.id}`)
      .then((res) => setStoryData(res.data[0]))
      .catch((err: any) =>
        toast({
          title: "Error loading story",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      )
      .finally(() => setLoading(false));
  }, [isOpen, form.id, backend, toast]);

  const handleEditToggle = () => {
    if (isEditing) setEdits({});
    setIsEditing(!isEditing);
  };

  const handleFieldChange = <K extends keyof SuccessStory>(
    field: K,
    value: SuccessStory[K] | string
  ) => {
    if (field === "id" || field === "cm_id" || field === "client_id") {
      setEdits((e) => ({ ...e, [field]: Number(value) as SuccessStory[K] }));
    } else if (field === "consent") {
      setEdits((e) => ({ ...e, consent: (value === "true") as SuccessStory[K] }));
    } else {
      setEdits((e) => ({ ...e, [field]: value as SuccessStory[K] }));
    }
  };

  const handleSave = async () => {
    if (!storyData) return;
    const updated: SuccessStory = { ...storyData, ...edits };

    const payload: Record<string, any> = {};
    for (const key in updated) {
      payload[toSnake(key)] = (updated as any)[key];
    }


    try {
      await backend.put(`/successStory/${storyData.id}`, payload);
      setStoryData(updated);
      setEdits({});
      setIsEditing(false);
      toast({
        title: "Story saved successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: "Error saving story",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!isOpen) return null;
  if (loading || !storyData) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalContent>
          <ModalHeader>Loading…</ModalHeader>
          <ModalBody>
            <Spinner />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const formattedDate = new Date(storyData.date).toLocaleDateString("en-US");
  const modalTitle = "Success Story – ";
  const modalDesc = `${form.title || storyData.name} (${formattedDate})`;

  const renderField = (field: keyof SuccessStory) => {
    const original = storyData[field] as any;
    const edited = edits[field] as any;

    if (!isEditing) {
      if (field === "date") {
        return new Date(original).toLocaleDateString("en-US");
      }
      if (field === "consent") {
        return original ? "Yes" : "No";
      }
      return String(original);
    }

    if (field === "id" || field === "cmId" || field === "clientId") {
      return (
        <Box w="100%" h={cellHeight} bg="#EDF2F7" display="flex" alignItems="center" p={3}>
          {String(original)}
        </Box>
      );
    }

    return (
      <Box w="100%" h={cellHeight} bg="#EDF2F7" display="flex" alignItems="center" p={0}>
        {selectFields[field] ? (
          <Box
            w="100%"
            h={cellHeight}
            bg="#EDF2F7"
            border="1px solid"
            borderColor="#3182CE"
            px={3}
            display="flex"
            alignItems="center"
          >
            <Select
              variant="unstyled"
              size="sm"
              w="100%"
              h="100%"
              bg="transparent"
              lineHeight={cellHeight}
              _focus={{ boxShadow: "none" }}
              sx={{ appearance: "none" }}
              value={edited !== undefined ? String(edited) : String(original)}
              onChange={(e) => handleFieldChange(field, e.target.value)}
            >
              {selectFields[field]!.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "true" ? "Yes" : "No"}
                </option>
              ))}
            </Select>
          </Box>
        ) : (
          <Input
            variant="unstyled"
            size="sm"
            w="100%"
            h={cellHeight}
            px={3}
            m={0}
            border="1px solid"
            borderColor="#3182CE"
            type={field === "date" ? "date" : "text"}
            value={
              edited !== undefined
                ? String(edited)
                : field === "date"
                ? (original as string)
                : String(original)
            }
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onKeyDown={field === "date" ? (e) => e.preventDefault() : undefined}
          />
        )}
      </Box>
    );
  };

  const rows: Array<{ field: keyof SuccessStory; label: string }> = [
    { field: "id", label: "ID" },
    { field: "date", label: "Date" },
    { field: "name", label: "Name" },
    { field: "clientId", label: "Client ID" },
    { field: "cmId", label: "Case Manager ID" },
    { field: "previousSituation", label: "Previous Situation" },
    { field: "cchImpact", label: "CCH Impact" },
    { field: "whereNow", label: "Where Now" },
    { field: "tellDonors", label: "Message to Donors" },
    { field: "quote", label: "Quote" },
    { field: "consent", label: "Consent" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalContent
        maxW="65%"
        ml="auto"
        mr={0}
        borderRadius={0}
        h="100vh"
        position="fixed"
        right="0"
        boxShadow="2xl"
        bg="white"
      >
        <ModalHeader fontSize="sm" mx="2.5%" mt="2.5%" pb={2} borderColor="gray.200">
          <Box>
            <Box as="span" color="black" fontWeight="bold">
              {modalTitle}
            </Box>
            <Box as="span" color="#4A5568">
              {modalDesc}
            </Box>
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" mt="2rem" pt={4}>
          <Box mx="2.5%" display="flex" justifyContent="space-between" alignItems="center" mb={6}>
            {!isEditing ? (
              <>
                <Button variant="outline" colorScheme="blue" onClick={handleEditToggle}>
                  Edit Story
                </Button>
                <Box
                  display="inline-block"
                  px={4}
                  py={2}
                  backgroundColor="blue.500"
                  color="white"
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ backgroundColor: "blue.600" }}
                >
                  <PrintForm formType="Success Story" formId={form.id} />
                </Box>
              </>
            ) : (
              <Box display="flex" w="100%" justifyContent="flex-end">
                <Button colorScheme="blue" mr={2} onClick={handleEditToggle}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleSave}
                  isDisabled={Object.keys(edits).length === 0}
                >
                  Save
                </Button>
              </Box>
            )}
          </Box>
          <TableContainer
            border="2px solid"
            borderColor="#E2E8F0"
            borderRadius="lg"
            overflow="hidden"
            mx="2.5%"
            w="95%"
            mt={4}
          >
            <Table variant="simple" sx={{ tableLayout: "fixed", width: "100%" }}>
              <Thead bg="gray.50">
                <Tr>
                  <Th fontSize="md" color="black">
                    Question
                  </Th>
                  <Th fontSize="md" color="black">
                    Answer
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {rows.map(({ field, label }) => (
                  <Tr key={field}>
                    <Td p={4}>{label}</Td>
                    <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>
                      {renderField(field)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
