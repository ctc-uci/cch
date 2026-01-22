import { useEffect, useMemo, useState } from "react";
import { Box, Checkbox, VStack, useDisclosure } from "@chakra-ui/react";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext.ts";
import { formatDateString } from "../../../utils/dateUtils.ts";
import { downloadCSV } from "../../../utils/downloadCSV.ts";
import FormPreview from "../../formsHub/FormPreview.tsx";
import type { Form } from "../../../types/form.ts";
import { LoadingWheel } from "../../loading/loading.tsx";
import { TableControls } from "./TableControls.tsx";
import { TableContent } from "./TableContent.tsx";

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
  id: number; // Will be a hash of session_id for table compatibility
  sessionId: string; // Actual session_id UUID
  clientId: number;
  submittedAt: string;
  firstName: string;
  lastName: string;
  [key: string]: unknown; // Dynamic fields from responses
}

interface DynamicFormTableProps {
  formId: number;
  formName: string;
  selectedRowIds: string[];
  setSelectedRowIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  deletedRowIds: string[];
}

export const DynamicFormTable = ({
  formId,
  formName,
  selectedRowIds,
  setSelectedRowIds,
  deletedRowIds,
}: DynamicFormTableProps) => {
  const { backend } = useBackendContext();
  const [formQuestions, setFormQuestions] = useState<FormQuestion[]>([]);
  const [formData, setFormData] = useState<(FormResponse & { isChecked: boolean; isHovered: boolean })[]>([]);
  const [filterQuery, setFilterQuery] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [clickedFormItem, setClickedFormItem] = useState<Form | null>(null);
  const [checkboxMode, setCheckboxMode] = useState<'hidden' | 'visible-unchecked' | 'visible-checked'>('hidden');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshTable, setRefreshTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    const cols: ColumnDef<FormResponse>[] = [
      {
        id: "rowNumber",
        header: ({ table }) => {
          const visibleSessionIds = table.getRowModel().rows.map(r => r.original.sessionId);
          return (
            <Box textAlign="center">
              <Checkbox
                isChecked={checkboxMode === 'visible-checked'}
                isIndeterminate={checkboxMode === 'visible-unchecked'}
                onChange={() => {
                  if (checkboxMode === 'hidden') {
                    setCheckboxMode('visible-checked');
                    setSelectedRowIds(prev => Array.from(new Set([...prev, ...visibleSessionIds])));
                  } else if (checkboxMode === 'visible-checked') {
                    setCheckboxMode('visible-unchecked');
                    setSelectedRowIds(prev => prev.filter(id => !visibleSessionIds.includes(id)));
                  } else {
                    setCheckboxMode('hidden');
                    setSelectedRowIds([]);
                  }
                }}
              />
            </Box>
          );
        },
        enableSorting: false,
      },
    ];

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
  }, [formQuestions, checkboxMode, setSelectedRowIds]);

  // Apply local deletion updates when parent deletes rows
  useEffect(() => {
    if (deletedRowIds && deletedRowIds.length > 0) {
      setFormData((prev) => prev.filter((r) => !deletedRowIds.includes(r.sessionId)));
      setSelectedRowIds((prev) => prev.filter((id) => !deletedRowIds.includes(id)));
    }
  }, [deletedRowIds, setSelectedRowIds]);

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
          const sessionId = String(item.sessionId || item.id || '');
          const numericId = sessionId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
          return {
            ...item,
            id: numericId,
            sessionId: sessionId,
            isChecked: selectedRowIds.includes(sessionId),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend, formId, searchQuery, filterQuery, refreshTable]);

  useEffect(() => {
    if (clickedFormItem) {
      onOpen();
    }
  }, [clickedFormItem, onOpen]);

  const onPressCSVButton = () => {
    const selectedData = formData.filter((row) =>
      selectedRowIds.includes(row.sessionId)
    );

    // Build CSV data with all fields (exclude text_block and header types)
    const visibleQuestions = formQuestions.filter(q => q.isVisible && q.questionType !== 'text_block' && q.questionType !== 'header');
    const headers = [...visibleQuestions.map(q => q.fieldKey)];
    const data = selectedData.map((row) => {
      const rowData: Record<string, unknown> = {};
      
      visibleQuestions.forEach((question) => {
        // Try camelCase first, fallback to original fieldKey
        const camelFieldKey = toCamelCase(question.fieldKey);
        rowData[question.fieldKey] = row[camelFieldKey] ?? row[question.fieldKey] ?? "";
      });
      
      return rowData;
    });

    downloadCSV(headers, data, `${formName.toLowerCase().replace(/\s+/g, "-")}.csv`);
  };

  const handleRowSelect = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRowIds((prev) => [...prev, id]);
    } else {
      setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  return (
    <VStack
      align="start"
      sx={{ maxWidth: "100%", marginX: "auto" }}
    >
        <TableControls
        searchKey={searchQuery}
        setSearchKey={setSearchQuery}
        filterQuery={filterQuery}
        setFilterQuery={setFilterQuery}
        selectedRowIds={formData
          .filter(row => selectedRowIds.includes(row.sessionId))
          .map(row => row.id)}
        onExport={onPressCSVButton}
        filterType={formName.toLowerCase().replace(/\s+/g, "")}
        showExportCount={true}
        formQuestions={formQuestions}
      />
      <Box
        width={"100%"}
        justifyContent={"center"}
      >
        {loading ? (
          <LoadingWheel />
        ) : (
          <TableContent
            table={table}
            selectedRowIds={formData
              .filter(row => selectedRowIds.includes(row.sessionId))
              .map(row => row.id)}
            onRowSelect={(id, checked) => {
              // Convert numeric ID back to session_id
              const row = formData.find(r => r.id === id);
              if (row) {
                handleRowSelect(row.sessionId, checked);
              }
            }}
            checkboxMode={checkboxMode}
            setCheckboxMode={setCheckboxMode}
            onRowClick={(row) => {
              const formItem: Form = {
                ...row,
                hashedId: row.id,
                date: row.submittedAt || '',
                name: `${row.firstName} ${row.lastName}`,
                title: formName as Form['title'],
                id: row.id,
              };
              setClickedFormItem(formItem);
              onOpen();
            }}
          />
        )}
        {clickedFormItem && (
          <FormPreview
            clickedFormItem={clickedFormItem}
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setClickedFormItem(null);
            }}
            refreshTable={refreshTable}
            setRefreshTable={setRefreshTable}
          />
        )}
      </Box>
    </VStack>
  );
};

