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
            {question.options && question.options.length > 0 && (
              <Text fontSize="sm" color="gray.500">
                Options: {question.options.map((opt) => opt.label).join(", ")}
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
      const response = await backend.get(`/formQuestions?includeHidden=true`);
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
  }, [formType, backend, toast]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

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
      if (editingQuestion.questionType === "select" && !editingQuestion.options?.length) {
        toast({
          title: "Error",
          description: "Select type questions require at least one option",
          status: "error",
          duration: 3000,
        });
        return;
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
    if (!editingQuestion) return;
    setEditingQuestion({
      ...editingQuestion,
      options: [...(editingQuestion.options || []), { value: "", label: "" }],
    });
  };

  const updateOption = (index: number, field: "value" | "label", value: string) => {
    if (!editingQuestion || !editingQuestion.options) return;
    const newOptions = [...editingQuestion.options];
    const currentOption = newOptions[index];
    if (!currentOption) return;
    newOptions[index] = { 
      value: field === "value" ? value : (currentOption.value || ""),
      label: field === "label" ? value : (currentOption.label || ""),
    };
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };

  const removeOption = (index: number) => {
    if (!editingQuestion || !editingQuestion.options) return;
    const newOptions = editingQuestion.options.filter((_, i) => i !== index);
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

  return (
    <Stack border="1.5px solid rgb(87, 134, 178)" borderRadius="md" p={4} height="100%" width="100%" spacing={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="13pt" fontWeight="bold">Edit {formType} Form</Text>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAdd} size="sm">
          Add Question
        </Button>
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
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          questionType: e.target.value as FormQuestion["questionType"],
                          options: e.target.value === "select" ? [{ value: "", label: "" }] : undefined,
                        })
                      }
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="date">Date</option>
                      <option value="select">Select</option>
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
                      {editingQuestion.options?.map((option, index) => (
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