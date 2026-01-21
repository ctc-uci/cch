import { 
    Box, 
    Button, 
    Circle, 
    Divider, 
    FormControl, 
    Heading, 
    HStack, 
    Input, 
    ListItem, 
    OrderedList, 
    Radio, 
    Select, 
    Table, 
    Tbody, 
    Td, 
    Text, 
    Textarea, 
    Th, 
    Thead, 
    Tr, 
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    useDisclosure,
    Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useToast } from "@chakra-ui/react";

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

type ReviewPageProps = {
  surveyData: Record<string, unknown>;
  caseManagers: CaseManager[];
  onSubmit: () => Promise<void> | void;
  onCancel: () => void;
};

const categoryOrder = [
  "personal",
  "contact",
  "program",
  "demographics",
  "housing",
  "exit",
];

export const ReviewPage = ({ surveyData, caseManagers, onSubmit, onCancel }: ReviewPageProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { backend } = useBackendContext();
    const toast = useToast();
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

    const renderField = (question: FormQuestion) => {
        const { fieldKey, questionType, options } = question;
        const value = surveyData[fieldKey];

        switch (questionType) {
            case "rating_grid": {
                const gridConfig = options as RatingGridConfig | undefined;
                if (!gridConfig || !gridConfig.rows || !gridConfig.columns) {
                    return <Text color="red.500">Invalid rating grid configuration</Text>;
                }
                
                const gridData = (typeof value === "string" && value) ? JSON.parse(value) : {};
                
                return (
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr>
                                <Th></Th>
                                {gridConfig.columns.map((col) => (
                                    <Th 
                                        key={col.value} 
                                        textAlign="center" 
                                        fontSize="9.762px" 
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
                                        width="180px"
                                        color="#000"
                                        fontSize="9.762px"
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
                                                isDisabled
                                                sx={{
                                                    width: "20px",
                                                    height: "20px",
                                                    borderRadius: "6px",
                                                    border: "2px solid",
                                                    borderColor: "gray.300",
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
                );
            }

            case "case_manager_select": {
                const cmId = typeof value === "number" ? value : typeof value === "string" ? Number(value) : null;
                return (
                    <Select
                        placeholder="Select your case manager"
                        value={String(cmId || "")}
                        isDisabled
                        fontSize="13px"
                        borderRadius="14px"
                        borderColor="blue.solid var(--gray-600, #4A5568)"
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
            }

            case "select": {
                const selectOptions = options as FormOption[] | undefined;
                return (
                    <Select
                        placeholder="Select option"
                        value={String(value || "")}
                        isDisabled
                        fontSize="13px"
                        borderRadius="14px"
                        borderColor="blue.solid var(--gray-600, #4A5568)"
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
                const hasValue = value !== undefined && value !== null;
                const boolValue = hasValue && (value === true || value === "true");
                return (
                    <HStack spacing={4}>
                        {["yes", "no"].map((option) => {
                            const isSelected = hasValue && boolValue === (option === "yes");
                            return (
                                <Button
                                    key={option}
                                    variant="outline"
                                    width="72px"
                                    height="22px"
                                    borderColor={isSelected ? "blue.500" : "blue.solid var(--gray-600, #4A5568)"}
                                    borderRadius="6.985px"
                                    color={isSelected ? "white" : "black"}
                                    textAlign="center"
                                    fontSize="8.613px"
                                    fontStyle="normal"
                                    fontWeight="400"
                                    lineHeight="normal"
                                    bg={isSelected ? "blue.500" : "transparent"}
                                    _hover={{
                                        bg: isSelected ? "blue.600" : "gray.100",
                                    }}
                                    px={6}
                                    py={2}
                                    isDisabled
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
                        fontSize="13px"
                        isReadOnly
                        value={
                            typeof value === "string"
                                ? value
                                : value instanceof Date
                                ? value.toISOString().slice(0, 10)
                                : ""
                        }
                        borderRadius="14px"
                        borderColor="blue.solid var(--gray-600, #4A5568)"
                    />
                );

            case "number":
                return (
                    <Input
                        type="number"
                        placeholder={`Enter ${question.questionText.toLowerCase()}`}
                        fontSize="13px"
                        isReadOnly
                        value={typeof value === "number" ? value : typeof value === "string" ? value : ""}
                        borderRadius="14px"
                        borderColor="blue.solid var(--gray-600, #4A5568)"
                    />
                );

            case "textarea":
                return (
                    <Textarea
                        placeholder={`Enter ${question.questionText.toLowerCase()}`}
                        fontSize="13px"
                        isReadOnly
                        value={String(value || "")}
                        borderRadius="14px"
                        borderColor="blue.solid var(--gray-600, #4A5568)"
                        resize="none"
                    />
                );

            case "text":
            default:
                return (
                    <Input
                        placeholder={`Enter ${question.questionText.toLowerCase()}`}
                        fontSize="13px"
                        isReadOnly
                        value={String(value || "")}
                        borderRadius="14px"
                        borderColor="blue.solid var(--gray-600, #4A5568)"
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
                width="100%"
                height="100%"
                backgroundColor="#E7F0F4"
                alignItems="center"
                justifyContent="center"
                minH="400px"
            >
                <Spinner size="xl" color="blue.500" />
                <Text>Loading review...</Text>
            </VStack>
        );
    }

    return (
    <VStack
        width={"100%"}
        height={"100%"}
        backgroundColor={"#E7F0F4"}
    >
        <Box
            width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            padding={"30px"}
        >
            <Box
            width={"200px"}
            position={"relative"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            >
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
                backgroundColor={"blue.500"}
                border="1px"
                borderColor={"blue.500"}
                color={"white"}
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
        <VStack
            sx={{ width: 700, height: "1100px", overflowY: "auto", padding: "60px"}}
            alignItems={"start"}
            backgroundColor={"#FFF"}
            borderRadius={"16px"}
            marginBottom={"70px"}
        >
        <Heading
            color={"#3182CE"}
            textAlign={"center"}
            fontSize={"24.405px"}
            fontStyle={"normal"}
            fontWeight={"400"}
            lineHeight={"150%"}
            marginTop={"30px"}
        >
            How are we doing?
        </Heading>
        <Text
            color={"#656464"}
            fontSize={"13.016px"}
            fontStyle={"normal"}
            fontWeight={"400"}
            lineHeight={"150%"}
        >
            We are committed to providing you with the best help possible, so we
            welcome your comments. Please fill out this questionnaire. Thank you!
        </Text>
        <Divider width={"277.906px"} height={"1.011px"} background={"rgba(0, 0, 0, 0.20)"} marginBottom={"30px"}/>
        
        <OrderedList style={{ fontSize: "14px", fontWeight: "600"}} spacing={"4"}>
            {categoryOrder.map((category) => {
                const categoryQuestions = groupedQuestions[category];
                if (!categoryQuestions || categoryQuestions.length === 0) return null;

                return categoryQuestions
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((question) => (
                        <ListItem key={question.id} marginBottom={question.questionType === "rating_grid" ? "50px" : "30px"}>
                            <Heading
                                color={"#000"}
                                fontSize={"13px"}
                                fontStyle={"normal"}
                                fontWeight={"400"}
                                lineHeight={"150%"}
                                marginBottom={question.questionType === "rating_grid" ? "16px" : "16px"}
                            >
                                {question.questionText}
                            </Heading>
                            <FormControl>
                                {renderField(question)}
                            </FormControl>
                        </ListItem>
                    ));
            })}
        </OrderedList>
        </VStack>
        <HStack
            width={"750px"}
            justifyContent={"space-between"}
            marginBottom={"40px"}
        >
            <Button
            onClick={onOpen}
            color={"white"}
            backgroundColor={"var(--blackAlpha-600, rgba(0, 0, 0, 0.48))"}
            fontSize={"20px"}
            borderRadius={"6px"}
            width={"150px"}
            height={"50px"}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              void onSubmit();
            }}
            color={"white"}
            backgroundColor={"blue.500"}
            borderRadius={"6px"}
            fontSize={"20px"}
            width={"150px"}
            height={"50px"}
          >
            Submit
          </Button>
        </HStack>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
            minWidth={'388px'}
            minHeight={'267px'}
            padding={"48px"}
        >
            <ModalBody
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                <Heading
                    color={"#000"}
                    fontSize={"18px"}
                    fontStyle={"normal"}
                    fontWeight={"600"}
                    lineHeight={"28px"}
                >
                    Are you sure you want to cancel?
                </Heading>
                <Text
                    color={"#000"}
                    fontSize={"14px"}
                    fontStyle={"normal"}
                    fontWeight={"400"}
                    lineHeight={"150%"}
                >
                    You will be led back to the form to edit
                </Text>
                </Box>
            </ModalBody>
            <ModalFooter
                display={"flex"}
                gap={"10px"}
                justifyContent={"center"}
            >
            <Button
                variant="ghost"
                onClick={onClose}
                backgroundColor={"var(--blackAlpha-600, rgba(0, 0, 0, 0.48))"}
                borderRadius={"6px"}
                color={"#FFF"}
                fontSize={"18px"}
                fontStyle={"normal"}
                fontWeight={"600"}
                lineHeight={"28px"}
                width={"154px"}
                height={"48px"}
            >
                No
            </Button>
            <Button
                backgroundColor={"var(--blue-500, #3182CE)"}
                borderRadius={"6px"}
                color={"#FFF"}
                fontSize={"18px"}
                fontStyle={"normal"}
                fontWeight={"600"}
                lineHeight={"28px"}
                width={"154px"}
                height={"48px"}
                onClick={() => {
                    onCancel();
                    onClose();
                }}
            >
                Yes
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </VStack>
  );
};
