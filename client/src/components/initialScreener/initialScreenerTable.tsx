import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDateString } from "../../utils/dateUtils";
import { LoadingWheel } from "../loading/loading";
import { TableControls } from "../adminClientForms/FormTables/TableControls";
import { TableContent } from "../adminClientForms/FormTables/TableContent";
import { AddClientForm } from "../clientlist/AddClientForm";

// Helper function to convert snake_case to camelCase
const toCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/g, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

interface RatingGridConfig {
  rows: Array<{ key: string; label: string }>;
  columns: Array<{ value: string; label: string }>;
}

interface FormQuestion {
  id: number;
  fieldKey: string;
  questionText: string;
  questionType: string;
  displayOrder: number;
  isVisible: boolean;
  options?: RatingGridConfig | Array<{ value: string; label: string }>;
}

interface FormResponse {
  id: number; // Numeric ID for table compatibility
  sessionId: string; // Actual session_id UUID
  clientId: number | null;
  submittedAt: string;
  firstName: string | null;
  lastName: string | null;
  [key: string]: unknown; // Dynamic fields from responses
}

export const InitialScreenerTable = () => {
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const formId = 1; // Initial Interview form_id
  const toast = useToast();

  const [formQuestions, setFormQuestions] = useState<FormQuestion[]>([]);
  const [formData, setFormData] = useState<(FormResponse & { isChecked: boolean; isHovered: boolean })[]>([]);
  const [filterQuery, setFilterQuery] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const {
    isOpen: isAddClientOpen,
    onOpen: openAddClient,
    onClose: closeAddClient,
  } = useDisclosure();
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const [addClientInitialValues, setAddClientInitialValues] = useState<{
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
    date_of_birth?: string;
  }>({});

  // Fetch form questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await backend.get(`/intakeResponses/form/${formId}/questions`);
        setFormQuestions(response.data);
      } catch (error) {
        console.error("Error fetching form questions:", error);
      }
    };
    fetchQuestions();
  }, [backend, formId]);

  // Build columns dynamically from form questions
  const columns = useMemo<ColumnDef<FormResponse>[]>(() => {
    const cols: ColumnDef<FormResponse>[] = [];

    // Add columns for each form question (exclude text_block and header types)
    formQuestions
      .filter(q => q.isVisible && q.questionType !== 'text_block' && q.questionType !== 'header')
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .forEach((question) => {
        // Convert fieldKey from snake_case to camelCase to match API response
        const camelFieldKey = toCamelCase(question.fieldKey);

        // Handle rating_grid questions separately - create a column for each row
        if (question.questionType === 'rating_grid' && question.options && 'rows' in question.options) {
          const gridConfig = question.options as RatingGridConfig;
          if (gridConfig.rows && gridConfig.rows.length > 0) {
            gridConfig.rows.forEach((row) => {
              const col: ColumnDef<FormResponse> = {
                accessorKey: `${camelFieldKey}_${row.key}`,
                header: `${question.questionText} - ${row.label}`,
                cell: ({ row: tableRow }) => {
                  // Get the rating grid value (stored as JSON string)
                  const gridValue = tableRow.original[camelFieldKey] ?? tableRow.original[question.fieldKey];
                  if (!gridValue) return "";

                  try {
                    // Parse JSON if it's a string
                    const gridData = typeof gridValue === 'string' ? JSON.parse(gridValue) : gridValue;
                    const rowValue = gridData[row.key];
                    
                    if (!rowValue) return "";
                    
                    // Find the column label for this value
                    const column = gridConfig.columns.find(col => col.value === rowValue);
                    return column ? column.label : rowValue;
                  } catch {
                    // If parsing fails, try to access directly
                    const gridData: Record<string, unknown> = typeof gridValue === 'object' && gridValue !== null ? (gridValue as Record<string, unknown>) : {};
                    const rowValue = gridData[row.key];
                    if (!rowValue) return "";
                    
                    const column = gridConfig.columns.find(col => col.value === rowValue);
                    return column ? column.label : String(rowValue);
                  }
                },
              };
              cols.push(col);
            });
            return; // Skip the default column creation for rating grids
          }
        }

        // Regular question types
        const col: ColumnDef<FormResponse> = {
          accessorKey: camelFieldKey,
          header: question.questionText,
          cell: ({ getValue, row }) => {
            // Try camelCase first, fallback to original fieldKey
            const value = row.original[camelFieldKey] ?? row.original[question.fieldKey] ?? getValue();
            if (value === null || value === undefined || value === "") {
              return "";
            }
            
            // Format based on question type
            switch (question.questionType) {
              case "date":
                return formatDateString(value as string);
              case "boolean":
                return value ? "Yes" : "No";
              case "number":
                return value;
              default:
                return String(value);
            }
          },
        };
        cols.push(col);
      });

    return cols;
  }, [formQuestions]);

  const table = useReactTable({
    data: formData,
    columns,
    state: {
      sorting,
    },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Fetch form data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `/intakeResponses/form/${formId}`;
        const params = new URLSearchParams();
        
        if (searchQuery) {
          params.append("search", searchQuery);
        }
        if (filterQuery.length > 0) {
          params.append("filter", filterQuery.join(" "));
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await backend.get(url);
        // Convert session_id (UUID string) to numeric ID for table compatibility
        const data = response.data.map((item: Record<string, unknown>) => {
          // Create a numeric ID from session_id hash
          const sessionId = String(item.sessionId || item.session_id || '');
          const numericId = sessionId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
          return {
            ...item,
            id: numericId,
            sessionId: sessionId,
            isChecked: false,
            isHovered: false,
          } as FormResponse & { isChecked: boolean; isHovered: boolean };
        });
        setFormData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backend, formId, searchQuery, filterQuery, refreshTable]);

  // Fetch last updated time
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get("/lastUpdated/initial_interview");
        const date = new Date(response.data[0]["lastUpdatedAt"]);
        const formattedDate = date.toLocaleString();
        setLastUpdated(formattedDate);
      } catch (error) {
        console.error("Error getting time:", error);
      }
    };
    fetchData();
  }, [backend]);


  const handleRowClick = (row: FormResponse) => {
    // Navigate to comment form using client_id if available, otherwise use session_id
    if (row.clientId) {
      // Pass sessionId through route state so the comment form
      // can associate screener comments with this intake session
      navigate(`/comment-form/${row.clientId}`, {
        state: { sessionId: row.sessionId },
      });
    } else {
      // No matched client yet: open Add Client drawer so user can create + attach a client
      toast({
        title: "Client not created yet",
        description:
          "This screener isn’t in the client table yet. Please add the client first so we can attach the screener and open the comment form.",
        status: "info",
        duration: 7000,
        isClosable: true,
        position: "bottom-right",
      });
      setPendingSessionId(row.sessionId);
      const dob = (row as Record<string, unknown>).dateOfBirth ?? (row as Record<string, unknown>).date_of_birth;
      const phone = (row as Record<string, unknown>).phoneNumber ?? (row as Record<string, unknown>).phone_number;
      const email = (row as Record<string, unknown>).email;
      setAddClientInitialValues({
        first_name: row.firstName ?? "",
        last_name: row.lastName ?? "",
        phone_number: phone ? String(phone) : "",
        email: email ? String(email) : "",
        date_of_birth: dob ? String(dob) : "",
      });
      openAddClient();
    }
  };

  return (
    <VStack
      spacing={2}
      align="start"
      sx={{ maxWidth: "100%", marginX: "auto", padding: "4%" }}
    >
      <AddClientForm
        hideButton
        isOpen={isAddClientOpen}
        onOpen={openAddClient}
        onClose={closeAddClient}
        initialValues={addClientInitialValues}
        setShowUnfinishedAlert={() => {}}
        onClientAdded={async (newClientId) => {
          try {
            if (!pendingSessionId || !newClientId) return;
            await backend.patch(`/intakeResponses/session/${pendingSessionId}/client`, {
              clientId: newClientId,
            });
            setRefreshTable((prev) => !prev);
            setPendingSessionId(null);
            // Now that the screener is linked to a client, open the comment form
            navigate(`/comment-form/${newClientId}`, {
              state: { 
                sessionId: pendingSessionId,
                returnPath: "/initial-screener-table",
              },
            });
          } catch (error) {
            console.error("Error attaching client to session:", error);
          } finally {
            closeAddClient();
          }
        }}
      />

      <Heading fontSize="3xl" lineHeight="9" fontWeight="extrabold" paddingBottom={"0.5%"}>
        List of Initial Screeners
      </Heading>
      <Text size="sm" marginBottom={"1%"}>
        Last Updated: {lastUpdated}
      </Text>
      <Heading fontSize="md" lineHeight="6" fontWeight="semibold" marginBottom={"0.5%"}>
        Choose a Screener
      </Heading>

      <Box width="100%">
        <TableControls
          searchKey={searchQuery}
          setSearchKey={setSearchQuery}
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
          selectedRowIds={[]}
          filterType="initialScreener"
          showExportCount={false}
          formQuestions={formQuestions}
        />
        <Box width={"100%"} justifyContent={"center"} mt={4}>
          {loading ? (
            <LoadingWheel />
          ) : (
            <TableContent
              table={table}
              selectedRowIds={[]}
              onRowSelect={() => {}}
              checkboxMode="hidden"
              setCheckboxMode={() => {}}
              onRowClick={(row) => handleRowClick(row)}
              showRowNumber={false}
            />
          )}
        </Box>
      </Box>
    </VStack>
  );
};
