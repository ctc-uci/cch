import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  HStack,
  IconButton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext.ts";
import { camelToSnakeCase } from "../../utils/camelCase.ts";
import { formatDateString } from "../../utils/dateUtils";
import { downloadCSV } from "../../utils/downloadCSV.ts";
import { CaseManagerMonthlyTableBody } from "./CaseManagerMonthlyTableBody.tsx";
import { formatDataWithLabels } from "./DataFormatter.tsx";
import { ExitSurveyTableBody } from "./ExitSurveyTableBody.tsx";
import { FrontDeskMonthlyTableBody } from "./FrontDeskTableBody.tsx";
import { InitialScreenerTableBody } from "./InitialScreenerTableBody.tsx";
import { IntakeStatisticsTableBody } from "./IntakeStatisticsTableBody.tsx";
import { RandomSurveyTableBody } from "./RandomSurveyTableBody.tsx";
import { RequestFormPreview } from "./RequestFormPreview.tsx";
import { SuccessStoryTableBody } from "./SuccessStoryTableBody.tsx";
import { DynamicFormTableBody } from "./DynamicFormTableBody.tsx";

type FormItem = {
  id: number;
  title: string;
  name?: string;
  date?: string;
  sessionId?: string; // For dynamic forms using intake_responses
  [key: string]: unknown;
};

type FormDataRecord = Record<string, unknown>;

const FormPreview = ({
  clickedFormItem,
  isOpen,
  onClose,
  refreshTable,
  setRefreshTable,
}: {
  clickedFormItem: FormItem;
  isOpen: boolean;
  onClose: () => void;
  refreshTable: boolean;
  setRefreshTable: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { backend } = useBackendContext();
  const { role } = useRoleContext();

  const {
    id: formItemId,
    title: formItemTitle,
    name: formItemName,
    date: formItemDate,
    sessionId,
  } = clickedFormItem;

  const toast = useToast();

  const [formData, setFormData] = useState<FormDataRecord>({});
  const [newFormData, setNewFormData] = useState<FormDataRecord>({});
  const [formQuestions, setFormQuestions] = useState<Array<{
    id: number;
    fieldKey: string;
    questionText: string;
    questionType: string;
    displayOrder: number;
    isVisible: boolean;
    options?: unknown;
  }>>([]);
  
  // Check if this is a dynamic form (uses intake_responses)
  const isDynamicForm = sessionId && (
    formItemTitle === "Initial Screener Form" ||
    formItemTitle === "Initial Screeners" ||
    formItemTitle === "Success Story Form" ||
    formItemTitle === "Client Exit Survey Form" ||
    formItemTitle === "Random Client Survey Form"
  );
  
  // Map form titles to form_ids
  const getFormId = (title: string): number | null => {
    if (title === "Initial Screener Form" || title === "Initial Screeners") return 1;
    if (title === "Client Exit Survey Form") return 2;
    if (title === "Success Story Form") return 3;
    if (title === "Random Client Survey Form") return 4;
    return null;
  };

  const [newFormattedModifiedData, setFormattedModifiedData] =
    useState<FormDataRecord>({});
  const [formattedFormData, setFormattedFormData] =
    useState<FormDataRecord>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitial, setIsInitial] = useState(false);
  const navigate = useNavigate();

  const handleCommentForm = async () => {
    // Only handle Initial Screener Form (form_id = 1)
    if (formItemTitle !== "Initial Screener Form" && formItemTitle !== "Initial Screeners") {
      toast({
        title: "Invalid Form Type",
        description: "Comment forms are only available for Initial Screener forms.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // For dynamic forms, use sessionId
    if (sessionId) {
      try {
        // Check if a screener comment exists for this session (we don't need the data, just checking it exists)
        await backend.get(`/screenerComment/session/${sessionId}`);
        
        // Get clientId from form data (already loaded)
        const clientId = formData.clientId || formData.client_id;
        
        if (!clientId) {
          toast({
            title: "Client Not Found",
            description: "Unable to open comment form. Client information is missing.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        // Navigate to comment form with clientId and pass sessionId and returnPath in state
        navigate(`/comment-form/${clientId}`, {
          state: { 
            sessionId: sessionId,
            returnPath: "/admin-client-forms",
          },
        });
      } catch (error: unknown) {
        // If no comment exists (404), still navigate to create a new one
        const errorStatus = (error as { response?: { status?: number } })?.response?.status;
        if (errorStatus === 404) {
          const clientId = formData.clientId || formData.client_id;
          if (clientId) {
            navigate(`/comment-form/${clientId}`, {
              state: { 
                sessionId: sessionId,
                returnPath: "/admin-client-forms",
              },
            });
          } else {
            toast({
              title: "Client Not Found",
              description: "Unable to open comment form. Client information is missing.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to check for existing comment form.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } else {
      // Legacy fallback for old forms without sessionId
      try {
        const commentId = await backend.get(`/screenerComment/interview/${formItemId}`);
        const result = commentId.data?.['result']?.[0];
        if (!result || typeof result.id === "undefined") {
          toast({
            title: "Comment Form Not Found",
            description: "No comment form is associated with this interview.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        }
        navigate(`/comment-form/${formItemId}`);
      } catch (_error) {
        toast({
          title: "Error",
          description: "Failed to load comment form.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }

  const renderTableBody = () => {
    // Use dynamic table body for dynamic forms
    if (isDynamicForm && formQuestions.length > 0) {
      return (
        <DynamicFormTableBody
          formData={newFormData}
          formQuestions={formQuestions}
          handleChange={handleChange}
        />
      );
    }

    // Legacy table bodies for non-dynamic forms
    switch (formItemTitle) {
      case "Initial Screeners":
        return (
          <InitialScreenerTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
      case "Client Tracking Statistics (Intake Statistics)":
        return (
          <IntakeStatisticsTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
      case "Front Desk Monthly Statistics":
        return (
          <FrontDeskMonthlyTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
      case "Case Manager Monthly Statistics":
        return (
          <CaseManagerMonthlyTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
      case "Exit Surveys":
        return (
          <ExitSurveyTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
      case "Success Stories":
        return (
          <SuccessStoryTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
      case "Random Client Surveys":
        return (
          <RandomSurveyTableBody
            formData={newFormData}
            handleChange={handleChange}
          />
        );
    }
  };

  useEffect(() => {
    setFormData({});
    setNewFormData({});
    setFormattedFormData({});
    setFormattedModifiedData({});
    setIsEditing(false);
    setIsLoading(true);

    setIsInitial(formItemTitle === "Initial Screeners" || formItemTitle === "Initial Screener Form");
    const getData = async () => {
      // Handle dynamic forms (intake_responses)
      if (isDynamicForm && sessionId) {
        try {
          // Fetch form response by session_id
          const response = await backend.get(`/intakeResponses/session/${sessionId}`);
          const normalData = response.data;

          if (!normalData || typeof normalData !== "object") {
            setFormData({});
            setNewFormData({});
            setFormattedFormData({});
            setFormattedModifiedData({});
            setIsLoading(false);
            return;
          }

          // Fetch form questions to build dynamic display
          const formId = getFormId(formItemTitle);
          if (formId) {
            const questionsResponse = await backend.get(`/intakeResponses/form/${formId}/questions`);
            const questions = questionsResponse.data || [];
            setFormQuestions(questions);

            // Format data using question texts as labels
            const formatted: FormDataRecord = {};

            questions
              .filter((q: { isVisible: boolean; questionType: string }) => 
                q.isVisible && q.questionType !== 'text_block' && q.questionType !== 'header')
              .sort((a: { displayOrder: number }, b: { displayOrder: number }) => 
                a.displayOrder - b.displayOrder)
              .forEach((question: { fieldKey: string; questionText: string; questionType: string; options?: unknown }) => {
                const camelKey = question.fieldKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                const value = normalData[camelKey] ?? normalData[question.fieldKey] ?? "";
                
                // For rating grids, expand into separate rows for each grid row
                if (question.questionType === "rating_grid" && value && typeof value === "object" && !Array.isArray(value) && value !== null) {
                  const gridConfig = question.options as { rows?: Array<{ key: string; label: string }>; columns?: Array<{ value: string; label: string }> } | undefined;
                  if (gridConfig?.rows && gridConfig?.columns && gridConfig.columns.length > 0) {
                    const gridData = value as Record<string, unknown>;
                    gridConfig.rows.forEach((row) => {
                      const rowValue = gridData[row.key];
                      if (rowValue !== undefined && rowValue !== null) {
                        const column = gridConfig.columns?.find(col => col.value === rowValue);
                        const displayValue = column ? column.label : String(rowValue);
                        formatted[`${question.questionText} - ${row.label}`] = displayValue;
                      }
                    });
                  } else {
                    formatted[question.questionText] = value;
                  }
                } else {
                  formatted[question.questionText] = value;
                }
              });

            setFormData({ ...normalData });
            setNewFormData({ ...normalData });
            setFormattedFormData(formatted);
            setFormattedModifiedData(formatted);
          }
        } catch (error) {
          console.error("Error fetching dynamic form data:", error);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Handle legacy forms
      let endpoint = "";
      switch (formItemTitle) {
        case "Initial Screeners":
          endpoint = `/initialInterview/get-interview/${formItemId}`;
          break;
        case "Client Tracking Statistics (Intake Statistics)":
          endpoint = `/intakeStatsForm/${formItemId}`;
          break;
        case "Front Desk Monthly Statistics":
          endpoint = `/frontDesk/${formItemId}`;
          break;
        case "Case Manager Monthly Statistics":
          endpoint = `/caseManagerMonthlyStats/${formItemId}`;
          break;
        case "Exit Surveys":
          endpoint = `/exitSurvey/${formItemId}`;
          break;
        case "Success Stories":
          endpoint = `/successStory/${formItemId}`;
          break;
        case "Random Client Surveys":
          endpoint = `/randomSurvey/${formItemId}`;
          break;
        default:
          console.error("Unknown form title:", formItemTitle);
          setIsLoading(false);
          return;
      }

      try {
        const response = await backend.get(endpoint);
        let normalData: FormDataRecord | undefined = response.data?.[0];

        if (formItemTitle === "Exit Surveys") {
          normalData = response.data?.data?.[0];
        } else if (formItemTitle === "Random Client Surveys") {
          normalData = response.data;
        }

        if (!normalData || typeof normalData !== "object") {
          setFormData({});
          setNewFormData({});
          setFormattedFormData({});
          setFormattedModifiedData({});
          return;
        }

        const data = formatDataWithLabels(normalData, formItemTitle);
        setFormData({ ...normalData });
        setNewFormData({ ...normalData });
        setFormattedFormData(data); // human readable keys
        setFormattedModifiedData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [backend, formItemId, formItemTitle, refreshTable, isDynamicForm, sessionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Convert value based on input type
    let processedValue: unknown = value;
    if (type === "number") {
      processedValue = value === "" ? null : parseFloat(value);
    } else if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    setNewFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSaveForm = async () => {
    // Handle dynamic forms (intake_responses)
    if (isDynamicForm && sessionId) {
      try {
        const payload: Record<string, unknown> = {};

        // Map form questions to get correct field_key format
        formQuestions.forEach((question) => {
          const camelKey = question.fieldKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          const value = newFormData[camelKey] ?? newFormData[question.fieldKey];
          
          if (value !== undefined && value !== null) {
            // Use the original field_key from the question
            payload[question.fieldKey] = value;
          }
        });

        await backend.put(`/intakeResponses/session/${sessionId}`, payload);

        toast({
          title: "Successfully submitted form",
          description: `${formItemTitle} Form - ${new Date().toLocaleString()}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        setRefreshTable((prev) => !prev);
        setIsEditing(false);
        
        // Reload the data to reflect changes
        const response = await backend.get(`/intakeResponses/session/${sessionId}`);
        const normalData = response.data;
        const formId = getFormId(formItemTitle);
        if (formId && normalData) {
          const questionsResponse = await backend.get(`/intakeResponses/form/${formId}/questions`);
          const questions = questionsResponse.data || [];
          setFormQuestions(questions);

          const formatted: FormDataRecord = {};
          questions
            .filter((q: { isVisible: boolean; questionType: string }) => 
              q.isVisible && q.questionType !== 'text_block' && q.questionType !== 'header')
            .sort((a: { displayOrder: number }, b: { displayOrder: number }) => 
              a.displayOrder - b.displayOrder)
            .forEach((question: { fieldKey: string; questionText: string; questionType: string; options?: unknown }) => {
              const camelKey = question.fieldKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
              const value = normalData[camelKey] ?? normalData[question.fieldKey] ?? "";
              
              if (question.questionType === "rating_grid" && value && typeof value === "object" && !Array.isArray(value) && value !== null) {
                const gridConfig = question.options as { rows?: Array<{ key: string; label: string }>; columns?: Array<{ value: string; label: string }> } | undefined;
                if (gridConfig?.rows && gridConfig?.columns && gridConfig.columns.length > 0) {
                  const gridData = value as Record<string, unknown>;
                  gridConfig.rows.forEach((row) => {
                    const rowValue = gridData[row.key];
                    if (rowValue !== undefined && rowValue !== null) {
                      const column = gridConfig.columns?.find(col => col.value === rowValue);
                      const displayValue = column ? column.label : String(rowValue);
                      formatted[`${question.questionText} - ${row.label}`] = displayValue;
                    }
                  });
                } else {
                  formatted[question.questionText] = value;
                }
              } else {
                formatted[question.questionText] = value;
              }
            });

          setFormData({ ...normalData });
          setNewFormData({ ...normalData });
          setFormattedFormData(formatted);
          setFormattedModifiedData(formatted);
        }
      } catch (error) {
        console.error("Error updating dynamic form:", error);
        toast({
          title: "Did Not Save Changes",
          description: `There was an error while saving changes`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      return;
    }

    // Handle legacy forms
    let endpoint = "";

    switch (formItemTitle) {
      case "Initial Screeners":
        endpoint = `/initialInterview/${formItemId}`;
        break;
      case "Front Desk Monthly Statistics":
        endpoint = `/frontDesk/${formItemId}`;
        break;
      case "Case Manager Monthly Statistics":
        endpoint = `/caseManagerMonthlyStats/${formItemId}`;
        break;
      case "Exit Surveys":
        endpoint = `/exitSurvey/${formItemId}`;
        break;
      case "Success Stories":
        endpoint = `/successStory/${formItemId}`;
        break;
      case "Random Client Surveys":
        endpoint = `/randomSurvey/${formItemId}`;
        break;
      default:
        console.error("Unknown form title:", formItemTitle);
        return;
    }

    try {
      if (
        formItemTitle === "Front Desk Monthly Statistics" ||
        formItemTitle === "Initial Screeners" ||
        formItemTitle === "Exit Surveys"
      ) {
        await backend.put(endpoint, camelToSnakeCase(newFormData));
      } else {
        await backend.put(endpoint, newFormData);
      }

      toast({
        title: "Successfully submitted form",
        description: `${formItemTitle} Form - ${new Date().toLocaleString()}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      setRefreshTable((prev) => !prev);
      setFormattedFormData(newFormattedModifiedData);
      setFormData(newFormData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating form:", error);

      toast({
        title: "Did Not Save Changes",
        description: `There was an error while saving changes`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const isDate = (value: string) => {
    return (
      Object.prototype.toString.call(value) === "[object String]" &&
      !isNaN(Date.parse(value))
    );
  };

  const formatValueForDisplay = (value: unknown) => {
    // Rating grids are already expanded into separate rows in formattedFormData,
    // so they'll come through as strings - no special handling needed
    if (typeof value === "string") {
      return isDate(value) ? formatDateString(value) : value;
    }

    if (value === null || value === undefined) {
      return "";
    }

    // Handle other object types
    if (value && typeof value === "object" && !Array.isArray(value) && value !== null) {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    return String(value);
  };

  const formatValueForExport = (value: unknown) => {
    if (value === null || value === undefined) {
      return "";
    }

    return typeof value === "string" ? value : String(value);
  };
  
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={() => {
        onClose();
        setFormattedModifiedData(formattedFormData);
        setNewFormData(formData);
        setIsEditing(false);
      }}
      size="xl"
    >
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <HStack spacing={27}>
            <HStack spacing={2}>
              <IconButton
                as={ChevronRightIcon}
                color="blue.500"
                aria-label="Close drawer"
                onClick={() => {
                  onClose();
                  setFormattedModifiedData(formattedFormData);
                  setNewFormData(formData);
                  setIsEditing(false);
                }}
                variant="ghost"
                size="sm"
              />
              <Text fontSize="md">Form Preview</Text>
            </HStack>
            <Text
              color="gray.600"
              fontSize="md"
            >
              {(() => {
                // If formItemName contains "unknown client", remove it and show only what's after "-"
                if (formItemName && formItemName.toLowerCase().includes("unknown")) {
                  // Extract everything after the "-" separator
                  const parts = formItemName.split(" - ");
                  if (parts.length > 1) {
                    return parts.slice(1).join(" - ");
                  }
                  // If no "-" separator, just show the form title
                  return formItemTitle;
                }
                // If formItemName doesn't contain "unknown", show it normally
                return formItemName ? `${formItemName} - ${formItemTitle}` : formItemTitle;
              })()}
              {formItemDate ? ` ${formatDateString(formItemDate)}` : ""}
            </Text>
          </HStack>
        </DrawerHeader>

        <DrawerBody>
          {isLoading ? (
            <VStack
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Spinner
                size="xl"
                color="blue.500"
              />
              <Text>Loading...</Text>
            </VStack>
          ) : role === "user" &&
            formItemTitle ===
              "Client Tracking Statistics (Intake Statistics)" ? (
            <RequestFormPreview
              cmId={
                typeof formData["cmId"] === "number"
                  ? (formData["cmId"] as number)
                  : undefined
              }
              clientEmail={
                typeof formData["email"] === "string"
                  ? (formData["email"] as string)
                  : undefined
              }
              onClose={onClose}
            />
          ) : (
            <VStack
              marginTop="12px"
              spacing="24px"
            >
              {!isEditing ? (
                <HStack
                  width="100%"
                  justifyContent="space-between"
                >
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    size="lg"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Form
                  </Button>
                  {isInitial ? (
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="lg"
                      onClick={() => handleCommentForm()}
                    >
                      Open Comment Form
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Button
                    colorScheme="blue"
                    float="right"
                    size="lg"
                    onClick={() => {
                      const headers = ["Questions", "Answer"];
                      const data = Object.entries(formattedFormData).map(
                        ([key, value]) => ({
                          Questions: key,
                          Answer: formatValueForExport(value),
                        })
                      );
                      downloadCSV(headers, data, "form.csv");
                    }}
                  >
                    Export Form
                  </Button>
                </HStack>
              ) : (
                <HStack
                  spacing={3}
                  w="100%"
                  justifyContent="flex-end"
                >
                  <Button
                    variant="solid"
                    colorScheme="gray"
                    size="lg"
                    onClick={() => {
                      // setFormattedModifiedData(formattedFormData);
                      setNewFormData(formData);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleSaveForm}
                  >
                    Save
                  </Button>
                </HStack>
              )}
              <TableContainer
                w="100%"
                border="1px"
                borderColor="gray.200"
                borderRadius="12px"
                overflowY="auto"
                overflowX="auto"
              >
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th
                        fontSize="md"
                        color="gray.700"
                        maxWidth="300px"
                        whiteSpace="normal"
                        wordBreak="break-word"
                      >
                        Question
                      </Th>
                      <Th
                        fontSize="md"
                        color="gray.700"
                        maxWidth="400px"
                        whiteSpace="normal"
                        wordBreak="break-word"
                      >
                        Answer
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {!isEditing
                      ? Object.entries(newFormattedModifiedData).map(
                          ([key, value]) => (
                            <Tr key={key}>
                              <Td
                                maxWidth="300px"
                                whiteSpace="normal"
                                wordBreak="break-word"
                                overflowWrap="break-word"
                              >
                                {key}
                              </Td>
                              <Td
                                maxWidth="400px"
                                whiteSpace="normal"
                                wordBreak="break-word"
                                overflowWrap="break-word"
                              >
                                {formatValueForDisplay(value)}
                              </Td>
                            </Tr>
                          )
                        )
                      : renderTableBody()}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default FormPreview;
