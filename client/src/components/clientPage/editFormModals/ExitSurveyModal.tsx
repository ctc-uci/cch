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
import PrintForm from "../../../printForm/PrintForm";
import { exitSurvey } from "../types/ExitSurvey";

interface ExitSurveyModalProps {
  form: { id: number; type: string; title?: string };
  isOpen: boolean;
  onClose: () => void;
}

export default function ExitSurveyModal({
  form,
  isOpen,
  onClose,
}: ExitSurveyModalProps) {
  const { backend } = useBackendContext();
  const toast = useToast();

  const [surveyData, setSurveyData] = useState<exitSurvey | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState<Partial<exitSurvey>>({});

  const cellHeight = "40px";

  const cchRatingOptions: exitSurvey["cch_rating"][] = [
    "Excellent",
    "Good",
    "Fair",
    "Unsatisfactory",
  ];
  const lifeSkillsOptions: exitSurvey["life_skills_rating"][] = [
    "very helpful",
    "helpful",
    "not very helpful",
    "not helpful at all",
  ];
  const cmRatingOptions: exitSurvey["cm_rating"][] = lifeSkillsOptions;

  const selectFields: Record<
    keyof exitSurvey,
    readonly string[] | undefined
  > = {
    cch_rating: cchRatingOptions,
    life_skills_rating: lifeSkillsOptions,
    cm_rating: cmRatingOptions,
    id: undefined,
    cm_id: undefined,
    name: undefined,
    client_id: undefined,
    site: undefined,
    date: undefined,
    program_date_completion: undefined,
    cch_like_most: undefined,
    cch_could_be_improved: undefined,
    life_skills_helpful_topics: undefined,
    life_skills_offer_topics_in_the_future: undefined,
    cm_change_about: undefined,
    cm_most_beneficial: undefined,
    experience_takeaway: undefined,
    experience_accomplished: undefined,
    experience_extra_notes: undefined,
  };

  useEffect(() => {
    if (!isOpen || !form.id) return;
    setLoading(true);
    backend
      .get(`/exitSurvey/${form.id}`)
      .then((res) => setSurveyData(res.data.data[0]))
      .catch((err: any) =>
        toast({
          title: "Error loading form",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      )
      .finally(() => setLoading(false));

  }, [isOpen, form.id, backend, toast]);
  console.log(surveyData);
  const handleEditToggle = () => {
    if (isEditing) setEdits({});
    setIsEditing(!isEditing);
  };

  const handleFieldChange = <K extends keyof exitSurvey>(
    field: K,
    value: exitSurvey[K] | string
  ) => {
    if (["id", "cm_id", "client_id", "site"].includes(field)) {
      setEdits((e) => ({ ...e, [field]: Number(value) as exitSurvey[K] }));
    } else {
      setEdits((e) => ({ ...e, [field]: value as exitSurvey[K] }));
    }
  };

  // routes and the columns do not follow the same naming convention lol
  const toCamel = (s: string) =>
    s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

  const handleSave = async () => {
    if (!surveyData) return;
    const updated: exitSurvey = { ...surveyData, ...edits };

    const payload: Record<string, any> = {};
    for (const key in updated) {
      payload[toCamel(key)] = (updated as any)[key];
    }

    try {
      await backend.put(`/exitSurvey/${surveyData.id}`, payload);
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

  if (!isOpen) return null;
  if (loading || !surveyData) {
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

  const formattedDate = new Date(surveyData.date).toLocaleDateString("en-US");
  const modalTitle = "Form Preview – ";
  const modalDesc = `${form.title || surveyData.name} (${formattedDate})`;

  const renderField = (field: keyof ExitSurvey) => {
    const original = surveyData[field];
    const edited = edits[field];

    if (!isEditing) {
      if (field === "date" || field === "program_date_completion") {
        return new Date(original as string).toLocaleDateString("en-US");
      }
      return String(original);
    }

    // assuming these fields should be locked
    if (
      field === "id" ||
      field === "cm_id" ||
      field === "client_id" ||
      field === "site"
    ) {
      return (
        <Box
          w="100%"
          h={cellHeight}
          bg="#EDF2F7"
          display="flex"
          alignItems="center"
          p={3}
        >
          {String(original)}

          {/*
          // idk if you need to edit these fields or if they should even be allowed to.
          <Input
            variant="unstyled"
            size="sm"
            w="100%"
            h={cellHeight}
            px={3}
            m={0}
            border="1px solid"
            borderColor="#3182CE"
            type="number"
            value={String(edited ?? original)}
            onChange={(e) =>
              handleFieldChange(field, e.target.value)
            }
          />
          */}
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
      >
        {selectFields[field] ? (
          <Box
            w="100%"
            h={cellHeight}
            bg="#EDF2F7"
            border="1px solid"
            borderColor="#3182CE"
            borderRadius="0"
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
              value={(edited ?? original) as string}
              onChange={(e) => handleFieldChange(field, e.target.value)}
            >
              {selectFields[field]!.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
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
            type={
              field === "date" || field === "program_date_completion"
                ? "date"
                : "text"
            }
            value={
              edited !== undefined
                ? String(edited)
                : field === "date" || field === "program_date_completion"
                ? (original as string)
                : String(original)
            }
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onKeyDown={
              field === "date" ? (e) => e.preventDefault() : undefined
            }
          />
        )}
      </Box>
    );
  };


  const rows: Array<{ field: keyof exitSurvey; label: string }> = [
    { field: "id", label: "ID" },
    { field: "cm_id", label: "Case Manager ID" },
    { field: "date", label: "Date" },
    { field: "name", label: "Name" },
    { field: "client_id", label: "Client ID" },
    { field: "site", label: "Site" },
    { field: "program_date_completion", label: "Program Date Completion" },
    { field: "cch_rating", label: "CCH Rating" },
    { field: "cch_like_most", label: "What did you like most?" },
    { field: "cch_could_be_improved", label: "CCH Could Be Improved" },
    { field: "life_skills_rating", label: "Life Skills Rating" },
    { field: "life_skills_helpful_topics", label: "Life Skills Helpful Topics" },
    {
      field: "life_skills_offer_topics_in_the_future",
      label: "Life Skills Offer Topics in the Future",
    },
    { field: "cm_rating", label: "CM Rating" },
    { field: "cm_change_about", label: "CM Change About" },
    { field: "cm_most_beneficial", label: "CM Most Beneficial" },
    { field: "experience_takeaway", label: "Experience Takeaway" },
    { field: "experience_accomplished", label: "Experience Accomplished" },
    { field: "experience_extra_notes", label: "Experience Extra Notes" },
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
