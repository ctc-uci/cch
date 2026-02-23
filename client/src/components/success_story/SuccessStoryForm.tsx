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
import { LOCATION_OPTIONS } from "../../constants/locations";

type SuccessStoryFormProps = {
  formData: Record<string, unknown>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  onReview: boolean;
  setOnReview: React.Dispatch<React.SetStateAction<boolean>>;
  spanish: boolean;
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
  questionTextSpanish?: string;
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

export const SuccessStoryForm = ({
  formData,
  handleSubmit,
  setFormData,
  onReview,
  setOnReview,
  spanish,
}: SuccessStoryFormProps) => {
  const { backend } = useBackendContext();
  const toast = useToast();
  const language = spanish ? "spanish" : "english";

  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [caseManagers, setCaseManagers] = useState<CaseManager[]>([]);

  useEffect(() => {
    let mounted = true;
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const resp = await backend.get("/formQuestions/form/3");
        if (!mounted) return;
        const qs = Array.isArray(resp.data) ? resp.data : [];
        const sorted = qs.sort(
          (a: FormQuestion, b: FormQuestion) => a.displayOrder - b.displayOrder
        );
        setQuestions(sorted);
        // initialize defaults only once
        const init: Record<string, unknown> = {};
        sorted.forEach((q) => {
          if (q.questionType === "rating_grid") {
            init[q.fieldKey] = "{}";
          } else if (q.questionType === "boolean") {
            init[q.fieldKey] = formData[q.fieldKey] ?? false;
          } else {
            init[q.fieldKey] = formData[q.fieldKey] ?? "";
          }
        });
        setFormData((prev) => ({ ...init, ...prev }));
      } catch (e) {
        console.error(e);
        if (mounted) {
          toast({
            title: language === "spanish" ? "Error al cargar preguntas" : "Error loading questions",
            description: language === "spanish" ? "No se pudieron cargar las preguntas de la historia de éxito." : "Could not load success story questions.",
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
        const cms = await backend.get("/caseManagers");
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
        setCaseManagers(cmList);
      } catch (e) {
        console.error(e);
        toast({
          title: language === "spanish" ? "Error al cargar datos" : "Error loading data",
          description: language === "spanish" ? "No se pudieron cargar los administradores de casos." : "Could not load case managers.",
          status: "error",
        });
      }
    };
    loadRefs();
  }, [backend, toast]);

  const renderField = (question: FormQuestion) => {
    const { fieldKey, questionType, options, questionText, questionTextSpanish } = question;
    const value = formData[fieldKey];
    const disabled = onReview;
    // Use Spanish text if language is Spanish and Spanish text is available
    const displayQuestionText = language === "spanish" && questionTextSpanish ? questionTextSpanish : questionText;

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
                            setFormData((prev) => ({
                              ...prev,
                              [fieldKey]: JSON.stringify(newData),
                            }));
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
              setFormData((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
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
              setFormData((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            isDisabled={disabled}
          >
            {LOCATION_OPTIONS.map((name) => (
              <option key={name} value={name}>
                {name}
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
              setFormData((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
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
        const boolValue =
          value === true || value === "true" || value === "yes" || value === "Yes";
        const hasValue = value !== undefined && value !== null && value !== "";
        return (
          <HStack spacing={4}>
            {["yes", "no"].map((option) => {
              const isSelected = hasValue && boolValue === (option === "yes");
              const optionLabel = language === "spanish" 
                ? (option === "yes" ? "Sí" : "No")
                : (option.charAt(0).toUpperCase() + option.slice(1));
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
                    setFormData((prev) => ({
                      ...prev,
                      [fieldKey]: option === "yes",
                    }))
                  }
                  isDisabled={disabled}
                >
                  {optionLabel}
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
                : value instanceof Date
                ? value.toISOString().slice(0, 10)
                : ""
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
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
              setFormData((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            isDisabled={disabled}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={
              language === "spanish" ? "Escribe tu respuesta" : "Enter response"
            }
            value={value ? String(value) : ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            isDisabled={disabled}
          />
        );

      case "text_block":
        return (
          <Text fontSize="sm" color="gray.700" fontStyle="italic" fontWeight="normal" py={2}>
            {displayQuestionText}
          </Text>
        );

      case "header":
        return (
          <Heading size="lg" color="#0099D2" mb={2} mt={4} fontWeight="normal">
            {displayQuestionText}
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
              setFormData((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
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
        <Text>{language === "spanish" ? "Cargando formulario de historia de éxito..." : "Loading success story form..."}</Text>
      </VStack>
    );
  }

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <form onSubmit={handleSubmit}>
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
                  <HStack spacing={2} alignItems="center">
                    {renderField(question)}
                    <FormLabel mb={0}>{language === "spanish" && question.questionTextSpanish ? question.questionTextSpanish : question.questionText}</FormLabel>
                  </HStack>
                </FormControl>
              );
            }

            return (
              <FormControl key={question.id} isRequired={question.isRequired && question.questionType !== "text_block" && question.questionType !== "header"}>
                <FormLabel>{language === "spanish" && question.questionTextSpanish ? question.questionTextSpanish : question.questionText}</FormLabel>
                {renderField(question)}
              </FormControl>
            );
          })}

          {!onReview && (
            <HStack justify="flex-end">
              <Button size="lg" colorScheme="blue" type="submit">
                {language === "spanish" ? "Siguiente" : "Next"}
              </Button>
            </HStack>
          )}
        </VStack>
      </form>
    </Box>
  );
};
