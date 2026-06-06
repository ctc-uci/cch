import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  Heading,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { LOCATION_OPTIONS } from "../../constants/locations";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { calculateAge } from "../../utils/dateUtils";
import { BackArrowIcon } from "../donations/addDonations/BackArrowIcon";

interface FormOption {
  value: string;
  label: string;
}

interface RatingGridConfig {
  rows: Array<{ key: string; label: string }>;
  columns: Array<{ value: string; label: string }>;
}

interface ClientFormQuestion {
  id: number;
  fieldKey: string;
  questionText: string;
  questionType: string;
  options?: FormOption[] | RatingGridConfig;
  isRequired: boolean;
  isVisible: boolean;
  isCore: boolean;
  displayOrder: number;
}

interface AddClientFormProps {
  onClientAdded: (clientId?: number) => void;
  setShowUnfinishedAlert: (e: boolean) => void;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  hideButton?: boolean;
  initialValues?: Partial<{
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    date_of_birth: string;
  }>;
}


export const AddClientForm = ({
  onClientAdded,
  setShowUnfinishedAlert,
  isOpen: controlledIsOpen,
  onOpen: controlledOnOpen,
  onClose: controlledOnClose,
  hideButton,
  initialValues,
}: AddClientFormProps) => {
  const {
    isOpen: isAlertOpen,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();

  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [createdClientId, setCreatedClientId] = useState<number | undefined>(undefined);

  const {
    isOpen: localIsOpen,
    onOpen: localOnOpen,
    onClose: localOnClose,
  } = useDisclosure();

  const isOpen = controlledIsOpen ?? localIsOpen;
  const onOpen = controlledOnOpen ?? localOnOpen;
  const onClose = controlledOnClose ?? localOnClose;

  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [formInProgress, setFormInProgress] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, boolean>>({});
  const [questions, setQuestions] = useState<ClientFormQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [caseManagers, setCaseManagers] = useState<
    Array<{ id: number; firstName?: string; lastName?: string; first_name?: string; last_name?: string }>
  >([]);
  const [validCaseManagerIds, setValidCaseManagerIds] = useState<number[]>([]);

  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const { backend } = useBackendContext();
  const toast = useToast();

  const isFieldEmpty = (value: unknown): boolean =>
    value === null || value === undefined || (typeof value === "string" && value.trim() === "");

  const resetForm = () => {
    setFormData({});
    setErrors({});
  };

  const loadQuestions = useCallback(async () => {
    try {
      setQuestionsLoading(true);
      const res = await backend.get("/formQuestions/form/5");
      const qs: ClientFormQuestion[] = Array.isArray(res.data) ? res.data : [];
      setQuestions(qs.sort((a, b) => a.displayOrder - b.displayOrder));
    } catch {
      // Fall through — questionsLoading stays true, form falls back to loading state
    } finally {
      setQuestionsLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    const loadCaseManagers = async () => {
      try {
        const res = await backend.get("/caseManagers");
        const list: typeof caseManagers = Array.isArray(res.data)
          ? res.data
              .map((cm: { id: number | string; firstName?: string; lastName?: string; first_name?: string; last_name?: string }) => ({
                id: Number(cm.id),
                firstName: cm.firstName,
                lastName: cm.lastName,
                first_name: cm.first_name,
                last_name: cm.last_name,
              }))
              .filter((cm) => !Number.isNaN(cm.id))
          : [];
        setCaseManagers(list);
        setValidCaseManagerIds(list.map((cm) => cm.id));
      } catch {
        // skip
      }
    };
    loadCaseManagers();
  }, [backend]);

  useEffect(() => {
    if (hasSubmitted) {
      onClientAdded(createdClientId);
      setHasSubmitted(false);
      setCreatedClientId(undefined);
      resetForm();
    }
  }, [hasSubmitted, onClientAdded, createdClientId]);

  useEffect(() => {
    if (!isOpen || !initialValues) return;
    setFormData((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(initialValues).filter(([, v]) => v !== undefined)
      ),
    }));
  }, [isOpen, initialValues]);

  const handleCloseAndSave = () => {
    onClose();
    const hasAnyData = Object.values(formData).some((v) => !isFieldEmpty(v));
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

  const handleChange = (fieldKey: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
    setFormInProgress(true);
    setShowUnfinishedAlert(true);
    setErrors((prev) => ({ ...prev, [fieldKey]: false }));
  };

  useEffect(() => {
    const dob = formData["date_of_birth"];
    if (!dob) return;
    const age = calculateAge(dob);
    if (!isNaN(age)) {
      setFormData((prev) => ({ ...prev, age: String(age) }));
      setErrors((prev) => ({ ...prev, age: false }));
    }
  }, [formData["date_of_birth"]]);

  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {};
    questions
      .filter((q) => q.isVisible && q.isRequired && q.questionType !== "header" && q.questionType !== "text_block")
      .forEach((q) => {
        if (isFieldEmpty(formData[q.fieldKey])) newErrors[q.fieldKey] = true;
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
      const createdById = parseInt(formData.created_by || "0", 10);
      const unitOptions = questions
        .find((q) => q.fieldKey === "unit_name")
        ?.options?.map((o) => o.value) ?? [];

      if (unitOptions.length > 0 && !unitOptions.includes(formData.unit_name)) {
        toast({
          title: "Invalid Unit",
          description: "Please choose an existing unit.",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
        return;
      }

      if (validCaseManagerIds.length > 0 && !validCaseManagerIds.includes(createdById)) {
        toast({
          title: "Invalid Case Manager ID",
          description: "Please choose an existing case manager ID.",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
        return;
      }

      const clientCore = {
        created_by: createdById,
        unit_name: formData.unit_name,
        status: formData.status,
        first_name: formData.first_name,
        last_name: formData.last_name,
        grant: formData.grant || null,
      };

      // Display-only types produce no response value
      const responses = questions
        .filter((q) => q.questionType !== "header" && q.questionType !== "text_block")
        .map((q) => ({
          question_id: q.id,
          response_value: (formData as Record<string, string>)[q.fieldKey] ?? "",
        }));

      const created = await backend.post("/clients/from-form", {
        client: clientCore,
        responses,
      });
      const newClientId =
        typeof created?.data?.id === "number" ? (created.data.id as number) : undefined;
      setCreatedClientId(newClientId);

      toast({
        title: "Client Added",
        description: "Client has been added!",
        position: "bottom-right",
        status: "success",
      });
      setHasSubmitted(true);
      setFormInProgress(false);
      setShowUnfinishedAlert(false);
      resetForm();
      onClose();
    } catch {
      toast({
        title: "Client Not Added",
        description: "An error occurred and the client was not added.",
        status: "error",
      });
    }
  };

  const renderInput = (question: ClientFormQuestion) => {
    const { fieldKey, questionType, questionText, options } = question;
    const value = (formData as Record<string, string>)[fieldKey] ?? "";
    const hasError = !!errors[fieldKey];

    const onChange = (val: string) => handleChange(fieldKey, val);

    switch (questionType) {
      case "case_manager_select":
        return (
          <Select
            placeholder="Select case manager"
            value={value}
            isInvalid={hasError}
            errorBorderColor="red.500"
            onChange={(e) => onChange(e.target.value)}
          >
            {caseManagers.map((cm) => {
              const first = cm.firstName ?? cm.first_name ?? "";
              const last = cm.lastName ?? cm.last_name ?? "";
              const label = `${first} ${last}`.trim() || `ID ${cm.id}`;
              return (
                <option key={cm.id} value={cm.id.toString()}>
                  {label}
                </option>
              );
            })}
          </Select>
        );

      case "select":
        return (
          <Select
            placeholder="Select option"
            value={value}
            isInvalid={hasError}
            errorBorderColor="red.500"
            onChange={(e) => onChange(e.target.value)}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
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
            isInvalid={hasError}
            errorBorderColor="red.500"
            onChange={(e) => onChange(e.target.value)}
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
            isInvalid={hasError}
            errorBorderColor="red.500"
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "number":
        return (
          <NumberInput
            min={0}
            step={fieldKey === "savings_amount" ? 0.01 : 1}
            precision={fieldKey === "savings_amount" ? 2 : 0}
            clampValueOnBlur
            value={value}
            onChange={(val) => onChange(val)}
          >
            <NumberInputField
              placeholder={`Enter ${questionText.toLowerCase()}`}
              aria-invalid={hasError}
              _invalid={{ borderColor: "red.500" }}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        );

      case "textarea":
        return (
          <Textarea
            placeholder={`Enter ${questionText.toLowerCase()}`}
            value={value}
            isInvalid={hasError}
            errorBorderColor="red.500"
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "site_location":
        return (
          <Select
            placeholder="Select site location"
            value={value}
            isInvalid={hasError}
            errorBorderColor="red.500"
            onChange={(e) => onChange(e.target.value)}
          >
            {LOCATION_OPTIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </Select>
        );

      case "rating_grid": {
        const gridConfig = options as RatingGridConfig | undefined;
        if (!gridConfig?.rows?.length || !gridConfig?.columns?.length) return null;
        const gridData = value ? (() => { try { return JSON.parse(value); } catch { return {}; } })() : {};
        return (
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th />
                  {gridConfig.columns.map((col) => (
                    <Th key={col.value} textAlign="center" fontSize="11px">{col.label}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {gridConfig.rows.map((row) => (
                  <Tr key={row.key}>
                    <Td fontSize="12px">{row.label}</Td>
                    {gridConfig.columns.map((col) => (
                      <Td key={col.value} textAlign="center">
                        <Radio
                          name={`${fieldKey}_${row.key}`}
                          value={col.value}
                          isChecked={gridData[row.key] === col.value}
                          onChange={() => {
                            const updated = { ...gridData, [row.key]: col.value };
                            onChange(JSON.stringify(updated));
                          }}
                        />
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        );
      }

      case "header":
      case "text_block":
        return null;

      case "text":
      default:
        return (
          <Input
            type={fieldKey === "email" ? "email" : "text"}
            placeholder={`Enter ${questionText.toLowerCase()}`}
            value={value}
            isInvalid={hasError}
            errorBorderColor="red.500"
            maxLength={
              fieldKey === "phone_number" || fieldKey === "emergency_contact_phone_number"
                ? 10
                : fieldKey === "email"
                ? 32
                : undefined
            }
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  const visibleQuestions = questions.filter((q) => q.isVisible).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <>
      {!hideButton && (
        <Button ref={btnRef} colorScheme="blue" onClick={onOpen}>
          {formInProgress ? <Text>Edit New Client</Text> : <Text>Add Client</Text>}
        </Button>
      )}

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
              <Text fontSize="md" mt="2px">Add Client</Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <Box padding="24px" borderWidth="1px" borderRadius="lg" bg="white">
              <Grid templateColumns="1fr 1fr" gap={5} pb={3} borderBottom="1px solid" borderColor="gray.200">
                <Text fontWeight="bold">QUESTIONS</Text>
                <Text fontWeight="bold">ANSWERS</Text>
              </Grid>

              {questionsLoading ? (
                <HStack justify="center" py={8}>
                  <Spinner />
                  <Text color="gray.500">Loading form fields...</Text>
                </HStack>
              ) : (
                visibleQuestions.map((question, idx) => {
                  const isLast = idx === visibleQuestions.length - 1;
                  const isDisplayOnly = question.questionType === "header" || question.questionType === "text_block";

                  if (isDisplayOnly) {
                    return (
                      <Box key={question.id} py={3} borderBottom={isLast ? undefined : "1px solid"} borderColor="gray.200">
                        {question.questionType === "header" ? (
                          <>
                            <Divider mb={2} />
                            <Heading size="sm" color="blue.600">{question.questionText}</Heading>
                          </>
                        ) : (
                          <Text fontSize="sm" color="gray.600">{question.questionText}</Text>
                        )}
                      </Box>
                    );
                  }

                  return (
                    <Box
                      key={question.id}
                      py={3}
                      borderBottom={isLast ? undefined : "1px solid"}
                      borderColor="gray.200"
                    >
                      <Grid templateColumns="1fr 1fr" gap={5} alignItems={question.questionType === "rating_grid" ? "start" : "center"}>
                        <Text fontWeight="medium">
                          {question.questionText}
                          {!question.isRequired && (
                            <Text as="span" color="gray.500" fontWeight="normal"> (optional)</Text>
                          )}
                        </Text>
                        {renderInput(question)}
                      </Grid>
                    </Box>
                  );
                })
              )}
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={openAlert}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue" onClick={handleSubmit} isDisabled={questionsLoading}>
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
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Are you sure?
            </AlertDialogHeader>
            <AlertDialogBody>You can't undo this action afterward.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>
                No
              </Button>
              <Button colorScheme="blue" onClick={handleConfirmCancel} ml={3}>
                Yes, Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
