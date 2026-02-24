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
  const [hasApprovedRequest, setHasApprovedRequest] = useState(false);
  const navigate = useNavigate();

  const normalizeString = (value: unknown): string => {
    if (value === undefined || value === null) return "";
    return String(value).trim().toLowerCase();
  };

  const normalizePhone = (value: unknown): string => {
    if (value === undefined || value === null) return "";
    return String(value).replace(/\D/g, "");
  };

  const normalizeDate = (value: unknown): string => {
    if (value === undefined || value === null) return "";
    const str = String(value).trim();
    // Normalize to YYYY-MM-DD when possible (strip time portion)
    const [datePart] = str.split("T");
    return datePart ?? "";
  };

  const tryMatchExistingClient = async (): Promise<number | null> => {
    // Prefer edited values (newFormData), but fall back to original formData and clickedFormItem
    const merged: Record<string, unknown> = {
      ...clickedFormItem,
      ...formData,
      ...newFormData,
    };

    const rawFirstName =
      merged.firstName ??
      merged.first_name;
    const rawLastName =
      merged.lastName ??
      merged.last_name;
    const rawEmail = merged.email;
    const rawPhone =
      merged.phoneNumber ??
      merged.phone_number;
    const rawDob =
      merged.dateOfBirth ??
      merged.date_of_birth;

    const firstName = normalizeString(rawFirstName);
    const lastName = normalizeString(rawLastName);
    const email = normalizeString(rawEmail);
    const phone = normalizePhone(rawPhone);
    const dob = normalizeDate(rawDob);

    // If we have no identifying info at all, bail out early
    if (!firstName && !lastName && !email && !phone && !dob) {
      return null;
    }

    try {
      const res = await backend.get("/clients");
      const clients = Array.isArray(res.data) ? res.data : [];

      type ClientLike = {
        id: number;
        firstName?: string;
        lastName?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        phoneNumber?: string;
        phone_number?: string;
        dateOfBirth?: string;
        date_of_birth?: string;
      };

      const strongMatches: ClientLike[] = [];
      const weakMatches: ClientLike[] = [];

      clients.forEach((c: ClientLike) => {
        const cFirst = normalizeString(c.firstName ?? c.first_name);
        const cLast = normalizeString(c.lastName ?? c.last_name);
        const cEmail = normalizeString(c.email);
        const cPhone = normalizePhone(c.phoneNumber ?? c.phone_number);
        const cDob = normalizeDate(c.dateOfBirth ?? c.date_of_birth);

        // Require at least a name match for any candidate
        const nameMatches =
          (!!firstName && !!lastName && cFirst === firstName && cLast === lastName);
        if (!nameMatches && !email) {
          // If we don't have email to match on, don't consider non-name matches
          return;
        }

        // Strong match criteria
        if (
          nameMatches &&
          ((dob && cDob === dob) || (phone && cPhone === phone))
        ) {
          strongMatches.push(c);
          return;
        }

        // Strong match by unique email
        if (email && cEmail && cEmail === email) {
          strongMatches.push(c);
          return;
        }

        // Weak match: just by name
        if (nameMatches) {
          weakMatches.push(c);
        }
      });

      const chosen = strongMatches[0] ?? weakMatches[0];
      return chosen ? chosen.id : null;
    } catch (error) {
      console.error("Error attempting to match existing client:", error);
      return null;
    }
  };

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

        // Get clientId, preferring loaded form data but falling back to the table item
        const clientId =
          (formData.clientId as number | string | undefined) ??
          (formData.client_id as number | string | undefined) ??
          (clickedFormItem.clientId as number | string | undefined) ??
          (clickedFormItem.client_id as number | string | undefined);

        if (clientId === undefined || clientId === null || clientId === "") {
          // Try to match this screener (including any edits) to an existing client
          const matchedClientId = await tryMatchExistingClient();
          if (!matchedClientId) {
            toast({
              title: "Client Not Found",
              description: "Unable to open comment form. Client information is missing.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            return;
          }

          try {
            // Attach this intake session to the matched client
            await backend.patch(`/intakeResponses/session/${sessionId}/client`, {
              clientId: matchedClientId,
            });
          } catch (error) {
            console.error("Error attaching matched client to session:", error);
            toast({
              title: "Client Match Failed",
              description: "We found a possible client match but could not attach it. Please try again or link the client from the Initial Screener table.",
              status: "error",
              duration: 7000,
              isClosable: true,
            });
            return;
          }

          navigate(`/comment-form/${matchedClientId}`, {
            state: {
              sessionId: sessionId,
              returnPath: "/admin-client-forms",
            },
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
          const clientId =
            (formData.clientId as number | string | undefined) ??
            (formData.client_id as number | string | undefined) ??
            (clickedFormItem.clientId as number | string | undefined) ??
            (clickedFormItem.client_id as number | string | undefined);
          if (clientId !== undefined && clientId !== null && clientId !== "") {
            navigate(`/comment-form/${clientId}`, {
              state: {
                sessionId: sessionId,
                returnPath: "/admin-client-forms",
              },
            });
          } else {
            // No existing client link; try to match to an existing client using edited data
            const matchedClientId = await tryMatchExistingClient();
            if (!matchedClientId) {
              toast({
                title: "Client Not Found",
                description: "Unable to open comment form. Client information is missing.",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
              return;
            }

            try {
              await backend.patch(`/intakeResponses/session/${sessionId}/client`, {
                clientId: matchedClientId,
              });
            } catch (patchError) {
              console.error("Error attaching matched client to session (404 path):", patchError);
              toast({
                title: "Client Match Failed",
                description: "We found a possible client match but could not attach it. Please try again or link the client from the Initial Screener table.",
                status: "error",
                duration: 7000,
                isClosable: true,
              });
              return;
            }

            navigate(`/comment-form/${matchedClientId}`, {
              state: {
                sessionId: sessionId,
                returnPath: "/admin-client-forms",
              },
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
          onRatingGridChange={handleRatingGridChange}
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
          // Fetch form response and case managers in parallel
          const [response, cmResponse] = await Promise.all([
            backend.get(`/intakeResponses/session/${sessionId}`),
            backend.get("/caseManagers"),
          ]);
          const normalData = response.data;

          const cmList: Array<{ id: number; firstName?: string; lastName?: string; first_name?: string; last_name?: string }> =
            Array.isArray(cmResponse.data)
              ? cmResponse.data
                  .map((cm: { id: number | string; firstName?: string; lastName?: string; first_name?: string; last_name?: string }) => ({
                    id: Number(cm.id),
                    firstName: cm.firstName,
                    lastName: cm.lastName,
                    first_name: cm.first_name,
                    last_name: cm.last_name,
                  }))
                  .filter((cm: { id: number }) => !Number.isNaN(cm.id))
              : [];

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

            const resolveCmName = (id: number | string | null | undefined): string => {
              if (id === null || id === undefined || id === "") return "";
              const numId = typeof id === "string" ? parseInt(id, 10) : id;
              if (Number.isNaN(numId)) return String(id);
              const cm = cmList.find((c) => c.id === numId);
              if (!cm) return String(id);
              const first = cm.firstName ?? cm.first_name ?? "";
              const last = cm.lastName ?? cm.last_name ?? "";
              return `${first} ${last}`.trim() || String(id);
            };

            questions
              .filter((q: { isVisible: boolean; questionType: string }) => 
                q.isVisible && q.questionType !== 'text_block' && q.questionType !== 'header')
              .sort((a: { displayOrder: number }, b: { displayOrder: number }) => 
                a.displayOrder - b.displayOrder)
              .forEach((question: { fieldKey: string; questionText: string; questionType: string; options?: unknown }) => {
                const camelKey = question.fieldKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                let value = normalData[camelKey] ?? normalData[question.fieldKey] ?? "";
                // Parse rating grid value if stored as JSON string
                if (question.questionType === "rating_grid" && typeof value === "string" && value) {
                  try {
                    value = JSON.parse(value) as Record<string, unknown>;
                  } catch {
                    value = {};
                  }
                }
                
                // For rating grids, one row per grid row with its own value
                if (question.questionType === "rating_grid") {
                  const gridConfig = question.options as { rows?: Array<{ key: string; label: string }>; columns?: Array<{ value: string; label: string }> } | undefined;
                  const gridData = (value && typeof value === "object" && !Array.isArray(value) && value !== null) ? (value as Record<string, unknown>) : {};
                  if (gridConfig?.rows && gridConfig.rows.length > 0) {
                    gridConfig.rows.forEach((row) => {
                      const rowValue = gridData[row.key];
                      let displayValue = "";
                      if (rowValue !== undefined && rowValue !== null) {
                        if (gridConfig?.columns && gridConfig.columns.length > 0) {
                          const column = gridConfig.columns.find((col: { value: string }) => String(col.value) === String(rowValue));
                          displayValue = column ? column.label : String(rowValue);
                        } else {
                          displayValue = String(rowValue);
                        }
                      }
                      formatted[`${question.questionText} - ${row.label}`] = displayValue;
                    });
                  } else {
                    Object.entries(gridData).forEach(([k, v]) => {
                      formatted[`${question.questionText} - ${k}`] = v !== undefined && v !== null ? String(v) : "";
                    });
                  }
                } else if (question.questionType === "case_manager_select") {
                  formatted[question.questionText] = resolveCmName(value);
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

  // For client tracking statistics forms viewed by a regular user, check
  // whether any edit request for this client has already been approved.
  useEffect(() => {
    const checkApprovedRequest = async () => {
      // Only relevant for regular users viewing Intake Statistics
      if (
        role !== "user" ||
        formItemTitle !== "Client Tracking Statistics (Intake Statistics)" ||
        isLoading
      ) {
        return;
      }

      const email =
        typeof formData["email"] === "string"
          ? (formData["email"] as string)
          : undefined;

      if (!email) {
        setHasApprovedRequest(false);
        return;
      }

      try {
        // Resolve clientId from email
        let clientId: number | undefined;

        try {
          const response = await backend.get(
            `/clients/email/${encodeURIComponent(email)}`
          );
          const clients = Array.isArray(response.data) ? response.data : [];
          if (clients.length > 0 && clients[0]?.id) {
            clientId = clients[0].id;
          }
        } catch {
          // ignore; handled below
        }

        if (!clientId) {
          setHasApprovedRequest(false);
          return;
        }

        const requestsResponse = await backend.get("/request");
        const allRequests = Array.isArray(requestsResponse.data)
          ? requestsResponse.data
          : [];

        const approved = allRequests.some(
          (req: { client_id?: number; status?: string }) =>
            req.client_id === clientId && req.status === "approved"
        );

        setHasApprovedRequest(approved);
      } catch (error) {
        console.error("Error checking approved request status:", error);
        setHasApprovedRequest(false);
      }
    };

    checkApprovedRequest();
  }, [backend, role, formItemTitle, isLoading, formData]);

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

  const handleRatingGridChange = (fieldKey: string, rowKey: string, newValue: string) => {
    setNewFormData((prev) => {
      const current = prev[fieldKey];
      const gridObj =
        current && typeof current === "object" && !Array.isArray(current) && current !== null
          ? { ...(current as Record<string, unknown>) }
          : {};
      return {
        ...prev,
        [fieldKey]: { ...gridObj, [rowKey]: newValue },
      };
    });
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
        const [reloadResponse, cmReloadResponse] = await Promise.all([
          backend.get(`/intakeResponses/session/${sessionId}`),
          backend.get("/caseManagers"),
        ]);
        const normalData = reloadResponse.data;
        const cmList: Array<{ id: number; firstName?: string; lastName?: string; first_name?: string; last_name?: string }> =
          Array.isArray(cmReloadResponse.data)
            ? cmReloadResponse.data
                .map((cm: { id: number | string; firstName?: string; lastName?: string; first_name?: string; last_name?: string }) => ({
                  id: Number(cm.id),
                  firstName: cm.firstName,
                  lastName: cm.lastName,
                  first_name: cm.first_name,
                  last_name: cm.last_name,
                }))
                .filter((cm: { id: number }) => !Number.isNaN(cm.id))
            : [];

        const formId = getFormId(formItemTitle);
        if (formId && normalData) {
          const questionsResponse = await backend.get(`/intakeResponses/form/${formId}/questions`);
          const questions = questionsResponse.data || [];
          setFormQuestions(questions);

          const resolveCmName = (id: number | string | null | undefined): string => {
            if (id === null || id === undefined || id === "") return "";
            const numId = typeof id === "string" ? parseInt(id, 10) : id;
            if (Number.isNaN(numId)) return String(id);
            const cm = cmList.find((c) => c.id === numId);
            if (!cm) return String(id);
            const first = cm.firstName ?? cm.first_name ?? "";
            const last = cm.lastName ?? cm.last_name ?? "";
            return `${first} ${last}`.trim() || String(id);
          };

          const formatted: FormDataRecord = {};
          questions
            .filter((q: { isVisible: boolean; questionType: string }) => 
              q.isVisible && q.questionType !== 'text_block' && q.questionType !== 'header')
            .sort((a: { displayOrder: number }, b: { displayOrder: number }) => 
              a.displayOrder - b.displayOrder)
            .forEach((question: { fieldKey: string; questionText: string; questionType: string; options?: unknown }) => {
              const camelKey = question.fieldKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
              let value = normalData[camelKey] ?? normalData[question.fieldKey] ?? "";
              if (question.questionType === "rating_grid" && typeof value === "string" && value) {
                try {
                  value = JSON.parse(value) as Record<string, unknown>;
                } catch {
                  value = {};
                }
              }
              if (question.questionType === "rating_grid") {
                const gridConfig = question.options as { rows?: Array<{ key: string; label: string }>; columns?: Array<{ value: string; label: string }> } | undefined;
                const gridData = (value && typeof value === "object" && !Array.isArray(value) && value !== null) ? (value as Record<string, unknown>) : {};
                if (gridConfig?.rows && gridConfig.rows.length > 0) {
                  gridConfig.rows.forEach((row) => {
                    const rowValue = gridData[row.key];
                    let displayValue = "";
                    if (rowValue !== undefined && rowValue !== null) {
                      if (gridConfig?.columns && gridConfig.columns.length > 0) {
                        const column = gridConfig.columns.find((col: { value: string }) => String(col.value) === String(rowValue));
                        displayValue = column ? column.label : String(rowValue);
                      } else {
                        displayValue = String(rowValue);
                      }
                    }
                    formatted[`${question.questionText} - ${row.label}`] = displayValue;
                  });
                } else {
                  Object.entries(gridData).forEach(([k, v]) => {
                    formatted[`${question.questionText} - ${k}`] = v !== undefined && v !== null ? String(v) : "";
                  });
                }
              } else if (question.questionType === "case_manager_select") {
                formatted[question.questionText] = resolveCmName(value);
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
    if (Object.prototype.toString.call(value) !== "[object String]" || value === "") {
      return false;
    }
    const trimmed = value.trim();
    // Don't treat select/option values as dates: pure numbers (e.g. "1", "0") or yes/no
    if (/^\d+$/.test(trimmed) || /^(yes|no)$/i.test(trimmed)) {
      return false;
    }
    return !isNaN(Date.parse(value));
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
              "Client Tracking Statistics (Intake Statistics)" &&
            !hasApprovedRequest ? (
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
                      // Export what the user is seeing (and any edits), with a fallback
                      // to building the export from dynamic questions + raw data.
                      const getExportRows = () => {
                        const primary =
                          Object.keys(newFormattedModifiedData).length > 0
                            ? newFormattedModifiedData
                            : formattedFormData;


                        if (Object.keys(primary).length > 0) {
                          return Object.entries(primary).map(([key, value]) => ({
                            Questions: key,
                            Answer: formatValueForExport(value),
                          }));
                        }

                        // Fallback: build from dynamic form questions + raw form data
                        if (isDynamicForm && formQuestions.length > 0) {
                          const rows: Array<{ Questions: string; Answer: string }> = [];

                          formQuestions
                            .filter(
                              (q) =>
                                q.isVisible &&
                                q.questionType !== "text_block" &&
                                q.questionType !== "header"
                            )
                            .sort((a, b) => a.displayOrder - b.displayOrder)
                            .forEach((q) => {
                              const camelKey = q.fieldKey.replace(
                                /_([a-z])/g,
                                (_, letter) => letter.toUpperCase()
                              );
                              let rawValue =
                                (newFormData as Record<string, unknown>)[camelKey] ??
                                (newFormData as Record<string, unknown>)[q.fieldKey] ??
                                "";
                              if (q.questionType === "rating_grid" && typeof rawValue === "string" && rawValue) {
                                try {
                                  rawValue = JSON.parse(rawValue) as Record<string, unknown>;
                                } catch {
                                  rawValue = {};
                                }
                              }

                              if (q.questionType === "rating_grid") {
                                const gridConfig = q.options as
                                  | {
                                      rows?: Array<{ key: string; label: string }>;
                                      columns?: Array<{ value: string; label: string }>;
                                    }
                                  | undefined;
                                const gridData =
                                  rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)
                                    ? (rawValue as Record<string, unknown>)
                                    : {};
                                if (gridConfig?.rows && gridConfig.rows.length > 0) {
                                  gridConfig.rows.forEach((row) => {
                                    const rowValue = gridData[row.key];
                                    let displayValue = "";
                                    if (rowValue !== undefined && rowValue !== null) {
                                      if (gridConfig?.columns && gridConfig.columns.length > 0) {
                                        const column = gridConfig.columns.find(
                                          (col: { value: string }) => String(col.value) === String(rowValue)
                                        );
                                        displayValue = column ? column.label : String(rowValue);
                                      } else {
                                        displayValue = String(rowValue);
                                      }
                                    }
                                    rows.push({
                                      Questions: `${q.questionText} - ${row.label}`,
                                      Answer: displayValue,
                                    });
                                  });
                                  return;
                                }
                              }

                              rows.push({
                                Questions: q.questionText,
                                Answer: formatValueForExport(rawValue),
                              });
                            });

                          return rows;
                        }

                        return [];
                      };

                      const data = getExportRows();
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
