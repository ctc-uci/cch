import { useEffect, useMemo, useState } from "react";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  filter,
  HStack,
  Input,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  MdFileUpload,
  MdOutlineFilterAlt,
  MdOutlineManageSearch,
} from "react-icons/md";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext.ts";
import type { Form } from "../../types/form";
import { formatDateString } from "../../utils/dateUtils";
import { downloadCSV } from "../../utils/downloadCSV";
import { LoadingWheel } from ".././loading/loading.tsx";
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox";
import PrintForm from "../printForm/PrintForm";
import { FormsListFilter } from "./FormListFilter.tsx";
import FormPreview from "./FormPreview";

// const applyFilters = (data: Form[] = [], filterRows: FormFilter[] = []): Form[] => {
//   return data.filter((form) => {
//     return filterRows.reduce<boolean>((acc, row, index) => {
//       if (!row.field || !row.operator || !row.value) return acc;

//       const fieldValue = form[row.field as keyof Form];
//       const fieldType = row.field === "date" ? "date" : typeof fieldValue;
//       let result = true;

//       if (fieldType === "date" && typeof fieldValue === "string") {
//         const value = row.value;
//         const normalized = fieldValue.slice(0, 10);
//         result = row.operator === "contains"
//           ? normalized.includes(value)
//           : row.operator === "="
//           ? normalized === value
//           : normalized !== value;
//       } else if (typeof fieldValue === "string") {
//         const value = row.value.toLowerCase();
//         const lower = fieldValue.toLowerCase();
//         result = row.operator === "contains"
//           ? lower.includes(value)
//           : row.operator === "="
//           ? lower === value
//           : lower !== value;
//       }

//       if (index === 0 || row.selector === "AND") {
//         return acc && result;
//       } else {
//         return acc || result;
//       }
//     }, true);
//   });
// };

const applyFilters = (
  data: Form[] = [],
  filterRows: FormFilter[] = [],
  searchKey: string = ""
): Form[] => {
  return data.filter((form) => {
    const filterMatch = filterRows.reduce<boolean>((acc, row, index) => {
      if (!row.field || !row.operator || !row.value) return acc;

      const fieldValue = form[row.field as keyof Form];
      const fieldType = row.field === "date" ? "date" : typeof fieldValue;
      let result = true;

      if (fieldType === "date" && typeof fieldValue === "string") {
        const value = row.value;
        const normalized = fieldValue.slice(0, 10);
        result =
          row.operator === "contains"
            ? normalized.includes(value)
            : row.operator === "="
              ? normalized === value
              : normalized !== value;
      } else if (typeof fieldValue === "string") {
        const value = row.value.toLowerCase();
        const lower = fieldValue.toLowerCase();
        result =
          row.operator === "contains"
            ? lower.includes(value)
            : row.operator === "="
              ? lower === value
              : lower !== value;
      }

      if (index === 0 || row.selector === "AND") {
        return acc && result;
      } else {
        return acc || result;
      }
    }, true);

    const normalizedSearch = searchKey.toLowerCase();
    const searchMatch =
      !searchKey ||
      form.name.toLowerCase().includes(normalizedSearch) ||
      form.title.toLowerCase().includes(normalizedSearch) ||
      form.date.slice(0, 10).includes(normalizedSearch);

    return filterMatch && searchMatch;
  });
};

type FormFilter = {
  id: number;
  field: string;
  operator: string;
  value: string;
  selector?: string;
};

type CaseManager = {
  id: number;
  firstName?: string;
  lastName?: string;
};

export const FormTable = () => {
  const { backend } = useBackendContext();
  const { role } = useRoleContext();

  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [clickedFormItem, setClickedFormItem] = useState<Form | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const [filterRows, setFilterRows] = useState<FormFilter[]>([
    { id: 1, field: "", operator: "", value: "" },
  ]);
  const [initialScreenerDate, setInitialScreenerDate] = useState<Date | null>(
    null
  );
  const [frontDeskDate, setFrontDeskDate] = useState<Date | null>(null);
  const [cmMonthlyDate, setCMMonthlyDate] = useState<Date | null>(null);
  const [exitSurveyDate, setExitSurveyDate] = useState<Date | null>(null);
  const [successStoryDate, setSuccessStoryDate] = useState<Date | null>(null);
  const [randomClientSurveyDate, setRandomClientSurveyDate] =
    useState<Date | null>(null);

  const [mostRecentDate, setMostRecentDate] = useState<Date | null>(null);
  const [initialScreeners, setInitialScreeners] = useState<Form[]>([]);
  const [intakeStatistics, setIntakeStatistics] = useState<Form[]>([]);
  const [frontDeskStatistics, setFrontDeskStatistics] = useState<Form[]>([]);
  const [caseManagerStatistics, setCaseManagerStatistics] = useState<Form[]>(
    []
  );
  const [exitSurvey, setExitSurvey] = useState<Form[]>([]);
  const [successStory, setSuccessStory] = useState<Form[]>([]);
  const [randomClientSurvey, setRandomClientSurvey] = useState<Form[]>([]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTable, setRefreshTable] = useState(false);

  const columns = useMemo<ColumnDef<Form>[]>(
    () => [
      {
        id: "selection",
        header: ({ table }) => (
          <Box textAlign="center">
            <Checkbox
              isChecked={selectedRowIds.length > 0}
              isIndeterminate={table.getIsSomeRowsSelected()}
              onChange={() => handleSelectAllCheckboxClick(table)}
            />
          </Box>
        ),
        cell: ({ row }) => {
          const hashedId = row.original.hashedId;
          const isChecked = selectedRowIds.includes(hashedId);
          return (
            <Box textAlign="center">
              <Checkbox
                isChecked={isChecked}
                onChange={(e) => handleRowSelect(hashedId, e.target.checked)}
              />
            </Box>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => formatDateString(getValue() as string),
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "title",
        header: "Form Title",
      },
      {
        accessorKey: "export",
        header: "Export",
      },
    ],
    [selectedRowIds]
  );

  const frontDeskColumns: ColumnDef<Form>[] = useMemo(
    () =>
      columns.map((column) => {
        const colWithKey = column as unknown as { accessorKey?: string };
        if (colWithKey.accessorKey === "name") {
          return { ...column, header: "Case Manager" } as ColumnDef<Form>;
        }
        return column;
      }),
    [columns]
  );
  const handleSelectAllCheckboxClick = (
    tableInstance: ReturnType<typeof useReactTable<Form>>
  ) => {
    const allHashedRowIds = tableInstance
      .getRowModel()
      .rows.map((row) => row.original.hashedId);
    if (selectedRowIds.length === 0) {
      setSelectedRowIds(allHashedRowIds);
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleRowSelect = (hashedId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRowIds((prev) => [...prev, hashedId]);
    } else {
      setSelectedRowIds((prev) =>
        prev.filter((rowHashedId) => rowHashedId !== hashedId)
      );
    }
  };

  const handleExport = (
    tableInstance: ReturnType<typeof useReactTable<Form>>
  ) => {
    const allRows = tableInstance.getRowModel().rows;

    const selectedItems = allRows
      .filter((row) => selectedRowIds.includes(row.original.hashedId))
      .map((row) => row.original);

    const headers = ["Date", "Name", "Form Title"];

    const data = selectedItems.map((item) => ({
      Date: item.date,
      Name: item.name,
      "Form Title": item.title,
    }));

    downloadCSV(headers, data, "forms.csv");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          screenerResponse,
          frontDeskResponse,
          caseManagersMonthlyResponse,
          allCaseManagersResponse,
          initialScreenerResponse,
          frontDeskMonthlyStatsResponse,
          cmMonthlyStatsResponse,
          intakeStatsResponse,
          exitSurveyResponse,
          successStoryResponse,
          randomClientSurveyResponse,
          lastUpdatedExitSurveyResponse,
          lastUpdatedSuccessStoryResponse,
          lastUpdatedRandomSurveyResponse,
        ] = await Promise.all([
          backend.get(`/intakeResponses/form/1`),
          backend.get(`/frontDesk`),
          backend.get(`/caseManagerMonthlyStats`),
          backend.get(`/caseManagers`),
          backend.get(`/lastUpdated/initial_interview`),
          backend.get(`/lastUpdated/front_desk_monthly`),
          backend.get(`/lastUpdated/cm_monthly_stats`),
          backend.get(`/intakeStatsForm`),
          backend.get(`/exitSurvey`),
          backend.get(`/successStory`),
          backend.get(`/randomSurvey`),
          backend.get(`/lastUpdated/exit_survey`),
          backend.get(`/lastUpdated/success_story`),
          backend.get(`/lastUpdated/random_survey_table`),
        ]);

        const initialScreeners: Form[] = await screenerResponse.data.map(
          (item: Record<string, unknown>) => {
            // Create a numeric ID from sessionId hash (matching initialScreenerTable pattern)
            const sessionId = String(item.sessionId || item.session_id || '');
            const numericId = sessionId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
            
            // Construct name from firstName/lastName or use name field
            const firstName = item.firstName || item.first_name || '';
            const lastName = item.lastName || item.last_name || '';
            const name = item.name 
              ? String(item.name)
              : firstName || lastName
              ? `${firstName} ${lastName}`.trim()
              : 'Unknown';
            
            return {
              id: numericId,
              hashedId: numericId,
              date: String(item.submittedAt || item.submitted_at || item.date || ''),
              name: name,
              title: "Initial Screeners" as const,
              sessionId: sessionId,
            };
          }
        );

        const intakeStatistics: Form[] = await intakeStatsResponse.data.map(
          (form: Form & { firstName: string; lastName: string }) => ({
            id: form.id,
            hashedId: form.id,
            date: form.date,
            name: form.firstName + " " + form.lastName,
            title: "Client Tracking Statistics (Intake Statistics)",
          })
        );

        const frontDeskStats: Form[] = await frontDeskResponse.data.map(
          (form: Form) => ({
            id: form.id,
            hashedId: form.id,
            date: form.date,
            name: form.caseManager,
            title: "Front Desk Monthly Statistics",
          })
        );

        const exitSurveyForms: Form[] = (await exitSurveyResponse.data.data?.map(
          (form: Form) => ({
            id: form.id,
            hashedId: form.id,
            date: form.date,
            name: "",
            title: "Exit Surveys",
          })
        )) || [];

        const successStoryForms: Form[] = (await successStoryResponse.data.map(
          (form: Form) => ({
            id: form.id,
            hashedId: form.id,
            date: form.date,
            name: "",
            title: "Success Stories",
          })
        )) || [];

        const randomSurveyForms: Form[] =
          (await randomClientSurveyResponse.data.map((form: Form) => ({
            id: form.id,
            hashedId: form.id,
            date: form.date,
            name: "",
            title: "Random Client Surveys",
          }))) || [];

        const caseManagerStats: Form[] =
          await caseManagersMonthlyResponse.data.map((form: Form) => {
            const matchingCM = allCaseManagersResponse.data.find(
              (cm: CaseManager) => cm.id === form.cmId
            );
            return {
              id: form.id,
              hashedId: form.id,
              date: form.date,
              name: `${matchingCM?.firstName || ""} ${matchingCM?.lastName || ""}`,
              title: "Case Manager Monthly Statistics",
            };
          });

        setInitialScreeners(initialScreeners);
        setIntakeStatistics(intakeStatistics);
        setFrontDeskStatistics(frontDeskStats);
        setCaseManagerStatistics(caseManagerStats);
        setExitSurvey(exitSurveyForms);
        setSuccessStory(successStoryForms);
        setRandomClientSurvey(randomSurveyForms);

        // const getDate = (date) =>
        //   date?.[0]?.lastUpdatedAt ? new Date(date[0].lastUpdatedAt) : null;
        const getDate = (date: { lastUpdatedAt?: string }[] | undefined) =>
          date?.[0]?.lastUpdatedAt ? new Date(date[0].lastUpdatedAt) : null;

        const initialScreenerDt = getDate(initialScreenerResponse.data);
        const frontDeskDt = getDate(frontDeskMonthlyStatsResponse.data);
        const cmMonthlyDt = getDate(cmMonthlyStatsResponse.data);
        const exitSurveyDt = getDate(lastUpdatedExitSurveyResponse.data);
        const successStoryDt = getDate(lastUpdatedSuccessStoryResponse.data);
        const randomClientSurveyDt = getDate(lastUpdatedRandomSurveyResponse.data);

        setInitialScreenerDate(initialScreenerDt);
        setFrontDeskDate(frontDeskDt);
        setCMMonthlyDate(cmMonthlyDt);
        setExitSurveyDate(exitSurveyDt);
        setSuccessStoryDate(successStoryDt);
        setRandomClientSurveyDate(randomClientSurveyDt);

        const mostRecent = new Date(
          Math.max(
            initialScreenerDt?.getTime() || 0,
            frontDeskDt?.getTime() || 0,
            cmMonthlyDt?.getTime() || 0,
            exitSurveyDt?.getTime() || 0,
            successStoryDt?.getTime() || 0,
            randomClientSurveyDt?.getTime() || 0
          )
        );
        setMostRecentDate(mostRecent.getTime() === 0 ? null : mostRecent);
        setLastUpdated(mostRecent.toLocaleString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backend, refreshTable]);

  useEffect(() => {
    if (clickedFormItem) {
      onOpen();
    }
  }, [clickedFormItem, onOpen]);

  const allFormsData = useMemo(
    () =>
      applyFilters(
        [
          ...initialScreeners,
          ...intakeStatistics,
          ...frontDeskStatistics,
          ...caseManagerStatistics,
          ...(role === "admin"
            ? [...exitSurvey, ...successStory, ...randomClientSurvey]
            : []),
        ],
        filterRows
      ),
    [
      role,
      initialScreeners,
      intakeStatistics,
      frontDeskStatistics,
      caseManagerStatistics,
      exitSurvey,
      successStory,
      randomClientSurvey,
      filterRows,
    ]
  );

  const filteredAllFormsData = useMemo(
    () => applyFilters(allFormsData, filterRows, searchKey),
    [allFormsData, filterRows, searchKey]
  );

  const allFormsTable = useReactTable<Form>({
    data: filteredAllFormsData,
    columns,
    state: { sorting },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filteredInitialScreeners = useMemo(
    () => applyFilters(initialScreeners, filterRows, searchKey),
    [initialScreeners, filterRows, searchKey]
  );

  const initialScreenersTable = useReactTable<Form>({
    data: filteredInitialScreeners,
    columns,
    state: { sorting },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filteredIntakeStatistics = useMemo(
    () => applyFilters(intakeStatistics, filterRows, searchKey),
    [intakeStatistics, filterRows, searchKey]
  );

  const intakeStatisticsTable = useReactTable<Form>({
    data: filteredIntakeStatistics,
    columns,
    state: { sorting },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filteredFrontDeskStatistics = useMemo(
    () => applyFilters(frontDeskStatistics, filterRows, searchKey),
    [frontDeskStatistics, filterRows, searchKey]
  );

  const frontDeskStatisticsTable = useReactTable<Form>({
    data: filteredFrontDeskStatistics,
    columns: frontDeskColumns,
    state: { sorting },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filteredCaseManagerStatistics = useMemo(
    () => applyFilters(caseManagerStatistics, filterRows, searchKey),
    [caseManagerStatistics, filterRows, searchKey]
  );

  const caseManagerStatisticsTable = useReactTable<Form>({
    data: filteredCaseManagerStatistics,
    columns,
    state: { sorting },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filteredExitSurvey = useMemo(
    () => applyFilters(exitSurvey, filterRows, searchKey),
    [exitSurvey, filterRows, searchKey]
  );

  const exitSurveyTable = useReactTable<Form>({
    data: filteredExitSurvey,
    columns,
    state: { sorting },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filteredSuccessStory = useMemo(
    () => applyFilters(successStory, filterRows, searchKey),
    [successStory, filterRows, searchKey]
  );

  const successStoryTable = useReactTable<Form>({
    data: filteredSuccessStory,
    columns,
    state: { sorting },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filteredRandomClientSurvey = useMemo(
    () => applyFilters(randomClientSurvey, filterRows, searchKey),
    [randomClientSurvey, filterRows, searchKey]
  );

  const randomClientSurveyTable = useReactTable<Form>({
    data: filteredRandomClientSurvey,
    columns,
    state: { sorting },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const renderTable = (
    tableInstance: ReturnType<typeof useReactTable<Form>>,
    data: Form[]
  ) => {
    if (loading) {
      return <LoadingWheel />;
    }

    return data.length > 0 ? (
      <Box
        borderWidth="1px"
        borderRadius="12px"
        width="100%"
        borderColor="#E2E8F0"
        padding="12px"
      >
        <TableContainer 
          overflowX="auto"
          css={{
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'transparent',
              borderRadius: '4px',
            },
            '&:hover::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <HStack
            width="100%"
            justify="space-between"
          >
            <HStack padding="5px">
              <FormsListFilter
                filterRows={filterRows}
                setFilterRows={setFilterRows}
              />
            </HStack>
            <HStack
              width="100%"
              justifyContent={"right"}
              gap={"0"}
            >
              <Input
                maxW="20%"
                placeholder="Search"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                display={showSearch ? "block" : "none"}
              />
              <Box
                display="flex"
                alignItems="center"
                paddingX="8px"
                paddingY="8px"
                cursor="pointer"
                onClick={() => {
                  setShowSearch(!showSearch);
                  setSearchKey("");
                }}
              >
                <Button background="white">
                  <MdOutlineManageSearch size="24px" />
                </Button>
              </Box>
              <Tooltip 
                label="Please select rows to export" 
                isDisabled={selectedRowIds.length > 0}
              >
                <Button
                  background="white"
                  display="flex"
                  alignItems="center"
                  paddingX="8px"
                  paddingY="8px"
                  cursor={selectedRowIds.length > 0 ? "pointer" : "not-allowed"}
                  onClick={() => handleExport(tableInstance)}
                  disabled={selectedRowIds.length === 0}
                  color={selectedRowIds.length === 0 ? "gray.400" : "inherit"}
                  _disabled={{ opacity: 1 }}
                >
                  <Box color={selectedRowIds.length === 0 ? "gray.400" : "inherit"}>
                    <MdFileUpload size="16px" />
                  </Box>
                  <Text ml="8px" color={selectedRowIds.length === 0 ? "gray.400" : "inherit"}>Export</Text>
                </Button>
              </Tooltip>
            </HStack>
          </HStack>
          <Box
            borderWidth="1px"
            borderRadius="12px"
            width="100%"
            borderColor="#E2E8F0"
            overflowY="auto"
            overflowX="auto"
            maxHeight="500px"
          >
            <Table variant="striped">
              <Thead>
                {tableInstance.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th
                        key={header.id}
                        cursor={
                          header.column.getCanSort() ? "pointer" : "default"
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <Box
                            display="inline-block"
                            ml={1}
                          >
                            {header.column.getIsSorted() === "asc" ? (
                              <TriangleUpIcon />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <TriangleDownIcon />
                            ) : null}
                          </Box>
                        )}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {tableInstance.getRowModel().rows.map((row, index) => (
                  <Tr
                    key={row.id}
                    onClick={() => {
                      setClickedFormItem(row.original);
                      onOpen();
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Td
                        key={cell.id}
                        onClick={(e) => {
                          if (
                            cell.column.id === "rowNumber" ||
                            cell.column.id === "export"
                          )
                            e.stopPropagation();
                        }}
                      >
                        {cell.column.id === "rowNumber" ? (
                          <HoverCheckbox
                            id={row.original.hashedId}
                            isSelected={selectedRowIds.includes(
                              row.original.hashedId
                            )}
                            onSelectionChange={handleRowSelect}
                            index={index}
                          />
                        ) : cell.column.id === "export" ? (
                          <PrintForm
                            formId={row.original.id}
                            formType={row.original.title}
                          />
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </TableContainer>
      </Box>
    ) : (
      <Box
        borderWidth="1px"
        borderRadius="12px"
        width="100%"
        borderColor="#E2E8F0"
        padding="12px"
      >
        <TableContainer 
          overflowX="auto"
          css={{
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'transparent',
              borderRadius: '4px',
            },
            '&:hover::-webkit-scrollbar-thumb': {
              background: 'rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <HStack
            width="100%"
            justify="space-between"
          >
            <HStack padding="5px">
              <FormsListFilter
                filterRows={filterRows}
                setFilterRows={setFilterRows}
              />
            </HStack>
            <HStack
              width="100%"
              justifyContent={"right"}
              gap={"0"}
            >
              <Input
                maxW="20%"
                placeholder="Search"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                display={showSearch ? "block" : "none"}
              />
              <Box
                display="flex"
                alignItems="center"
                paddingX="8px"
                paddingY="8px"
                cursor="pointer"
                onClick={() => {
                  setShowSearch(!showSearch);
                  setSearchKey("");
                }}
              >
                <Button background="white">
                  <MdOutlineManageSearch size="24px" />
                </Button>
              </Box>
              <Tooltip 
                label="Please select rows to export" 
                isDisabled={selectedRowIds.length > 0}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  paddingX="8px"
                  paddingY="8px"
                  cursor={selectedRowIds.length > 0 ? "pointer" : "not-allowed"}
                >
                  <Button 
                    background="white"
                    onClick={() => handleExport(tableInstance)}
                    disabled={selectedRowIds.length === 0}
                    color={selectedRowIds.length === 0 ? "gray.400" : "inherit"}
                    _disabled={{ opacity: 1 }}
                  >
                    <Box color={selectedRowIds.length === 0 ? "gray.400" : "inherit"}>
                      <MdFileUpload size="16px" />
                    </Box>
                    <Text ml="8px" color={selectedRowIds.length === 0 ? "gray.400" : "inherit"}>Export</Text>
                  </Button>
                </Box>
              </Tooltip>
            </HStack>
          </HStack>
          <Box
            borderWidth="1px"
            borderRadius="12px"
            width="100%"
            borderColor="#E2E8F0"
            overflowY="auto"
            overflowX="auto"
            maxHeight="500px"
          >
            <Table variant="striped">
              <Thead>
                {tableInstance.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th
                        key={header.id}
                        cursor={
                          header.column.getCanSort() ? "pointer" : "default"
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <Box
                            display="inline-block"
                            ml={1}
                          >
                            {header.column.getIsSorted() === "asc" ? (
                              <TriangleUpIcon />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <TriangleDownIcon />
                            ) : null}
                          </Box>
                        )}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                <Tr>
                  <Td
                    colSpan={tableInstance.getAllColumns().length}
                    textAlign="center"
                    py={6}
                  >
                    <Text>No data found.</Text>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box p="4" ml={8}>
      <Text
        fontSize="13pt"
        fontWeight="bold"
      >
        Form History
      </Text>
      <Text fontSize="12pt">Last Updated: {lastUpdated}</Text>

      <Tabs
        isFitted
        w="full"
      >
        <TabList 
          whiteSpace="nowrap" 
          overflowX="auto" 
          overflowY="hidden"
          css={{
            '&::-webkit-scrollbar': {
              height: '0px',
            }
          }}
        >
          <Tab>All Forms</Tab>
          <Tab>Initial Screeners</Tab>
          <Tab>Client Tracking Statistics (Intake Statistics)</Tab>
          <Tab>Front Desk Statistics</Tab>
          <Tab>Case Manager Statistics</Tab>
          {role === "admin" && <Tab>Exit Survey Forms</Tab>}
          {role === "admin" && <Tab>Success Story Forms</Tab>}
          {role === "admin" && <Tab>Random Client Survey Forms</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>{renderTable(allFormsTable, allFormsData)}</TabPanel>
          <TabPanel>
            {renderTable(initialScreenersTable, initialScreeners)}
          </TabPanel>
          <TabPanel>
            {renderTable(intakeStatisticsTable, intakeStatistics)}
          </TabPanel>
          <TabPanel>
            {renderTable(frontDeskStatisticsTable, frontDeskStatistics)}
          </TabPanel>
          <TabPanel>
            {renderTable(caseManagerStatisticsTable, caseManagerStatistics)}
          </TabPanel>
          {role === "admin" && (
            <TabPanel>{renderTable(exitSurveyTable, exitSurvey)}</TabPanel>
          )}
          {role === "admin" && (
            <TabPanel>{renderTable(successStoryTable, successStory)}</TabPanel>
          )}
          {role === "admin" && (
            <TabPanel>
              {renderTable(randomClientSurveyTable, randomClientSurvey)}
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
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
  );
};
