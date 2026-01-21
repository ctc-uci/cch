import {
  Box,
  Stack,
  Text,
  Button,
  Input,
  Select,
  Checkbox,
  Flex,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Badge,
  Divider,
  Tooltip,
  Icon,
  FormControl,
  FormLabel,
  Textarea,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Radio,
} from "@chakra-ui/react";
import { FormType } from "../../types/form";
import { useEffect, useState, useCallback } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import { MdDragIndicator } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

interface SortableQuestionItemProps {
  question: FormQuestion;
  onEdit: (question: FormQuestion) => void;
  onDelete: (question: FormQuestion) => void;
  onToggleVisibility: (question: FormQuestion) => void;
}

const SortableQuestionItem = ({
  question,
  onEdit,
  onDelete,
  onToggleVisibility,
}: SortableQuestionItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      p={4}
      border="1px solid"
      borderColor={question.isVisible ? "gray.200" : "red.200"}
      borderRadius="md"
      bg={question.isVisible ? "white" : "red.50"}
      cursor={isDragging ? "grabbing" : "grab"}
      {...attributes}
      {...listeners}
    >
      <Flex justifyContent="space-between" alignItems="start" mb={2}>
        <Flex alignItems="start" gap={2} flex={1}>
          <Box
            cursor="grab"
            p={2}
            _hover={{ bg: "gray.100" }}
            _active={{ cursor: "grabbing" }}
            borderRadius="md"
            display="flex"
            alignItems="center"
            color="gray.500"
            flexShrink={0}
          >
            <MdDragIndicator size={24} />
          </Box>
          <Stack spacing={1} flex={1}>
            <Flex alignItems="center" gap={2} flexWrap="wrap">
              <Text fontWeight="semibold">{question.questionText}</Text>
              {question.isCore && <Badge colorScheme="purple">Core</Badge>}
              {!question.isVisible && <Badge colorScheme="red">Hidden</Badge>}
              <Badge colorScheme="blue">{question.questionType}</Badge>
              <Badge>{question.category}</Badge>
            </Flex>
            <Text fontSize="sm" color="gray.600">
              Order: {question.displayOrder}
              {question.isRequired && " | Required"}
            </Text>
            {question.options && 
             question.questionType !== "rating_grid" &&
             Array.isArray(question.options) &&
             question.options.length > 0 && (
              <Text fontSize="sm" color="gray.500">
                Options: {(question.options as FormOption[]).map((opt) => opt.label).join(", ")}
              </Text>
            )}
            {question.questionType === "rating_grid" && question.options && (
              <Text fontSize="sm" color="gray.500">
                Rating Grid: {(question.options as RatingGridConfig).rows.length} rows × {(question.options as RatingGridConfig).columns.length} columns
              </Text>
            )}
          </Stack>
        </Flex>
        <Flex 
          gap={2}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            icon={<EditIcon />}
            aria-label="Edit"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(question);
            }}
          />
          <IconButton
            icon={<DeleteIcon />}
            aria-label="Delete"
            size="sm"
            colorScheme="red"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(question);
            }}
            isDisabled={question.isCore}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(question);
            }}
            isDisabled={question.isCore && question.isVisible}
          >
            {question.isVisible ? "Hide" : "Show"}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export const EditFormPreview = ({ formType }: { formType: FormType | null }) => {
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<FormQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { backend } = useBackendContext();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewFormData, setPreviewFormData] = useState<Record<string, string>>({});
  const [caseManagers, setCaseManagers] = useState<
    Array<{
      id: number;
      firstName?: string;
      lastName?: string;
      first_name?: string;
      last_name?: string;
    }>
  >([]);
  const formId = formType === "Initial Screeners" ? 1 : formType === "Exit Surveys" ? 2 : formType === "Success Stories" ? 3 : 4;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadQuestions = useCallback(async () => {
    if (!formType) return;
    try {
      setIsLoading(true);
      const response = await backend.get(`/formQuestions/form/${formId}?includeHidden=true`);
      const qs = Array.isArray(response.data) ? response.data : [];
      setQuestions(qs.sort((a: FormQuestion, b: FormQuestion) => a.displayOrder - b.displayOrder));
    } catch (err) {
      console.error("Failed to load questions:", err);
      toast({
        title: "Error",
        description: "Failed to load questions",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [formType, formId, backend, toast]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Load case managers for case_manager_select questions
  useEffect(() => {
    const loadCaseManagers = async () => {
      try {
        const response = await backend.get("/caseManagers");
        const cmList: Array<{
          id: number;
          firstName?: string;
          lastName?: string;
          first_name?: string;
          last_name?: string;
        }> = Array.isArray(response.data)
          ? response.data.map(
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
            ).filter((cm) => !Number.isNaN(cm.id))
          : [];
        setCaseManagers(cmList);
      } catch (err) {
        console.error("Failed to load case managers:", err);
      }
    };
    loadCaseManagers();
  }, [backend]);

  const handleEdit = (question: FormQuestion) => {
    setEditingQuestion({ ...question });
    onOpen();
  };

  const generateFieldKey = (questionText: string, excludeId?: number): string => {
    const baseKey = questionText
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    // Check if the base key already exists (excluding the current question)
    const existingKeys = questions
      .filter((q) => q.id !== excludeId)
      .map((q) => q.fieldKey);

    if (!existingKeys.includes(baseKey)) {
      return baseKey;
    }

    // If duplicate exists, append a number
    let counter = 1;
    let newKey = `${baseKey}_${counter}`;
    while (existingKeys.includes(newKey)) {
      counter++;
      newKey = `${baseKey}_${counter}`;
    }
    return newKey;
  };

  const handleAdd = () => {
    setEditingQuestion({
      id: 0,
      fieldKey: "",
      questionText: "",
      questionType: "text",
      category: "personal",
      isRequired: true,
      isVisible: true,
      isCore: false,
      displayOrder: questions.length > 0 ? Math.max(...questions.map(q => q.displayOrder)) + 1 : 1,
    });
    onOpen();
  };

  const handleSave = async () => {
    if (!editingQuestion) return;

    try {
      if (editingQuestion.questionType === "select" && !(editingQuestion.options as FormOption[])?.length) {
        toast({
          title: "Error",
          description: "Select type questions require at least one option",
          status: "error",
          duration: 3000,
        });
        return;
      }

      if (editingQuestion.questionType === "rating_grid") {
        const config = editingQuestion.options as RatingGridConfig | undefined;
        if (!config || !config.rows?.length || !config.columns?.length) {
          toast({
            title: "Error",
            description: "Rating grid questions require at least one row and one column",
            status: "error",
            duration: 3000,
          });
          return;
        }
        // Validate that all rows have labels
        if (config.rows.some((row) => !row.label.trim())) {
          toast({
            title: "Error",
            description: "All rows must have labels",
            status: "error",
            duration: 3000,
          });
          return;
        }
        // Validate that all columns have labels and values
        if (config.columns.some((col) => !col.label.trim() || !col.value.trim())) {
          toast({
            title: "Error",
            description: "All columns must have both labels and values",
            status: "error",
            duration: 3000,
          });
          return;
        }
      }

      // Check for duplicate order numbers and swap if needed
      const duplicateQuestion = questions.find(
        (q) => q.id !== editingQuestion.id && q.displayOrder === editingQuestion.displayOrder
      );

      if (duplicateQuestion && editingQuestion.id !== 0) {
        // Swap the order numbers - get the original order of the question being edited
        const originalQuestion = questions.find((q) => q.id === editingQuestion.id);
        const originalOrder = originalQuestion?.displayOrder ?? editingQuestion.displayOrder;

        // Update the duplicate question with the original order of the question being edited
        await backend.put(`/formQuestions/${duplicateQuestion.id}`, {
          field_key: duplicateQuestion.fieldKey,
          question_text: duplicateQuestion.questionText,
          question_type: duplicateQuestion.questionType,
          category: duplicateQuestion.category,
          options: duplicateQuestion.options || null,
          is_required: duplicateQuestion.isRequired,
          is_visible: duplicateQuestion.isVisible,
          is_core: duplicateQuestion.isCore,
          display_order: originalOrder,
        });

        toast({
          title: "Order Swapped",
          description: `Order numbers swapped with "${duplicateQuestion.questionText}"`,
          status: "info",
          duration: 3000,
        });
      }

      if (editingQuestion.id === 0) {
        // Create new question
        await backend.post("/formQuestions", {
          field_key: editingQuestion.fieldKey,
          question_text: editingQuestion.questionText,
          question_type: editingQuestion.questionType,
          category: editingQuestion.category,
          options: editingQuestion.options || null,
          is_required: editingQuestion.isRequired,
          is_visible: editingQuestion.isVisible,
          is_core: editingQuestion.isCore,
          display_order: editingQuestion.displayOrder,
          form_id: formId,
        });
        toast({
          title: "Success",
          description: "Question created successfully",
          status: "success",
          duration: 3000,
        });
      } else {
        // Update existing question
        await backend.put(`/formQuestions/${editingQuestion.id}`, {
          field_key: editingQuestion.fieldKey,
          question_text: editingQuestion.questionText,
          question_type: editingQuestion.questionType,
          category: editingQuestion.category,
          options: editingQuestion.options || null,
          is_required: editingQuestion.isRequired,
          is_visible: editingQuestion.isVisible,
          is_core: editingQuestion.isCore,
          display_order: editingQuestion.displayOrder,
        });
        if (!duplicateQuestion) {
          toast({
            title: "Success",
            description: "Question updated successfully",
            status: "success",
            duration: 3000,
          });
        }
      }
      onClose();
      setEditingQuestion(null);
      loadQuestions();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to save question",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleDelete = async (question: FormQuestion) => {
    if (question.isCore) {
      toast({
        title: "Cannot Delete",
        description: "Core questions cannot be deleted",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      await backend.delete(`/formQuestions/${question.id}`);
      toast({
        title: "Success",
        description: "Question deleted successfully",
        status: "success",
        duration: 3000,
      });
      loadQuestions();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      const errorMsg = error.response?.data?.error || "Failed to delete question";
      if (errorMsg.includes("existing responses")) {
        // Try soft delete instead
        try {
          await backend.patch(`/formQuestions/${question.id}/visibility`, {
            is_visible: false,
          });
          toast({
            title: "Question Hidden",
            description: "Question has responses, so it was hidden instead of deleted",
            status: "info",
            duration: 3000,
          });
          loadQuestions();
        } catch {
          toast({
            title: "Error",
            description: errorMsg,
            status: "error",
            duration: 3000,
          });
        }
      } else {
        toast({
          title: "Error",
          description: errorMsg,
          status: "error",
          duration: 3000,
        });
      }
    }
  };

  const handleToggleVisibility = async (question: FormQuestion) => {
    if (question.isCore && question.isVisible) {
      toast({
        title: "Cannot Hide",
        description: "Core questions cannot be hidden",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      await backend.patch(`/formQuestions/${question.id}/visibility`, {
        is_visible: !question.isVisible,
      });
      toast({
        title: "Success",
        description: question.isVisible ? "Question hidden" : "Question shown",
        status: "success",
        duration: 3000,
      });
      loadQuestions();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to toggle visibility",
        status: "error",
        duration: 3000,
      });
    }
  };

  const addOption = () => {
    if (!editingQuestion || editingQuestion.questionType !== "select") return;
    const currentOptions = editingQuestion.options as FormOption[] | undefined;
    setEditingQuestion({
      ...editingQuestion,
      options: [...(currentOptions || []), { value: "", label: "" }],
    });
  };

  const updateOption = (index: number, field: "value" | "label", value: string) => {
    if (!editingQuestion || editingQuestion.questionType !== "select" || !editingQuestion.options) return;
    const currentOptions = editingQuestion.options as FormOption[];
    const newOptions = [...currentOptions];
    const currentOption = newOptions[index];
    if (!currentOption) return;
    newOptions[index] = { 
      value: field === "value" ? value : (currentOption.value || ""),
      label: field === "label" ? value : (currentOption.label || ""),
    };
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };

  const removeOption = (index: number) => {
    if (!editingQuestion || editingQuestion.questionType !== "select" || !editingQuestion.options) return;
    const currentOptions = editingQuestion.options as FormOption[];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const newQuestions = arrayMove(questions, oldIndex, newIndex);
    
    // Update display orders based on new positions (starting from 1)
    const updatedQuestions = newQuestions.map((question, index) => ({
      ...question,
      displayOrder: index + 1,
    }));

    // Optimistically update UI
    setQuestions(updatedQuestions);

    try {
      // Send reorder request to backend
      const orders = updatedQuestions.map((q) => ({
        id: q.id,
        display_order: q.displayOrder,
      }));

      await backend.patch("/formQuestions/reorder", { orders });
      
      toast({
        title: "Success",
        description: "Question order updated",
        status: "success",
        duration: 2000,
      });
    } catch (err) {
      // Revert on error
      setQuestions(questions);
      const error = err as { response?: { data?: { error?: string } } };
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update question order",
        status: "error",
        duration: 3000,
      });
    }
  };

  if (!formType) {
    return (
      <Stack border="1.5px solid rgb(87, 134, 178)" borderRadius="md" p={4} height="100%" width="100%">
        <Text fontSize="13pt" fontWeight="bold">Select a Form to Edit</Text>
      </Stack>
    );
  }

  const renderPreviewField = (question: FormQuestion) => {
    const { fieldKey, questionType, options, questionText } = question;
    const value = previewFormData[fieldKey] || "";

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
                            setPreviewFormData({
                              ...previewFormData,
                              [fieldKey]: JSON.stringify(newData),
                            });
                          }}
                          sx={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "6px",
                            border: "2px solid",
                            borderColor: "gray.300",
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
          </Box>
        );
      }

      case "case_manager_select":
        return (
          <Select
            placeholder="Select case manager"
            value={value}
            onChange={(e) => setPreviewFormData({ ...previewFormData, [fieldKey]: e.target.value })}
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

      case "select":
        return (
          <Select
            placeholder="Select option"
            value={value}
            onChange={(e) => setPreviewFormData({ ...previewFormData, [fieldKey]: e.target.value })}
          >
            {(options as FormOption[])?.map((opt) => (
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
            onChange={(e) => setPreviewFormData({ ...previewFormData, [fieldKey]: e.target.value })}
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
            onChange={(e) => setPreviewFormData({ ...previewFormData, [fieldKey]: e.target.value })}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={`Enter ${questionText.toLowerCase()}`}
            value={value}
            onChange={(e) => setPreviewFormData({ ...previewFormData, [fieldKey]: e.target.value })}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={`Enter ${questionText.toLowerCase()}`}
            value={value}
            onChange={(e) => setPreviewFormData({ ...previewFormData, [fieldKey]: e.target.value })}
          />
        );

      case "text":
      default:
        return (
          <Input
            placeholder={`Enter ${questionText.toLowerCase()}`}
            value={value}
            onChange={(e) => setPreviewFormData({ ...previewFormData, [fieldKey]: e.target.value })}
          />
        );
    }
  };

  const handlePreviewToggle = () => {
    if (!isPreviewMode) {
      // Initialize preview form data when entering preview mode
      const initialData: Record<string, string> = {};
      questions.forEach((q) => {
        if (q.questionType === "rating_grid") {
          initialData[q.fieldKey] = "{}";
        } else {
          initialData[q.fieldKey] = "";
        }
      });
      setPreviewFormData(initialData);
    }
    setIsPreviewMode(!isPreviewMode);
  };

  const categoryNames: Record<string, string> = {
    personal: "Personal Information",
    contact: "Contact Information",
    program: "Program Information",
    demographics: "Demographics",
    housing: "Housing History",
    exit: "Exit Information",
  };

  const categoryOrder = [
    "personal",
    "contact",
    "program",
    "demographics",
    "housing",
    "exit",
  ];

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

  // Forms that support preview mode
  const previewableForms: FormType[] = [
    "Initial Screeners",
    "Exit Surveys",
    "Success Stories",
    "Random Client Surveys",
  ];

  // Preview mode view
  if (isPreviewMode && formType && previewableForms.includes(formType)) {
    return (
      <Stack border="1.5px solid rgb(87, 134, 178)" borderRadius="md" p={4} height="100%" width="100%" spacing={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Preview: {formType} Form</Heading>
          <Button colorScheme="blue" onClick={handlePreviewToggle} size="sm">
            Back to Edit
          </Button>
        </Flex>

        <Divider />

        <Stack spacing={6} overflowY="auto" flex={1}>
          {categoryOrder.map((category) => {
            const categoryQuestions = groupedQuestions[category];
            if (!categoryQuestions || categoryQuestions.length === 0) return null;

            return (
              <Box key={category}>
                <Heading size="sm" mb={4} color="blue.600">
                  {categoryNames[category] || category}
                </Heading>
                <Stack spacing={4}>
                  {categoryQuestions
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((question) => (
                      <FormControl key={question.id} isRequired={question.isRequired}>
                        <FormLabel>{question.questionText}</FormLabel>
                        {renderPreviewField(question)}
                      </FormControl>
                    ))}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    );
  }

  // Edit mode view
  return (
    <Stack border="1.5px solid rgb(87, 134, 178)" borderRadius="md" p={4} height="100%" width="100%" spacing={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="13pt" fontWeight="bold">Edit {formType} Form</Text>
        <Flex gap={2}>
          {formType && previewableForms.includes(formType) && (
            <Button colorScheme="blue" onClick={handlePreviewToggle} size="sm">
              Preview Form
            </Button>
          )}
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAdd} size="sm">
            Add Question
          </Button>
        </Flex>
      </Flex>

      <Divider />

      <Stack spacing={3} overflowY="auto" flex={1}>
        {isLoading ? (
          <Text>Loading questions...</Text>
        ) : questions.length === 0 ? (
          <Text color="gray.500">No questions found. Click "Add Question" to create one.</Text>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={questions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {questions.map((question) => (
                <SortableQuestionItem
                  key={question.id}
                  question={question}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingQuestion?.id === 0 ? "Add New Question" : "Edit Question"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingQuestion && (
              <Stack spacing={4}>
                <Box>
                  <Text mb={1} fontSize="sm" fontWeight="medium">
                    Question Text
                  </Text>
                  <Input
                    value={editingQuestion.questionText}
                    onChange={(e) => {
                      const newQuestionText = e.target.value;
                      const newFieldKey = editingQuestion.id === 0 
                        ? generateFieldKey(newQuestionText, editingQuestion.id)
                        : editingQuestion.fieldKey;
                      setEditingQuestion({ 
                        ...editingQuestion, 
                        questionText: newQuestionText,
                        fieldKey: newFieldKey,
                      });
                    }}
                    placeholder="Enter question text"
                  />
                </Box>
                {/* <Box>
                  <Text mb={1} fontSize="sm" fontWeight="medium">
                    Field Key
                  </Text>
                  <Input
                    value={editingQuestion.fieldKey}
                    placeholder="Auto-generated from question text"
                    isDisabled={true}
                    bg="gray.50"
                  />
                </Box> */}
                <Flex gap={4}>
                  <Box flex={1}>
                    <Text mb={1} fontSize="sm" fontWeight="medium">
                      Question Type
                    </Text>
                    <Select
                      value={editingQuestion.questionType}
                      onChange={(e) => {
                        const newType = e.target.value as FormQuestion["questionType"];
                        let newOptions: FormOption[] | RatingGridConfig | undefined;
                        
                        if (newType === "select") {
                          newOptions = [{ value: "", label: "" }];
                        } else if (newType === "rating_grid") {
                          newOptions = {
                            rows: [{ key: "row1", label: "" }],
                            columns: [
                              { value: "1", label: "Very Poor" },
                              { value: "2", label: "Poor" },
                              { value: "3", label: "Neutral" },
                              { value: "4", label: "Good" },
                              { value: "5", label: "Excellent" },
                            ],
                          };
                        } else {
                          newOptions = undefined;
                        }
                        
                        setEditingQuestion({
                          ...editingQuestion,
                          questionType: newType,
                          options: newOptions,
                        });
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="date">Date</option>
                      <option value="select">Select</option>
                      <option value="rating_grid">Rating Grid</option>
                      <option value="case_manager_select">Case Manager Select</option>
                    </Select>
                  </Box>
                  <Box flex={1}>
                    <Text mb={1} fontSize="sm" fontWeight="medium">
                      Category
                    </Text>
                    <Select
                      value={editingQuestion.category}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, category: e.target.value })
                      }
                    >
                      <option value="personal">Personal</option>
                      <option value="contact">Contact</option>
                      <option value="housing">Housing</option>
                      <option value="demographics">Demographics</option>
                      <option value="program">Program</option>
                      <option value="exit">Exit</option>
                    </Select>
                  </Box>
                </Flex>
                {editingQuestion.questionType === "case_manager_select" && (
                  <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                    <Flex alignItems="start" gap={2}>
                      <Icon as={FaInfoCircle} color="blue.500" mt={0.5} />
                      <Text fontSize="sm" color="blue.700">
                        This question type will automatically populate with all case managers from the database. 
                        No manual configuration needed.
                      </Text>
                    </Flex>
                  </Box>
                )}
                {editingQuestion.questionType === "select" && (
                  <Box>
                    <Flex justifyContent="space-between" alignItems="center" mb={2}>
                      <Text fontSize="sm" fontWeight="medium">
                        Options
                      </Text>
                      <Button size="xs" onClick={addOption}>
                        Add Option
                      </Button>
                    </Flex>
                    <Stack spacing={2}>
                      {(editingQuestion.options as FormOption[])?.map((option, index) => (
                        <Flex key={index} gap={2}>
                          <Input
                            placeholder="Value"
                            value={option.value}
                            onChange={(e) => updateOption(index, "value", e.target.value)}
                            size="sm"
                          />
                          <Input
                            placeholder="Label"
                            value={option.label}
                            onChange={(e) => updateOption(index, "label", e.target.value)}
                            size="sm"
                          />
                          <IconButton
                            icon={<DeleteIcon />}
                            aria-label="Remove option"
                            size="sm"
                            onClick={() => removeOption(index)}
                          />
                        </Flex>
                      ))}
                    </Stack>
                  </Box>
                )}
                {editingQuestion.questionType === "rating_grid" && (
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={3}>
                      Rating Grid Configuration
                    </Text>
                    <Stack spacing={4}>
                      <Box>
                        <Flex justifyContent="space-between" alignItems="center" mb={2}>
                          <Text fontSize="sm" fontWeight="medium">
                            Rows (Categories/Questions)
                          </Text>
                          <Button
                            size="xs"
                            onClick={() => {
                              if (!editingQuestion.options) return;
                              const config = editingQuestion.options as RatingGridConfig;
                              const newRows = [
                                ...config.rows,
                                { key: `row${config.rows.length + 1}`, label: "" },
                              ];
                              setEditingQuestion({
                                ...editingQuestion,
                                options: { ...config, rows: newRows },
                              });
                            }}
                          >
                            Add Row
                          </Button>
                        </Flex>
                        <Stack spacing={2}>
                          {(editingQuestion.options as RatingGridConfig)?.rows.map((row, index) => (
                            <Flex key={row.key} gap={2}>
                              <Input
                                placeholder="Row label (e.g., The service you received from your case manager.)"
                                value={row.label}
                                onChange={(e) => {
                                  if (!editingQuestion.options) return;
                                  const config = editingQuestion.options as RatingGridConfig;
                                  const newRows = [...config.rows];
                                  newRows[index] = { ...row, label: e.target.value };
                                  setEditingQuestion({
                                    ...editingQuestion,
                                    options: { ...config, rows: newRows },
                                  });
                                }}
                                size="sm"
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                aria-label="Remove row"
                                size="sm"
                                onClick={() => {
                                  if (!editingQuestion.options) return;
                                  const config = editingQuestion.options as RatingGridConfig;
                                  const newRows = config.rows.filter((_, i) => i !== index);
                                  setEditingQuestion({
                                    ...editingQuestion,
                                    options: { ...config, rows: newRows },
                                  });
                                }}
                              />
                            </Flex>
                          ))}
                        </Stack>
                      </Box>
                      <Box>
                        <Flex justifyContent="space-between" alignItems="center" mb={2}>
                          <Text fontSize="sm" fontWeight="medium">
                            Columns (Rating Options)
                          </Text>
                          <Button
                            size="xs"
                            onClick={() => {
                              if (!editingQuestion.options) return;
                              const config = editingQuestion.options as RatingGridConfig;
                              const newColumns = [
                                ...config.columns,
                                { value: `${config.columns.length + 1}`, label: "" },
                              ];
                              setEditingQuestion({
                                ...editingQuestion,
                                options: { ...config, columns: newColumns },
                              });
                            }}
                          >
                            Add Column
                          </Button>
                        </Flex>
                        <Stack spacing={2}>
                          {(editingQuestion.options as RatingGridConfig)?.columns.map((col, index) => (
                            <Flex key={col.value} gap={2}>
                              <Input
                                placeholder="Value"
                                value={col.value}
                                onChange={(e) => {
                                  if (!editingQuestion.options) return;
                                  const config = editingQuestion.options as RatingGridConfig;
                                  const newColumns = [...config.columns];
                                  newColumns[index] = { ...col, value: e.target.value };
                                  setEditingQuestion({
                                    ...editingQuestion,
                                    options: { ...config, columns: newColumns },
                                  });
                                }}
                                size="sm"
                                width="100px"
                              />
                              <Input
                                placeholder="Label (e.g., Very Poor)"
                                value={col.label}
                                onChange={(e) => {
                                  if (!editingQuestion.options) return;
                                  const config = editingQuestion.options as RatingGridConfig;
                                  const newColumns = [...config.columns];
                                  newColumns[index] = { ...col, label: e.target.value };
                                  setEditingQuestion({
                                    ...editingQuestion,
                                    options: { ...config, columns: newColumns },
                                  });
                                }}
                                size="sm"
                                flex={1}
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                aria-label="Remove column"
                                size="sm"
                                onClick={() => {
                                  if (!editingQuestion.options) return;
                                  const config = editingQuestion.options as RatingGridConfig;
                                  const newColumns = config.columns.filter((_, i) => i !== index);
                                  setEditingQuestion({
                                    ...editingQuestion,
                                    options: { ...config, columns: newColumns },
                                  });
                                }}
                              />
                            </Flex>
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                )}
                <Flex gap={4}>
                  <Box>
                    <Flex alignItems="center" gap={1} mb={1}>
                      <Text fontSize="sm" fontWeight="medium">
                        Display Order
                      </Text>
                      <Tooltip
                        label="If this order number already exists, it will swap with that question's order number"
                        placement="top"
                        hasArrow
                        closeOnClick={false}
                      >
                        <Box
                          as="span"
                          display="inline-flex"
                          alignItems="center"
                          lineHeight={1}
                          tabIndex={0}
                        >
                          <Icon
                            as={FaInfoCircle}
                            boxSize={3}
                            color="gray.500"
                            _hover={{ color: "gray.700" }}
                          />
                        </Box>
                      </Tooltip>
                    </Flex>
                    <Input
                      type="number"
                      value={editingQuestion.displayOrder}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          displayOrder: parseInt(e.target.value) || 0,
                        })
                      }
                      width="100px"
                    />
                  </Box>
                </Flex>
                <Flex gap={4}>
                  <Checkbox
                    isChecked={editingQuestion.isRequired}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, isRequired: e.target.checked })
                    }
                  >
                    Required
                  </Checkbox>
                  <Checkbox
                    isChecked={editingQuestion.isVisible}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, isVisible: e.target.checked })
                    }
                    isDisabled={editingQuestion.isCore}
                  >
                    Visible
                  </Checkbox>
                  <Checkbox
                    isChecked={editingQuestion.isCore}
                    onChange={(e) => {
                      const newCoreStatus = e.target.checked;
                      setEditingQuestion({ 
                        ...editingQuestion, 
                        isCore: newCoreStatus,
                        isVisible: newCoreStatus ? editingQuestion.isVisible : true,
                      });
                    }}
                  >
                    Core Question
                  </Checkbox>
                </Flex>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default EditFormPreview;