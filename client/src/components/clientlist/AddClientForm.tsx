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
  Input,
  Select,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { BackArrowIcon } from "../donations/addDonations/BackArrowIcon";

// Types for dynamic form questions
interface FormOption {
  value: string;
  label: string;
}

interface FormQuestion {
  id: number;
  fieldKey: string;
  questionText: string;
  questionType: "text" | "number" | "boolean" | "date" | "select" | "textarea";
  category: string;
  options?: FormOption[];
  isRequired: boolean;
  isVisible: boolean;
  isCore: boolean;
  displayOrder: number;
}

interface AddClientFormProps {
  onClientAdded: () => void;
  setShowUnfinishedAlert: (e: boolean) => void;
  formKey?: string; // Which form to use (defaults to 'client_intake')
  formTitle?: string; // Custom title for the drawer
}

export const AddClientForm = ({
  onClientAdded,
  setShowUnfinishedAlert,
  formKey = "client_intake",
  formTitle = "Add Client",
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

  // Helper function to check if a field is empty
  const isFieldEmpty = (value: unknown): boolean => {
    return (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "")
    );
  };

  // Initialize form data based on questions
  const initializeFormData = (qs: FormQuestion[]) => {
    const initial: Record<string, string> = {
      created_by: "",
      unit_id: "",
    };
    qs.forEach((q) => {
      initial[q.fieldKey] = "";
    });
    return initial;
  };

  const resetForm = useCallback(() => {
    setFormData(initializeFormData(questions));
    setErrors({});
  }, [questions]);

  // Load form questions for the specified form on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        // Load questions for the specific form using form key
        const response = await backend.get(`/formQuestions/form/${formKey}`);
        const qs = Array.isArray(response.data) ? response.data : [];
        setQuestions(qs);
        setFormData(initializeFormData(qs));
      } catch (err) {
        console.error("Failed to load form questions:", err);
        toast({
          title: "Error Loading Form",
          description: `Could not load form questions for '${formKey}'. Please try again.`,
          status: "error",
          position: "bottom-right",
        });
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    loadQuestions();
  }, [backend, toast, formKey]);

  // Load reference data (units and case managers)
  useEffect(() => {
    const loadReferences = async () => {
      try {
        const [unitsRes, cmsRes] = await Promise.all([
          backend.get("/units"),
          backend.get("/caseManagers"),
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
      if (q.isRequired && isFieldEmpty(formData[q.fieldKey])) {
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

      // Include form_key in the request so backend knows which form's questions to use
      await backend.post("/intakeClients", { ...clientData, form_key: formKey });

      toast({
        title: "Form Submitted",
        description: `${formData.first_name || "Client"} ${formData.last_name || ""} has been added!`.trim(),
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
      case "select":
        return (
          <Select
            placeholder="Select option"
            value={value}
            isInvalid={isInvalid}
            errorBorderColor="red.500"
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          >
            {options?.map((opt) => (
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
            placeholder={`Enter ${question.questionText.toLowerCase()}`}
            value={value}
            isInvalid={isInvalid}
            errorBorderColor="red.500"
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={`Enter ${question.questionText.toLowerCase()}`}
            value={value}
            isInvalid={isInvalid}
            errorBorderColor="red.500"
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          />
        );

      case "text":
      default:
        return (
          <Input
            placeholder={`Enter ${question.questionText.toLowerCase()}`}
            value={value}
            isInvalid={isInvalid}
            errorBorderColor="red.500"
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
          />
        );
    }
  };

  // Group questions by category
  const groupedQuestions = questions.reduce<Record<string, FormQuestion[]>>(
    (acc, q) => {
      const categoryKey = q.category;
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey]!.push(q);
      return acc;
    },
    {}
  );

  // Category display names
  const categoryNames: Record<string, string> = {
    personal: "Personal Information",
    contact: "Contact Information",
    program: "Program Information",
    demographics: "Demographics",
    housing: "Housing History",
    exit: "Exit Information",
  };

  // Category order
  const categoryOrder = [
    "personal",
    "contact",
    "program",
    "demographics",
    "housing",
    "exit",
  ];

  return (
    <>
      <Button
        ref={btnRef}
        colorScheme="blue"
        onClick={onOpen}
      >
        {!formInProgress && <Text>{formTitle}</Text>}
        {formInProgress && <Text>Edit {formTitle}</Text>}
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
                {formTitle}
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

                {/* Dynamic Questions by Category */}
                {categoryOrder.map((category) => {
                  const categoryQuestions = groupedQuestions[category];
                  if (!categoryQuestions || categoryQuestions.length === 0)
                    return null;

                  return (
                    <Box key={category}>
                      <Box
                        py={4}
                        borderBottom="1px solid"
                        borderColor="gray.300"
                      >
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color="gray.600"
                          textTransform="uppercase"
                        >
                          {categoryNames[category] ?? category}
                        </Text>
                      </Box>

                      {categoryQuestions.map((question) => (
                        <Box
                          key={question.id}
                          py={3}
                          borderBottom="1px solid"
                          borderColor="gray.200"
                        >
                          <Grid
                            templateColumns="1fr 1fr"
                            gap={5}
                            alignItems="center"
                          >
                            <Text fontWeight="medium">
                              {question.questionText}
                              {question.isRequired && " *"}
                            </Text>
                            {renderField(question)}
                          </Grid>
                        </Box>
                      ))}
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
