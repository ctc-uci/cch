import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
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
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import PrintForm from "../printForm/PrintForm";
import { exitSurvey } from "../../types/exitSurvey";

interface ExitSurveyModalProps {
  form: { id: number; type: string; title?: string };
  isOpen: boolean;
  onClose: () => void;
}

export default function ExitSurveyModal({ form, isOpen, onClose }: ExitSurveyModalProps) {
  const { backend } = useBackendContext();
  const toast = useToast();
  const [surveyData, setSurveyData] = useState<exitSurvey | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState<Partial<exitSurvey>>({});
  const cellHeight = "40px";

  useEffect(() => {
    if (isOpen && form?.id) {
      (async () => {
        try {
          setLoading(true);
          const response = await backend.get(`/exitSurvey/${form.id}`);
          const row = response.data.data[0];
          setSurveyData(row);
        } catch (err: any) {
          toast({
            title: "Error loading form",
            description: err.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isOpen, form, backend, toast]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEdits({});
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!surveyData) return;
    try {
      const updated = { ...surveyData, ...edits };
      await backend.put(`/exitSurvey/${surveyData.id}`, updated);
      setSurveyData(updated);
      setEdits({});
      setIsEditing(false);
      toast({
        title: "Form saved successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: "Error saving form",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFieldChange = (field: keyof exitSurvey, value: string) => {
    setEdits({ ...edits, [field]: value });
  };

  const renderField = (
    fieldName: keyof exitSurvey,
    displayValue: any,
    options?: { isBoolean?: boolean; isNumeric?: boolean }
  ) => {
    if (fieldName === "id" || fieldName === "cm_id") {
      return (
        <Box w="100%" h={cellHeight} display="flex" alignItems="center" p={0}>
          {displayValue}
        </Box>
      );
    }
    if (fieldName === "date" && isEditing) {
      return (
        <Box w="100%" h={cellHeight} bg="#EDF2F7" display="flex" alignItems="center" p={0}>
          <Input
            type="date"
            variant="unstyled"
            size="sm"
            w="100%"
            p={3}
            m={0}
            border="1px solid"
            borderColor="#3182CE"
            value={edits.date !== undefined ? edits.date : displayValue}
            onChange={(e) => handleFieldChange("date", e.target.value)}
            onKeyDown={(e) => e.preventDefault()}
          />
        </Box>
      );
    }
    if (isEditing) {
      return (
        <Box w="100%" h={cellHeight} bg="#EDF2F7" display="flex" alignItems="center" p={0}>
          <Input
            variant="unstyled"
            size="sm"
            w="100%"
            p={3}
            m={0}
            border="1px solid"
            borderColor="#3182CE"
            value={edits[fieldName] !== undefined ? edits[fieldName] : displayValue}
            onChange={(e) => {
              let newValue = e.target.value;
              if (options?.isBoolean) {
                newValue = newValue.toLowerCase() === "yes";
                setEdits({ ...edits, [fieldName]: newValue });
                return;
              }
              if (options?.isNumeric) {
                if (newValue !== "" && !/^\d+$/.test(newValue)) {
                  return;
                }
                setEdits({ ...edits, [fieldName]: newValue });
                return;
              }
              setEdits({ ...edits, [fieldName]: newValue });
            }}
          />
        </Box>
      );
    }
    return (
      <Box w="100%" h={cellHeight} display="flex" alignItems="center" p={0}>
        {options?.isBoolean ? (displayValue ? "Yes" : "No") : displayValue}
      </Box>
    );
  };

  if (!isOpen) return null;
  if (loading || !surveyData) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalContent>
          <ModalHeader fontSize="md">Loading...</ModalHeader>
          <ModalBody>
            <Spinner />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const formattedDate = new Date(surveyData.date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const modalTitle = "Form Preview - ";
  const modalDescription = `${form.title || surveyData.name || "Exit Survey"} (${formattedDate})`;

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
              {modalDescription}
            </Box>
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" mt="2rem" pt={4}>
          <Box mx="2.5%" display="flex" justifyContent="space-between" alignItems="center" mb={6}>
            {!isEditing ? (
              <>
                <Button variant="outline" colorScheme="blue" onClick={handleEditToggle}>
                  Edit Form
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
                  <PrintForm formType="Exit Survey" formId={form.id} />
                </Box>
              </>
            ) : (
              <Box display="flex" w="100%" justifyContent="flex-end">
                <Button colorScheme="blue" mr={2} onClick={handleEditToggle}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleSave} isDisabled={Object.keys(edits).length === 0}>
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
                  <Th fontSize="md" color="black">Question</Th>
                  <Th fontSize="md" color="black">Answer</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td p={4}>ID</Td>
                  <Td p={4} bgColor="white">{renderField("id", surveyData.id)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>Case Manager ID</Td>
                  <Td p={4} bgColor="white">{renderField("cm_id", surveyData.cm_id, { isNumeric: true })}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>Date</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>
                    {isEditing ? renderField("date", surveyData.date) : formattedDate}
                  </Td>
                </Tr>
                <Tr>
                  <Td p={4}>Name</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("name", surveyData.name)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>Client ID</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("client_id", surveyData.client_id, { isNumeric: true })}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>Site</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("site", surveyData.site, { isNumeric: true })}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>Program Date Completion</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("program_date_completion", surveyData.program_date_completion)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>CCH Rating</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("cch_rating", surveyData.cch_rating)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>What did you like most?</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("cch_like_most", surveyData.cch_like_most)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>CCH Could be Improved</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("cch_could_be_improved", surveyData.cch_could_be_improved)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>Life Skills Rating</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("life_skills_rating", surveyData.life_skills_rating)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>Life Skills Helpful Topics</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("life_skills_helpful_topics", surveyData.life_skills_helpful_topics)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>Life Skills Offer Topics in the Future</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("life_skills_offer_topics_in_the_future", surveyData.life_skills_offer_topics_in_the_future)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>CM Rating</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("cm_rating", surveyData.cm_rating)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>CM Change About</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("cm_change_about", surveyData.cm_change_about)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>CM Most Beneficial</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("cm_most_beneficial", surveyData.cm_most_beneficial)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>Experience Takeaway</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("experience_takeaway", surveyData.experience_takeaway)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>Experience Accomplished</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("experience_accomplished", surveyData.experience_accomplished)}</Td>
                </Tr>
                <Tr>
                  <Td p={4}>Experience Extra Notes</Td>
                  <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>{renderField("experience_extra_notes", surveyData.experience_extra_notes)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
