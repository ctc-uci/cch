import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useForm } from "../../contexts/formContext";
import type { FormData } from "../../types/screenFormData";

type InterviewScreeningFormProps = {
  onReview?: boolean;
  spanish?: boolean;
};

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
  questionType:
    | "text"
    | "number"
    | "boolean"
    | "date"
    | "select"
    | "textarea"
    | "rating_grid"
    | "case_manager_select"
    | "site_location"
    | "text_block"
    | "header";
  options?: FormOption[] | RatingGridConfig;
  isRequired: boolean;
  isVisible: boolean;
  isCore: boolean;
  displayOrder: number;
}

type CaseManager = {
  id: number;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
};

type Location = { id: number; name: string };

export const InterviewScreeningForm = ({
  onReview = false,
  spanish = false,
}: InterviewScreeningFormProps) => {
  const { backend } = useBackendContext();
  const toast = useToast();
  const { formData, setFormData } = useForm();
  const language = spanish ? "spanish" : "english";

  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [caseManagers, setCaseManagers] = useState<CaseManager[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    let mounted = true;
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const resp = await backend.get("/formQuestions/form/1");
        if (!mounted) return;
        const qs = Array.isArray(resp.data) ? resp.data : [];
        const sorted = qs.sort(
          (a: FormQuestion, b: FormQuestion) => a.displayOrder - b.displayOrder
        );
        setQuestions(sorted);
        // Initialize defaults only once
        const init: Record<string, unknown> = {};
        sorted.forEach((q) => {
          if (q.questionType === "rating_grid") {
            init[q.fieldKey] = formData[q.fieldKey as keyof typeof formData] ?? "{}";
          } else if (q.questionType === "boolean") {
            init[q.fieldKey] = formData[q.fieldKey as keyof typeof formData] ?? "";
          } else {
            init[q.fieldKey] = formData[q.fieldKey as keyof typeof formData] ?? "";
          }
        });
        // Merge with existing formData
        setFormData((prev: FormData) => ({ ...prev, ...init } as FormData));
      } catch (e) {
        console.error(e);
        if (mounted) {
          toast({
            title: "Error loading questions",
            description: "Could not load interview screening questions.",
            status: "error",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    loadQuestions();
    return () => {
      mounted = false;
    };
    // We intentionally exclude formData to avoid re-initializing on every state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend, setFormData, toast]);

  useEffect(() => {
    const loadRefs = async () => {
      try {
        const [cms, locs] = await Promise.all([
          backend.get("/caseManagers"),
          backend.get("/locations"),
        ]);
        const cmList: CaseManager[] = Array.isArray(cms.data)
          ? (cms.data as Array<{
              id: number | string;
              firstName?: string;
              lastName?: string;
              first_name?: string;
              last_name?: string;
            }>).map((cm) => ({
              id: Number(cm.id),
              firstName: cm.firstName ?? cm.first_name,
              lastName: cm.lastName ?? cm.last_name,
            }))
          : [];
        const locList: Location[] = Array.isArray(locs.data)
          ? (locs.data as Array<{ id: number | string; name: string }>)
              .map((l) => ({ id: Number(l.id), name: l.name }))
              .filter((l: Location) => !Number.isNaN(l.id))
          : [];
        setCaseManagers(cmList);
        setLocations(locList);
      } catch (e) {
        console.error(e);
        toast({
          title: "Error loading data",
          description: "Could not load case managers or locations.",
          status: "error",
        });
      }
    };
    loadRefs();
  }, [backend, toast]);

  const renderField = (question: FormQuestion) => {
    const { fieldKey, questionType, options, questionText } = question;
    const value = formData[fieldKey as keyof typeof formData];
    const disabled = onReview;

    switch (questionType) {
      case "rating_grid": {
        const gridConfig = options as RatingGridConfig | undefined;
        if (!gridConfig?.rows || !gridConfig?.columns) {
          return <Text color="red.500">Invalid rating grid</Text>;
        }
        const gridData = typeof value === "string" && value ? JSON.parse(value) : {};
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
                          isDisabled={disabled}
                          onChange={() => {
                            const newData = { ...gridData, [row.key]: col.value };
                            setFormData((prev: FormData) => ({
                              ...prev,
                              [fieldKey]: JSON.stringify(newData),
                            } as FormData));
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

      case "case_manager_select":
        return (
          <Select
            placeholder={language === "spanish" ? "Selecciona el administrador de casos" : "Select case manager"}
            value={value ? String(value) : ""}
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                [fieldKey]: e.target.value,
              } as FormData))
            }
            isDisabled={disabled}
          >
            {caseManagers.map((cm) => {
              const name = `${cm.firstName ?? ""} ${cm.lastName ?? ""}`.trim() || `Case Manager ${cm.id}`;
              return (
                <option key={cm.id} value={cm.id}>
                  {name}
                </option>
              );
            })}
          </Select>
        );

      case "site_location":
        return (
          <Select
            placeholder={language === "spanish" ? "Selecciona el sitio" : "Select location"}
            value={value ? String(value) : ""}
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                [fieldKey]: e.target.value,
              } as FormData))
            }
            isDisabled={disabled}
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </Select>
        );

      case "select": {
        const opts = options as FormOption[] | undefined;
        return (
          <Select
            placeholder={language === "spanish" ? "Selecciona una opción" : "Select option"}
            value={value ? String(value) : ""}
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                [fieldKey]: e.target.value,
              } as FormData))
            }
            isDisabled={disabled}
          >
            {opts?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        );
      }

      case "boolean": {
        const stringValue = String(value || "");
        const boolValue = stringValue === "true" || stringValue === "yes" || stringValue === "Yes";
        const hasValue = value !== undefined && value !== null && value !== "";
        return (
          <HStack spacing={4}>
            {["yes", "no"].map((option) => {
              const isSelected = hasValue && boolValue === (option === "yes");
              return (
                <Button
                  key={option}
                  variant="outline"
                  width="89px"
                  height="32px"
                  borderColor={isSelected ? "blue.500" : "gray.400"}
                  borderRadius="8px"
                  color={isSelected ? "white" : "black"}
                  bg={isSelected ? "blue.500" : "transparent"}
                  _hover={{ bg: isSelected ? "blue.600" : "gray.100" }}
                  onClick={() =>
                    setFormData((prev: FormData) => ({
                      ...prev,
                      [fieldKey]: option === "yes" ? "yes" : "no",
                    } as FormData))
                  }
                  isDisabled={disabled}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Button>
              );
            })}
          </HStack>
        );
      }

      case "date":
        return (
          <Input
            type="date"
            value={
              typeof value === "string"
                ? value
                : ""
            }
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                [fieldKey]: e.target.value,
              } as FormData))
            }
            isDisabled={disabled}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={
              typeof value === "number"
                ? value
                : typeof value === "string"
                ? value
                : ""
            }
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                [fieldKey]: e.target.value,
              } as FormData))
            }
            isDisabled={disabled}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={
              language === "spanish" ? "Escribe su respuesta..." : "Enter your response..."
            }
            value={value ? String(value) : ""}
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                [fieldKey]: e.target.value,
              } as FormData))
            }
            isDisabled={disabled}
          />
        );

      case "text_block":
        return (
          <Text fontSize="sm" color="gray.700" fontStyle="italic" fontWeight="normal" py={2}>
            {questionText}
          </Text>
        );

      case "header":
        return (
          <Heading size="lg" color="#0099D2" mb={2} mt={4} fontWeight="normal">
            {questionText}
          </Heading>
        );

      case "text":
      default:
        return (
          <Input
            placeholder={
              language === "spanish"
                ? "Escribe tu respuesta"
                : "Enter response"
            }
            value={value ? String(value) : ""}
            onChange={(e) =>
              setFormData((prev: FormData) => ({
                ...prev,
                [fieldKey]: e.target.value,
              } as FormData))
            }
            isDisabled={disabled}
          />
        );
    }
  };

  const visibleQuestions = questions
    .filter((q) => q.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (isLoading) {
    return (
      <VStack align="center" justify="center" minH="300px">
        <Spinner size="lg" color="blue.500" />
        <Text>Loading interview screening form...</Text>
      </VStack>
    );
  }

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {visibleQuestions.map((question) => {
          const isDisplayOnly =
            question.questionType === "text_block" ||
            question.questionType === "header";
          
          if (isDisplayOnly) {
            return <Box key={question.id}>{renderField(question)}</Box>;
          }

          // Special handling for boolean/checkbox questions
          if (question.questionType === "boolean") {
            return (
              <FormControl key={question.id} isRequired={question.isRequired && question.questionType !== "text_block" && question.questionType !== "header"}>
                <FormLabel>{question.questionText}</FormLabel>
                {renderField(question)}
              </FormControl>
            );
          }

          return (
            <FormControl key={question.id} isRequired={question.isRequired && question.questionType !== "text_block" && question.questionType !== "header"}>
              <FormLabel>{question.questionText}</FormLabel>
              {renderField(question)}
            </FormControl>
          );
        })}

      </VStack>
    </Box>
  );
};

