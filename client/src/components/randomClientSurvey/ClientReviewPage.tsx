import {
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  Radio,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
  Divider,
  OrderedList,
  ListItem,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Circle,
  Spinner,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

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
  questionType: "text" | "number" | "boolean" | "date" | "select" | "textarea" | "rating_grid" | "case_manager_select";
  category: string;
  options?: FormOption[] | RatingGridConfig;
  isRequired: boolean;
  isVisible: boolean;
  isCore: boolean;
  displayOrder: number;
}

type CaseManager = {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  phone_number: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

type ClientReviewPageProps = {
  surveyData: Record<string, unknown>;
  setSurveyData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  errors: Record<string, boolean>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onNext: () => void;
  caseManagers: CaseManager[];
};

const categoryOrder = [
  "personal",
  "contact",
  "program",
  "demographics",
  "housing",
  "exit",
];

export const ClientReviewPage = ({
  surveyData,
  setSurveyData,
  errors,
  setErrors,
  onNext,
  caseManagers
}: ClientReviewPageProps) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load form questions for Random Client Surveys (form_id = 4)
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await backend.get("/formQuestions/form/4");
        const qs = Array.isArray(response.data) ? response.data : [];
        setQuestions(qs.sort((a: FormQuestion, b: FormQuestion) => a.displayOrder - b.displayOrder));
      } catch (err) {
        console.error("Failed to load form questions:", err);
        toast({
          title: "Error Loading Form",
          description: "Could not load form questions. Please try again.",
          status: "error",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, [backend, toast]);

  // Helper function to check if a field is empty
  const isFieldEmpty = (value: unknown, questionType?: string): boolean => {
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

  const handleValidateAndNext = async () => {
    const newErrors: Record<string, boolean> = {};

    // Validate all required questions
    questions.forEach((q) => {
      if (q.isRequired) {
        const value = surveyData[q.fieldKey];
        if (isFieldEmpty(value, q.questionType)) {
          newErrors[q.fieldKey] = true;
        }
      }
    });

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) {
      toast({
        title: "Missing required fields",
        description: "Please complete all required questions before submitting.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    onNext();
  };

  const renderField = (question: FormQuestion) => {
    const { fieldKey, questionType, options } = question;
    const value = surveyData[fieldKey] ?? "";
    const isInvalid = errors[fieldKey];

    switch (questionType) {
      case "rating_grid": {
        const gridConfig = options as RatingGridConfig | undefined;
        if (!gridConfig || !gridConfig.rows || !gridConfig.columns) {
          return <Text color="red.500">Invalid rating grid configuration</Text>;
        }
        
        const gridData = (typeof value === "string" && value) ? JSON.parse(value) : {};
        
        return (
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th></Th>
                  {gridConfig.columns.map((col) => (
                    <Th 
                      key={col.value} 
                      textAlign="center" 
                      fontSize="12px" 
                      color="#808080"
                      fontStyle="normal"
                      fontWeight="400"
                      lineHeight="normal"
                      padding="4px"
                    >
                      {col.label}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {gridConfig.rows.map((row) => (
                  <Tr key={row.key}>
                    <Td
                      width="200px"
                      color="#000"
                      fontSize="12px"
                      fontStyle="normal"
                      fontWeight="400"
                      lineHeight="150%"
                    >
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
                            setSurveyData((prev) => ({
                              ...prev,
                              [fieldKey]: JSON.stringify(newData),
                            }));
                          }}
                          sx={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "6px",
                            border: "2px solid",
                            borderColor: isInvalid ? "red.500" : "gray.300",
                            background: gridData[row.key] === col.value ? "blue.500" : "white",
                            _checked: {
                              background: "blue.500",
                              borderColor: "blue.500",
                            },
                            _hover: {
                              borderColor: "gray.500",
                            },
                            _focus: {
                              boxShadow: "none",
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
            placeholder="Select your case manager"
            value={String(value || "")}
            onChange={(e) =>
              setSurveyData((prev) => ({
                ...prev,
                [fieldKey]: Number(e.target.value),
              }))
            }
            borderRadius="14px"
            borderColor="blue.solid var(--gray-600, #4A5568)"
            isInvalid={isInvalid}
            errorBorderColor="red.500"
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

      case "select": {
        const selectOptions = options as FormOption[] | undefined;
        return (
          <Select
            placeholder="Select option"
            value={String(value || "")}
            onChange={(e) =>
              setSurveyData((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            borderRadius="14px"
            borderColor="blue.solid var(--gray-600, #4A5568)"
            isInvalid={isInvalid}
            errorBorderColor="red.500"
          >
            {selectOptions?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        );
      }

      case "boolean": {
        // Check if value is explicitly set (not undefined/null)
        const hasValue = surveyData[fieldKey] !== undefined && surveyData[fieldKey] !== null;
        const boolValue = hasValue && (surveyData[fieldKey] === true || surveyData[fieldKey] === "true");
        return (
          <HStack spacing={4}>
            {["yes", "no"].map((option) => {
              const isSelected = hasValue && boolValue === (option === "yes");
              return (
                <Button
                  key={option}
                  onClick={() =>
                    setSurveyData((prev) => ({
                      ...prev,
                      [fieldKey]: option === "yes",
                    }))
                  }
                  variant="outline"
                  width="89px"
                  height="28px"
                  borderColor={isSelected ? "blue.500" : "blue.solid var(--gray-600, #4A5568)"}
                  borderRadius="6.985px"
                  color={isSelected ? "white" : "black"}
                  textAlign="center"
                  fontSize="10.588px"
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="normal"
                  bg={isSelected ? "blue.500" : "transparent"}
                  _hover={{
                    bg: isSelected ? "blue.600" : "gray.100",
                  }}
                  px={6}
                  py={2}
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
            placeholder="Date"
            value={
              typeof value === "string"
                ? value
                : value instanceof Date
                ? value.toISOString().slice(0, 10)
                : ""
            }
            onChange={(e) =>
              setSurveyData((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            borderRadius="14px"
            borderColor="blue.solid var(--gray-600, #4A5568)"
            isInvalid={isInvalid}
            errorBorderColor="red.500"
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={`Enter ${question.questionText.toLowerCase()}`}
            value={typeof value === "number" ? value : typeof value === "string" ? value : ""}
            onChange={(e) =>
              setSurveyData((prev) => ({
                ...prev,
                [fieldKey]: e.target.value ? Number(e.target.value) : "",
              }))
            }
            borderRadius="14px"
            borderColor="blue.solid var(--gray-600, #4A5568)"
            isInvalid={isInvalid}
            errorBorderColor="red.500"
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={`Enter ${question.questionText.toLowerCase()}`}
            value={String(value || "")}
            onChange={(e) =>
              setSurveyData((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            borderRadius="14px"
            fontSize="16px"
            borderColor="blue.solid var(--gray-600, #4A5568)"
            resize="none"
            isInvalid={isInvalid}
            errorBorderColor="red.500"
          />
        );

      case "text":
      default:
        return (
          <Input
            placeholder={`Enter ${question.questionText.toLowerCase()}`}
            value={String(value || "")}
            onChange={(e) =>
              setSurveyData((prev) => ({
                ...prev,
                [fieldKey]: e.target.value,
              }))
            }
            borderRadius="14px"
            borderColor="blue.solid var(--gray-600, #4A5568)"
            isInvalid={isInvalid}
            errorBorderColor="red.500"
          />
        );
    }
  };

  // Group questions by category
  const groupedQuestions = questions
    .filter((q) => q.isVisible)
    .reduce<Record<string, FormQuestion[]>>((acc, q) => {
      const categoryKey = q.category;
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey]!.push(q);
      return acc;
    }, {});

  if (isLoading) {
    return (
      <VStack
        sx={{ width: 700, marginX: "auto", padding: "20px" }}
        alignItems="center"
        justifyContent="center"
        minH="400px"
      >
        <Spinner size="xl" color="blue.500" />
        <Text>Loading form...</Text>
      </VStack>
    );
  }

  return (
    <VStack
      sx={{ width: 700, marginX: "auto", padding: "20px" }}
      alignItems={"start"}
    >
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        marginTop={"30px"}
      >
        <Box
          width={"200px"}
          position={"relative"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          marginBottom={"100px"}
        >
          <Button
            position={"absolute"}
            left={"-250px"}
            top={"10px"}
            height={"40px"}
            width={"40px"}
            color={"blue.500"}
            backgroundColor={"transparent"}
            onClick={() => navigate("/client-landing-page")}
          >
            <Box fontSize={"35px"}>
              <IoIosArrowBack />
            </Box>
          </Button>
          <Box
            position="absolute"
            top="16px"
            left="55px"
            height="2px"
            width={"109px"}
            borderTop="1px dashed #3182CE"
            zIndex={0}
          />
          <VStack>
            <Circle
              size={"32px"}
              backgroundColor={"blue.500"}
              border="1px solid #3182CE"
              color={"white"}
            >
              1
            </Circle>
            <Text
              fontSize={"12px"}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"16px"}
            >
              Client Review
            </Text>
          </VStack>
          <VStack>
            <Circle
              size={"32px"}
              backgroundColor={"white"}
              border="1px"
              borderColor={"blue.500"}
              color={"blue.500"}
            >
              2
            </Circle>
            <Text
              fontSize={"12px"}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"16px"}
            >
              Review
            </Text>
          </VStack>
        </Box>
      </Box>
      <Heading
        color={"#3182CE"}
        textAlign={"center"}
        fontSize={"30px"}
        fontStyle={"normal"}
        fontWeight={"400"}
        lineHeight={"150%"}
      >
        How are we doing?
      </Heading>
      <Text
        color={"#656464"}
        fontSize={"16px"}
        fontStyle={"normal"}
        fontWeight={"400"}
        lineHeight={"150%"}
      >
        We are committed to providing you with the best help possible, so we
        welcome your comments. Please fill out this questionnaire. Thank you!
      </Text>
      <Divider width={"277.906px"} height={"1.011px"} background={"rgba(0, 0, 0, 0.20)"} marginBottom={"30px"}/>
      
      <OrderedList style={{ fontSize: "18px", fontWeight: "600", marginBottom: "130px"}} spacing={"4"}>
        {categoryOrder.map((category) => {
          const categoryQuestions = groupedQuestions[category];
          if (!categoryQuestions || categoryQuestions.length === 0) return null;

          return categoryQuestions
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((question) => (
              <ListItem key={question.id} marginBottom={question.questionType === "rating_grid" ? "50px" : "30px"}>
                <Heading
                  color={"#000"}
                  fontSize={"16px"}
                  fontStyle={"normal"}
                  fontWeight={"400"}
                  lineHeight={"150%"}
                  marginBottom={question.questionType === "rating_grid" ? "14px" : "30px"}
                >
                  {question.questionText}
                </Heading>
                <FormControl isRequired={question.isRequired} isInvalid={errors[question.fieldKey]}>
                  {renderField(question)}
                  {errors[question.fieldKey] && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      This field is required.
                    </Text>
                  )}
                </FormControl>
              </ListItem>
            ));
        })}
      </OrderedList>
      
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"flex-end"}
      >
        <Button
          onClick={handleValidateAndNext}
          color={"white"}
          backgroundColor={"blue.500"}
          fontSize={"20px"}
          borderRadius={"6px"}
          width={"150px"}
          height={"50px"}
        >
          Review
        </Button>
      </Box>
    </VStack>
  );
};
