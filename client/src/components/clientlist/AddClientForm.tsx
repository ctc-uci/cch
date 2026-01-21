import { useCallback, useEffect, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  HStack,
  Heading,
  Input,
  Select,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Radio,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { BackArrowIcon } from "../donations/addDonations/BackArrowIcon";

// Types for dynamic form questions
interface FormOption {
  value: string;
  label: string;
}

interface RatingGridConfig {
  rows: Array<{ key: string; label: string }>;
  columns: Array<{ value: string; label: string }>;
}

interface FormQuestion {
  id: number;
  fieldKey: string;
  questionText: string;
  questionType: "text" | "number" | "boolean" | "date" | "select" | "textarea" | "rating_grid" | "case_manager_select" | "site_location" | "text_block" | "header";
  options?: FormOption[] | RatingGridConfig;
  isRequired: boolean;
  isVisible: boolean;
  isCore: boolean;
  displayOrder: number;
}

interface AddClientFormProps {
  onClientAdded: () => void;
  setShowUnfinishedAlert: (e: boolean) => void;
}

export const AddClientForm = ({
  onClientAdded,
  setShowUnfinishedAlert,
}: AddClientFormProps) => {
  const {
    isOpen: isAlertOpen,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();

  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // State for dynamic form questions
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formInProgress, setFormInProgress] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const { backend } = useBackendContext();
  const toast = useToast();

  // Reference data for foreign keys
  const [units, setUnits] = useState<Array<{ id: number; name: string }>>([]);
  const [caseManagers, setCaseManagers] = useState<
    Array<{
      id: number;
      firstName?: string;
      lastName?: string;
      first_name?: string;
      last_name?: string;
    }>
  >([]);
  const [locations, setLocations] = useState<
    Array<{
      id: number;
      name: string;
    }>
  >([]);

  // Helper function to check if a field is empty
  const isFieldEmpty = (value: unknown, questionType?: string): boolean => {
    // Display-only types are never considered empty
    if (questionType === "text_block" || questionType === "header") {
      return false;
    }
    
    if (value === null || value === undefined) {
      return true;
    }
    
    if (typeof value === "string") {
      if (value.trim() === "") {
        return true;
      }
      
      // For rating grids, check if it's an empty JSON object
      if (questionType === "rating_grid") {
        try {
          const parsed = JSON.parse(value);
          return Object.keys(parsed).length === 0;
        } catch {
          return true;
        }
      }
    }
    
    return false;
  };

  // Initialize form data based on questions
  const initializeFormData = (qs: FormQuestion[]) => {
    const initial: Record<string, string> = {
      created_by: "",
      unit_id: "",
    };
    qs.forEach((q) => {
      // Display-only types don't need form data
      if (q.questionType === "text_block" || q.questionType === "header") {
        return;
      }
      if (q.questionType === "rating_grid") {
        initial[q.fieldKey] = "{}";
      } else {
        initial[q.fieldKey] = "";
      }
    });
    return initial;
  };

  const resetForm = useCallback(() => {
    setFormData(initializeFormData(questions));
    setErrors({});
  }, [questions]);

  // Load form questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        const response = await backend.get("/formQuestions");
        const qs = Array.isArray(response.data) ? response.data : [];
        setQuestions(qs);
        setFormData(initializeFormData(qs));
      } catch (err) {
        console.error("Failed to load form questions:", err);
        toast({
          title: "Error Loading Form",
          description: "Could not load form questions. Please try again.",
          status: "error",
          position: "bottom-right",
        });
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    loadQuestions();
  }, [backend, toast]);

  // Load reference data (units, case managers, and locations)
  useEffect(() => {
    const loadReferences = async () => {
      try {
        const [unitsRes, cmsRes, locationsRes] = await Promise.all([
          backend.get("/units"),
          backend.get("/caseManagers"),
          backend.get("/locations"),
        ]);
        const unitList: Array<{ id: number; name: string }> = Array.isArray(
          unitsRes.data
        )
          ? unitsRes.data
              .map((u: { id: number | string; name: string }) => ({
                id: Number(u.id),
                name: u.name,
              }))
              .filter((u) => !Number.isNaN(u.id))
          : [];
        setUnits(unitList);

        const cmList: Array<{
          id: number;
          firstName?: string;
          lastName?: string;
          first_name?: string;
          last_name?: string;
        }> = Array.isArray(cmsRes.data)
          ? cmsRes.data
              .map(
                (cm: {
                  id: number | string;
                  firstName?: string;
                  lastName?: string;
                  first_name?: string;
                  last_name?: string;
                }) => ({
                  id: Number(cm.id),
                  firstName: cm.firstName,
                  lastName: cm.lastName,
                  first_name: cm.first_name,
                  last_name: cm.last_name,
                })
              )
              .filter((cm) => !Number.isNaN(cm.id))
          : [];
        setCaseManagers(cmList);
        
        // Load locations
        const locList: Array<{
          id: number;
          name: string;
        }> = Array.isArray(locationsRes.data)
          ? locationsRes.data.map(
              (loc: {
                id: number | string;
                name: string;
              }) => ({
                id: Number(loc.id),
                name: loc.name,
              })
            ).filter((loc) => !Number.isNaN(loc.id))
          : [];
        // Get unique location names
        const uniqueLocations = Array.from(
          new Map(locList.map((loc) => [loc.name, loc])).values()
        );
        setLocations(uniqueLocations);
      } catch (_e) {
        // If we can't load references, skip pre-validation
      }
    };
    loadReferences();
  }, [backend]);

  useEffect(() => {
    if (hasSubmitted) {
      onClientAdded();
      setHasSubmitted(false);
      resetForm();
    }
  }, [hasSubmitted, onClientAdded, resetForm]);

  const handleCloseAndSave = () => {
    onClose();

    const hasAnyData = Object.values(formData).some(
      (value) => !isFieldEmpty(value)
    );

    if (hasAnyData) {
      toast({
        title: "New Client Data Saved",
        description: "Successfully saved unfinished client data.",
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const handleConfirmCancel = () => {
    onClose();
    closeAlert();
    resetForm();
    setFormInProgress(false);
    setShowUnfinishedAlert(false);
  };

  const handleFieldChange = (fieldKey: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
    setErrors((prev) => ({ ...prev, [fieldKey]: false }));
    setFormInProgress(true);
    setShowUnfinishedAlert(true);
  };

  const handleSubmit = async () => {
    // Validate required fields
    const newErrors: Record<string, boolean> = {};

    // Check unit and case manager
    if (isFieldEmpty(formData.unit_id)) {
      newErrors.unit_id = true;
    }
    if (isFieldEmpty(formData.created_by)) {
      newErrors.created_by = true;
    }

    // Check required questions
    questions.forEach((q) => {
      // Skip validation for display-only types
      if (q.questionType === "text_block" || q.questionType === "header") {
        return;
      }
      if (q.isRequired && isFieldEmpty(formData[q.fieldKey], q.questionType)) {
        newErrors[q.fieldKey] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Missing information.",
        description: "There is a missing or incorrect field.",
        status: "warning",
        position: "bottom",
        isClosable: true,
      });
      return;
    }

    setErrors({});

    try {
      // Build client data object
      const clientData: Record<string, unknown> = {
        created_by: parseInt(formData.created_by || "0", 10),
        unit_id: parseInt(formData.unit_id || "0", 10),
      };

      // Add all form responses
      questions.forEach((q) => {
        // Skip display-only types
        if (q.questionType === "text_block" || q.questionType === "header") {
          return;
        }
        const value = formData[q.fieldKey];
        if (value !== undefined && value !== "") {
          switch (q.questionType) {
            case "boolean":
              clientData[q.fieldKey] = value === "true" || value === "Yes";
              break;
            case "number":
              clientData[q.fieldKey] = parseFloat(value) || 0;
              break;
            default:
              clientData[q.fieldKey] = value;
          }
        }
      });

      await backend.post("/intakeClients", clientData);

      toast({
        title: "Client Added",
        description: `${formData.first_name} ${formData.last_name} has been added!`,
        position: "bottom-right",
        status: "success",
      });
      setHasSubmitted(true);
      setFormInProgress(false);
      setShowUnfinishedAlert(false);
      setErrors({});
      resetForm();
      onClose();
    } catch (e) {
      console.log(e);
      toast({
        title: "Client Not Added",
        description: `An error occurred and the client was not added.`,
        status: "error",
      });
    }
  };

  // Render a form field based on question type
  const renderField = (question: FormQuestion) => {
    const { fieldKey, questionType, options } = question;
    const value = formData[fieldKey] || "";
    const isInvalid = errors[fieldKey];

    switch (questionType) {
      case "rating_grid": {
        const gridConfig = options as RatingGridConfig | undefined;
        if (!gridConfig || !gridConfig.rows || !gridConfig.columns) {
          return <Text color="red.500">Invalid rating grid configuration</Text>;
        }
        
        const gridData = value ? JSON.parse(value) : {};
        
        return (
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th></Th>
                  {gridConfig.columns.map((col) => (
                    <Th key={col.value} textAlign="center" fontSize="12px" color="gray.600">
                      {col.label}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {gridConfig.rows.map((row) => (
                  <Tr key={row.key}>
                    <Td width="200px" fontSize="12px" color="#000">
                      {row.label}
                    </Td>
                    {gridConfig.columns.map((col) => (
                      <Td key={col.value} textAlign="center">
                        <Radio
                          name={`${fieldKey}_${row.key}`}
                          value={col.value}
                          isChecked={gridData[row.key] === col.value}
                          onChange={() => {
                            const newData = { ...gridData, [row.key]: col.value };
                            handleFieldChange(fieldKey, JSON.stringify(newData));
                          }}
                          sx={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "6px",
                            border: "2px solid",
                            borderColor: isInvalid ? "red.500" : "gray.300",
                            _checked: {
                              background: "blue.500",
                              borderColor: "blue.500",
                            },
                            _hover: {
                              borderColor: "gray.500",
                            },
                          }}
                        />
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {isInvalid && (
              <Text color="red.500" fontSize="sm" mt={2}>
                Please complete all required ratings.
              </Text>
            )}
          </Box>
        );
      }

      case "case_manager_select":
        return (
          <Select
            placeholder="Select case manager"
            value={value}
            isInvalid={isInvalid}
            errorBorderColor="red.500"
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          >
            {caseManagers.map((cm) => {
              const firstName = cm.firstName || cm.first_name || "";
              const lastName = cm.lastName || cm.last_name || "";
              const fullName = `${firstName} ${lastName}`.trim();
              return (
                <option key={cm.id} value={cm.id}>
                  {fullName || `Case Manager ${cm.id}`}
                </option>
              );
            })}
          </Select>
        );

      case "site_location":
        return (
          <Select
            placeholder="Select site location"
            value={value}
            isInvalid={isInvalid}
            errorBorderColor="red.500"
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          >
            {locations.map((loc: { id: number; name: string }) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </Select>
        );

      case "select":
        return (
          <Select
            placeholder="Select option"
            value={value}
            isInvalid={isInvalid}
            errorBorderColor="red.500"
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          >
            {(options as FormOption[])?.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </option>
            ))}
          </Select>
        );

      case "boolean":
        return (
          <Select
            placeholder="Select option"
            value={value}
            isInvalid={isInvalid}
            errorBorderColor="red.500"
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        );

      case "date":
        return (
          <Input
            type="date"
            value={value}
            isInvalid={isInvalid}
            errorBorderColor="red.500"
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder="Enter response"
            value={value}
            isInvalid={isInvalid}
            errorBorderColor="red.500"
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder="Enter response"
            value={value}
            isInvalid={isInvalid}
            errorBorderColor="red.500"
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          />
        );

      case "text_block":
        return (
          <Text fontSize="sm" color="gray.700" fontStyle="italic" py={2}>
            {question.questionText}
          </Text>
        );

      case "header":
        return (
          <Heading size="md" color="blue.600" mb={2} mt={4}>
            {question.questionText}
          </Heading>
        );

      case "text":
      default:
        return (
          <Input
            placeholder="Enter response"
            value={value}
            isInvalid={isInvalid}
            errorBorderColor="red.500"
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          />
        );
    }
  };

  const visibleQuestions = questions
    .filter((q) => q.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <>
      <Button
        ref={btnRef}
        colorScheme="blue"
        onClick={onOpen}
      >
        {!formInProgress && <Text>Add Client</Text>}
        {formInProgress && <Text>Edit New Client</Text>}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={handleCloseAndSave}
        finalFocusRef={btnRef}
        size="xl"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <HStack alignItems="center">
              <BackArrowIcon onClick={onClose} />
              <Text
                fontSize="md"
                mt="2px"
              >
                Add Client
              </Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            {isLoadingQuestions ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                h="200px"
              >
                <Spinner size="lg" />
              </Box>
            ) : (
              <Box
                padding="24px"
                borderWidth="1px"
                borderRadius="lg"
                bg="white"
              >
                <Grid
                  templateColumns="1fr 1fr"
                  gap={5}
                  pb={3}
                  borderBottom="1px solid"
                  borderColor="gray.200"
                >
                  <Text fontWeight="bold">QUESTIONS</Text>
                  <Text fontWeight="bold">ANSWERS</Text>
                </Grid>

                {/* Unit Selection */}
                <Box
                  py={3}
                  borderBottom="1px solid"
                  borderColor="gray.200"
                >
                  <Grid
                    templateColumns="1fr 1fr"
                    gap={5}
                    alignItems="center"
                  >
                    <Text fontWeight="medium">Unit *</Text>
                    <Select
                      placeholder="Select unit"
                      value={formData.unit_id}
                      isInvalid={errors.unit_id}
                      errorBorderColor="red.500"
                      onChange={(e) =>
                        handleFieldChange("unit_id", e.target.value)
                      }
                    >
                      {units.map((u) => (
                        <option
                          key={u.id}
                          value={u.id.toString()}
                        >
                          {u.name}
                        </option>
                      ))}
                    </Select>
                  </Grid>
                </Box>

                {/* Case Manager Selection */}
                <Box
                  py={3}
                  borderBottom="1px solid"
                  borderColor="gray.200"
                >
                  <Grid
                    templateColumns="1fr 1fr"
                    gap={5}
                    alignItems="center"
                  >
                    <Text fontWeight="medium">Case Manager *</Text>
                    <Select
                      placeholder="Select case manager"
                      value={formData.created_by}
                      isInvalid={errors.created_by}
                      errorBorderColor="red.500"
                      onChange={(e) =>
                        handleFieldChange("created_by", e.target.value)
                      }
                    >
                      {caseManagers.map((cm) => {
                        const first = cm.firstName ?? cm.first_name ?? "";
                        const last = cm.lastName ?? cm.last_name ?? "";
                        const label =
                          `${first} ${last}`.trim() || `ID ${cm.id}`;
                        return (
                          <option
                            key={cm.id}
                            value={cm.id.toString()}
                          >
                            {label}
                          </option>
                        );
                      })}
                    </Select>
                  </Grid>
                </Box>

                {/* Dynamic Questions (ordered by displayOrder) */}
                {visibleQuestions.map((question) => {
                  const isDisplayOnly =
                    question.questionType === "text_block" ||
                    question.questionType === "header";

                  if (isDisplayOnly) {
                    return (
                      <Box key={question.id} py={2}>
                        {renderField(question)}
                      </Box>
                    );
                  }

                  return (
                    <Box
                      key={question.id}
                      py={3}
                      borderBottom="1px solid"
                      borderColor="gray.200"
                    >
                      <Grid templateColumns="1fr 1fr" gap={5} alignItems="center">
                        <Text fontWeight="medium">
                          {question.questionText}
                          {question.isRequired && " *"}
                        </Text>
                        {renderField(question)}
                      </Grid>
                    </Box>
                  );
                })}
              </Box>
            )}
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={openAlert}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              onClick={handleSubmit}
              isDisabled={isLoadingQuestions}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
            >
              Are you sure?
            </AlertDialogHeader>

            <AlertDialogBody>
              You can't undo this action afterward.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={closeAlert}
              >
                No
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleConfirmCancel}
                ml={3}
              >
                Yes, Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
