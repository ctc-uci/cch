// InitialInterviewModal.tsx
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
import { InitialInterview } from "../types/InitialInterview";

interface InitialInterviewModalProps {
  form: { id: number; type: string; title?: string };
  isOpen: boolean;
  onClose: () => void;
}

export default function InitialInterviewModal({
  form,
  isOpen,
  onClose,
}: InitialInterviewModalProps) {
  const { backend } = useBackendContext();
  const toast = useToast();

  const [data, setData] = useState<InitialInterview | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState<Partial<InitialInterview>>({});

  const cellHeight = "40px";

  // which fields get a <Select>
  const selectFields: Record<keyof InitialInterview, readonly string[] | undefined> = {
    id: undefined,
    applicantType: undefined,
    name: undefined,
    age: undefined,
    date: undefined,
    phoneNumber: undefined,
    maritalStatus: ["single", "married", "divorced", "widowed"],
    dateOfBirth: undefined,
    email: undefined,
    ssnLastFour: undefined,
    ethnicity: ["Non-Hispanic", "Hispanic", "Refused"],
    veteran: ["true", "false"],
    disabled: ["true", "false"],
    currentAddress: undefined,
    lastPermAddress: undefined,
    reasonForLeavingPermAddress: undefined,
    whereResideLastNight: undefined,
    currentlyHomeless: ["true", "false"],
    eventLeadingToHomelessness: undefined,
    howLongExperiencingHomelessness: undefined,
    prevAppliedToCch: ["true", "false"],
    whenPrevAppliedToCch: undefined,
    prevInCch: ["true", "false"],
    whenPrevInCch: undefined,
    childName: undefined,
    childDob: undefined,
    custodyOfChild: ["true", "false"],
    fatherName: undefined,
    nameSchoolChildrenAttend: undefined,
    cityOfSchool: undefined,
    howHearAboutCch: undefined,
    programsBeenInBefore: undefined,
    monthlyIncome: undefined,
    sourcesOfIncome: undefined,
    monthlyBills: undefined,
    currentlyEmployed: ["true", "false"],
    lastEmployer: undefined,
    lastEmployedDate: undefined,
    educationHistory: undefined,
    transportation: undefined,
    legalResident: ["true", "false"],
    medical: ["true", "false"],
    medicalCity: undefined,
    medicalInsurance: undefined,
    medications: undefined,
    domesticViolenceHistory: undefined,
    socialWorker: undefined,
    socialWorkerTelephone: undefined,
    socialWorkerOfficeLocation: undefined,
    lengthOfSobriety: undefined,
    lastDrugUse: undefined,
    lastAlcoholUse: undefined,
    timeUsingDrugsAlcohol: undefined,
    beenConvicted: ["true", "false"],
    convictedReasonAndTime: undefined,
    presentWarrantExist: ["true", "false"],
    warrantCounty: undefined,
    probationParoleOfficer: undefined,
    probationParoleOfficerTelephone: undefined,
    personalReferences: undefined,
    personalReferenceTelephone: undefined,
    futurePlansGoals: undefined,
    lastPermanentResidenceHouseholdComposition: undefined,
    whyNoLongerAtLastResidence: undefined,
    whatCouldPreventHomeless: undefined,
  };

  // Unsure if we have this in utils sorry
  const toSnake = (s: string) =>
    s.replace(/([A-Z])/g, "_$1").toLowerCase();

  useEffect(() => {
    if (!isOpen || !form.id) return;
    setLoading(true);
    backend
      .get<InitialInterview[]>(`/initialInterview/id/${form.id}`)
      .then((res) => setData(res.data[0]))
      .catch((err) =>
        toast({
          title: "Error loading interview",
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

  const numericFields: Array<keyof InitialInterview> = [
    "id",
    "age",
    "ssnLastFour",
    "monthlyIncome",
  ];

  const dateFields = [
    "date",
    "dateOfBirth",
    "childDob",
    "lastEmployedDate",
  ] as const;

  const handleFieldChange = <K extends keyof InitialInterview>(
    field: K,
    value: string
  ) => {
    let cast: any = value;
    if (numericFields.includes(field)) {
      cast = Number(value);
    } else if (dateFields.includes(field as any)) {
      cast = value;
    } else if (selectFields[field]?.includes("true")) {
      cast = value === "true";
    }
    setEdits((e) => ({ ...e, [field]: cast }));
  };

  const handleSave = async () => {
    if (!data) return;
    const updated = { ...data, ...edits };
    const payload: Record<string, any> = {};
    for (const key in updated) {
      payload[toSnake(key)] = (updated as any)[key];
    }

    try {
      await backend.put(`/initialInterview/${data.id}`, payload);
      setData(updated as InitialInterview);
      setEdits({});
      setIsEditing(false);
      toast({ title: "Form saved", status: "success", duration: 2000, isClosable: true });
    } catch (err: any) {
      toast({ title: "Error saving", description: err.message, status: "error", duration: 3000 });
    }
  };

  if (!isOpen) return null;
  if (loading || !data) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalContent>
          <ModalHeader>Loading…</ModalHeader>
          <ModalBody><Spinner /></ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const formattedDate = new Date(data.date).toLocaleDateString("en-US");
  const modalTitle = "Initial Interview – ";
  const modalDesc = `${form.title || data.name} (${formattedDate})`;

  const labelize = (k: string) =>
    k.replace(/([A-Z])/g, " $1").replace(/^./, (m) => m.toUpperCase()).trim();

  const rows = (Object.keys(selectFields) as (keyof InitialInterview)[]).map((field) => ({
    field,
    label: labelize(field),
  }));

  const renderField = (field: keyof InitialInterview) => {
    const original = data[field] as any;
    const edited = edits[field] as any;

    if (!isEditing) {
      if (dateFields.includes(field as any)) {
        return new Date(original).toLocaleDateString("en-US");
      }
      if (selectFields[field]?.includes("true")) {
        return original ? "Yes" : "No";
      }
      return String(original ?? "");
    }

    if (field === "id") {
      return (
        <Box
          w="100%"
          h={cellHeight}
          bg="#EDF2F7"
          display="flex"
          alignItems="center"
          p={3}
        >
          {original}
        </Box>
      );
    }

    if (selectFields[field]) {
      return (
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
            value={String(edited ?? original)}
            onChange={(e) => handleFieldChange(field, e.target.value)}
          >
            {selectFields[field]!.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "true" ? "Yes" : labelize(opt)}
              </option>
            ))}
          </Select>
        </Box>
      );
    }

    return (
      <Input
        variant="unstyled"
        size="sm"
        w="100%"
        h={cellHeight}
        px={3}
        m={0}
        border="1px solid"
        borderColor="#3182CE"
        type={dateFields.includes(field as any) ? "date" : "text"}
        value={edited !== undefined ? edited : original}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        onKeyDown={dateFields.includes(field as any) ? (e) => e.preventDefault() : undefined}
      />
    );
  };

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
          <Box
            mx="2.5%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={6}
          >
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
                  <PrintForm formType="Initial Interview" formId={form.id} />
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
