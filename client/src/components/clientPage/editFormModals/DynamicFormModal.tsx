import { useEffect, useState } from "react";
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
  Textarea,
  Radio,
} from "@chakra-ui/react";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import PrintForm from "../../printForm/PrintForm";

interface FormQuestion {
  id: number;
  fieldKey: string;
  questionText: string;
  questionType: string;
  displayOrder: number;
  isVisible: boolean;
  isRequired: boolean;
  options?: unknown;
}

interface DynamicFormModalProps {
  form: { id: number | string; type: string; title?: string; date?: string | Date };
  isOpen: boolean;
  onClose: () => void;
  formId: number; // form_id: 1=Initial Interview, 2=Exit Survey, 3=Success Story
}

export default function DynamicFormModal({
  form,
  isOpen,
  onClose,
  formId,
}: DynamicFormModalProps) {
  const { backend } = useBackendContext();
  const toast = useToast();

  const [formQuestions, setFormQuestions] = useState<FormQuestion[]>([]);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState<Record<string, unknown>>({});

  const cellHeight = "40px";

  // Check if form.id is a UUID (session-based form)
  const isUUID = typeof form.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(form.id);

  useEffect(() => {
    if (!isOpen || !form.id) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch form questions
        const questionsResponse = await backend.get(`/intakeResponses/form/${formId}/questions?includeHidden=false`);
        const questions = questionsResponse.data || [];
        setFormQuestions(questions.filter((q: FormQuestion) => q.isVisible).sort((a: FormQuestion, b: FormQuestion) => a.displayOrder - b.displayOrder));

        // Fetch form data
        if (isUUID) {
          // Fetch from intake_responses using session_id
          const response = await backend.get(`/intakeResponses/session/${form.id}`);
          setFormData(response.data || {});
        } else {
          // Fetch from old tables
          let endpoint = '';
          if (formId === 1) {
            endpoint = `/initialInterview/id/${form.id}`;
          } else if (formId === 2) {
            endpoint = `/exitSurvey/${form.id}`;
          } else if (formId === 3) {
            endpoint = `/successStory/${form.id}`;
          }
          
          if (endpoint) {
            const response = await backend.get(endpoint);
            const data = formId === 2 ? response.data?.data?.[0] : response.data?.[0] || response.data;
            setFormData(data || {});
          }
        }
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast({
          title: "Error loading form",
          description: error.message || "Failed to load form data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, form.id, formId, backend, toast, isUUID]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEdits({});
    }
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (fieldKey: string, value: unknown) => {
    setEdits((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleSave = async () => {
    try {
      if (isUUID) {
        // Update dynamic form via intake_responses
        // Only send fields that are in form_questions
        const payload: Record<string, unknown> = {};
        formQuestions.forEach((q) => {
          const camelKey = q.fieldKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          const value = edits[q.fieldKey] ?? edits[camelKey] ?? formData[camelKey] ?? formData[q.fieldKey];
          if (value !== undefined && value !== null) {
            payload[q.fieldKey] = value;
          }
        });
        
        await backend.put(`/intakeResponses/session/${form.id}`, payload);
      } else {
        // Update old table forms - convert edits to match old table format
        const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        const payload: Record<string, unknown> = { ...formData };
        
        // Apply edits, converting camelCase keys to snake_case for old tables
        Object.entries(edits).forEach(([key, value]) => {
          const snakeKey = toSnakeCase(key);
          // Try to find matching field_key in form_questions
          const question = formQuestions.find(q => q.fieldKey === key || q.fieldKey === snakeKey);
          if (question) {
            payload[question.fieldKey] = value;
          } else {
            // Fallback: use snake_case version
            payload[snakeKey] = value;
          }
        });
        
        let endpoint = '';
        if (formId === 1) {
          endpoint = `/initialInterview/${form.id}`;
        } else if (formId === 2) {
          endpoint = `/exitSurvey/${form.id}`;
        } else if (formId === 3) {
          endpoint = `/successStory/${form.id}`;
        }
        
        if (endpoint) {
          await backend.put(endpoint, payload);
        }
      }

      setFormData({ ...formData, ...edits });
      setEdits({});
      setIsEditing(false);
      toast({
        title: "Form saved successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast({
        title: "Error saving form",
        description: error.message || "Failed to save form",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getFieldValue = (question: FormQuestion): unknown => {
    // Try multiple key formats: fieldKey (snake_case), camelCase, and edits
    const camelKey = question.fieldKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Check edits first (priority)
    if (edits[question.fieldKey] !== undefined) {
      return edits[question.fieldKey];
    }
    if (edits[camelKey] !== undefined) {
      return edits[camelKey];
    }
    
    // Then check formData (check both camelCase and snake_case)
    return formData[camelKey] ?? formData[question.fieldKey] ?? formData[question.fieldKey.toLowerCase()] ?? '';
  };

  const renderField = (question: FormQuestion) => {
    const value = getFieldValue(question);
    const displayValue = value === null || value === undefined ? '' : String(value);

    if (!isEditing) {
      // Display mode
      if (question.questionType === 'date' && displayValue) {
        // Parse date string as local date to avoid timezone issues
        const dateStr = String(displayValue).split('T')[0];
        if (dateStr) {
          const parts = dateStr.split('-');
          if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
            const day = parseInt(parts[2], 10);
            const localDate = new Date(year, month, day);
            return localDate.toLocaleDateString("en-US");
          }
        }
        return new Date(displayValue).toLocaleDateString("en-US");
      }
      if (question.questionType === 'boolean') {
        return displayValue === 'true' || displayValue === 'yes' ? 'Yes' : displayValue === 'false' || displayValue === 'no' ? 'No' : displayValue;
      }
      if (question.questionType === 'rating_grid' && value && typeof value === 'object') {
        const gridData = value as Record<string, unknown>;
        const gridConfig = question.options as { rows?: Array<{ key: string; label: string }>; columns?: Array<{ value: string; label: string }> } | undefined;
        if (gridConfig?.rows) {
          return gridConfig.rows.map(row => {
            const rowValue = gridData[row.key];
            const column = gridConfig.columns?.find(col => col.value === rowValue);
            return `${row.label}: ${column ? column.label : String(rowValue || '')}`;
          }).join(', ');
        }
        return JSON.stringify(value);
      }
      return displayValue;
    }

    // Edit mode
    if (question.questionType === 'select' && question.options && Array.isArray(question.options)) {
      return (
        <Select
          variant="unstyled"
          size="sm"
          w="100%"
          h={cellHeight}
          bg="transparent"
          border="1px solid"
          borderColor="#3182CE"
          borderRadius="0"
          px={3}
          value={displayValue}
          onChange={(e) => handleFieldChange(question.fieldKey, e.target.value)}
        >
          {(question.options as Array<{ value: string; label: string }>).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      );
    }

    if (question.questionType === 'boolean') {
      return (
        <Select
          variant="unstyled"
          size="sm"
          w="100%"
          h={cellHeight}
          bg="transparent"
          border="1px solid"
          borderColor="#3182CE"
          borderRadius="0"
          px={3}
          value={displayValue === 'true' || displayValue === 'yes' ? 'true' : 'false'}
          onChange={(e) => handleFieldChange(question.fieldKey, e.target.value === 'true')}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </Select>
      );
    }

    if (question.questionType === 'date') {
      // Parse date string as local date to avoid timezone issues
      let dateInputValue = '';
      if (displayValue) {
        const dateStr = String(displayValue).split('T')[0];
        if (dateStr) {
          const parts = dateStr.split('-');
          if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
            // Use the date string directly if it's already in YYYY-MM-DD format
            dateInputValue = dateStr;
          } else {
            // Fallback: parse as local date
            const dateObj = new Date(displayValue);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            dateInputValue = `${year}-${month}-${day}`;
          }
        }
      }
      
      return (
        <Input
          variant="unstyled"
          size="sm"
          w="100%"
          h={cellHeight}
          px={3}
          border="1px solid"
          borderColor="#3182CE"
          type="date"
          value={dateInputValue}
          onChange={(e) => handleFieldChange(question.fieldKey, e.target.value)}
        />
      );
    }

    if (question.questionType === 'number') {
      return (
        <Input
          variant="unstyled"
          size="sm"
          w="100%"
          h={cellHeight}
          px={3}
          border="1px solid"
          borderColor="#3182CE"
          type="number"
          value={displayValue}
          onChange={(e) => handleFieldChange(question.fieldKey, parseFloat(e.target.value) || 0)}
        />
      );
    }

    if (question.questionType === 'textarea') {
      return (
        <Textarea
          variant="unstyled"
          size="sm"
          w="100%"
          minH={cellHeight}
          px={3}
          border="1px solid"
          borderColor="#3182CE"
          value={displayValue}
          onChange={(e) => handleFieldChange(question.fieldKey, e.target.value)}
        />
      );
    }

    if (question.questionType === 'rating_grid' && question.options) {
      const gridConfig = question.options as { rows?: Array<{ key: string; label: string }>; columns?: Array<{ value: string; label: string }> } | undefined;
      const gridData = (value && typeof value === 'object' ? value as Record<string, unknown> : {}) as Record<string, unknown>;
      
      return (
        <Box>
          {gridConfig?.rows?.map((row) => (
            <Box key={row.key} mb={2}>
              <Box mb={1} fontSize="sm" fontWeight="medium">{row.label}</Box>
              <Box display="flex" gap={2} flexWrap="wrap">
                {gridConfig.columns?.map((col) => (
                  <Radio
                    key={col.value}
                    value={col.value}
                    isChecked={gridData[row.key] === col.value}
                    onChange={() => {
                      const newGridData = { ...gridData, [row.key]: col.value };
                      handleFieldChange(question.fieldKey, newGridData);
                    }}
                  >
                    {col.label}
                  </Radio>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      );
    }

    // Default text input
    return (
      <Input
        variant="unstyled"
        size="sm"
        w="100%"
        h={cellHeight}
        px={3}
        border="1px solid"
        borderColor="#3182CE"
        type="text"
        value={displayValue}
        onChange={(e) => handleFieldChange(question.fieldKey, e.target.value)}
      />
    );
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalContent>
          <ModalHeader>Loading…</ModalHeader>
          <ModalBody>
            <Spinner />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const formattedDate = form.date ? new Date(form.date).toLocaleDateString("en-US") : '';
  const modalTitle = "Form Preview – ";
  const modalDesc = `${form.title || form.type}${formattedDate ? ` (${formattedDate})` : ''}`;

  // Filter out text_block and header types for display
  const visibleQuestions = formQuestions.filter(
    (q) => q.questionType !== 'text_block' && q.questionType !== 'header'
  );

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
          <Box mx="2.5%" display="flex" justifyContent="space-between" alignItems="center" mb={6}>
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
                  <PrintForm 
                    formType={
                      form.type === "Initial Interview" 
                        ? "Initial Screeners" 
                        : form.type
                    } 
                    formId={form.id} 
                  />
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
                {visibleQuestions.map((question) => {
                  const isRatingGrid = question.questionType === 'rating_grid';
                  const isTextarea = question.questionType === 'textarea';
                  return (
                    <Tr key={question.id}>
                      <Td p={4}>{question.questionText}</Td>
                      <Td p={4} bgColor={isEditing ? "#EDF2F7" : "white"}>
                        <Box 
                          w="100%" 
                          minH={isRatingGrid || isTextarea ? "auto" : cellHeight} 
                          display="flex" 
                          alignItems={isRatingGrid || isTextarea ? "flex-start" : "center"}
                          py={isRatingGrid || isTextarea ? 2 : 0}
                        >
                          {renderField(question)}
                        </Box>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

