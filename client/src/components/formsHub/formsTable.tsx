import { useEffect, useMemo, useState } from "react";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  HStack,
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
import type { Form } from "../../types/form";
import { formatDateString } from "../../utils/dateUtils";
import { downloadCSV } from "../../utils/downloadCSV";
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox";
import PrintForm from "../printForm/PrintForm";
import { FormPreview } from "./FormPreview";

export const FormTable = () => {
  const { backend } = useBackendContext();
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [clickedFormItem, setClickedFormItem] = useState<Form | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [initialScreenerDate, setInitialScreenerDate] = useState<Date | null>(
    null
  );
  const [frontDeskDate, setFrontDeskDate] = useState<Date | null>(null);
  const [cmMonthlyDate, setCMMonthlyDate] = useState<Date | null>(null);
  const [mostRecentDate, setMostRecentDate] = useState<Date | null>(null);
  const [initialScreeners, setInitialScreeners] = useState<Form[]>([]);
  const [intakeStatistics, setIntakeStatistics] = useState<Form[]>([]);
  const [frontDeskStatistics, setFrontDeskStatistics] = useState<Form[]>([]);
  const [caseManagerStatistics, setCaseManagerStatistics] = useState<Form[]>(
    []
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Form>[]>(
    () => [
      {
        id: "rowNumber",
        header: ({ table }) => {
          return (
            <Box textAlign="center">
              <Checkbox
                isChecked={selectedRowIds.length > 0}
                isIndeterminate={table.getIsSomeRowsSelected()}
                onChange={() => handleSelectAllCheckboxClick(table)}
              />
            </Box>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
      },
      {
        accessorKey: "name",
        header: "Client Name",
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
      console.log("is checked");
      setSelectedRowIds((prev) => [...prev, hashedId]);
    } else {
      console.log("not checked");
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
        ] = await Promise.all([
          backend.get(`/initialInterview`),
          backend.get(`/frontDesk`),
          backend.get(`/caseManagerMonthlyStats`),
          backend.get(`/caseManagers`),
          backend.get(`/lastUpdated/initial_interview`),
          backend.get(`/lastUpdated/front_desk_monthly`),
          backend.get(`/lastUpdated/cm_monthly_stats`),
        ]);

        const initialScreeners: Form[] = await screenerResponse.data.map(
          (form: Form) => ({
            id: form.id,
            date: form.date,
            name: form.name,
            title: "Initial Screeners",
          })
        );

        const intakeStatistics: Form[] = [];

        const frontDeskStats: Form[] = await frontDeskResponse.data.map(
          (form: Form) => ({
            id: form.id,
            date: form.date,
            name: "",
            title: "Front Desk Monthly Statistics",
          })
        );

        const caseManagerStats: Form[] =
          await caseManagersMonthlyResponse.data.map((form: Form) => {
            const matchingCM = allCaseManagersResponse.data.find(
              (cm) => cm.id === form.cmId
            );
            return {
              id: form.id,
              date: form.date,
              name: `${matchingCM?.firstName || ""} ${matchingCM?.lastName || ""}`,
              title: "Case Manager Monthly Statistics",
            };
          });

        setInitialScreeners(initialScreeners);
        setIntakeStatistics(intakeStatistics);
        setFrontDeskStatistics(frontDeskStats);
        setCaseManagerStatistics(caseManagerStats);

        const getDate = (date) =>
          date?.[0]?.lastUpdatedAt ? new Date(date[0].lastUpdatedAt) : null;

        const initialScreener = getDate(initialScreenerResponse.data);
        const frontDesk = getDate(frontDeskMonthlyStatsResponse.data);
        const cmMonthly = getDate(cmMonthlyStatsResponse.data);

        setInitialScreenerDate(initialScreener);
        setFrontDeskDate(frontDesk);
        setCMMonthlyDate(cmMonthly);

        const mostRecent = new Date(
          Math.max(
            initialScreener?.getTime() || 0,
            frontDesk?.getTime() || 0,
            cmMonthly?.getTime() || 0
          )
        );
        setMostRecentDate(mostRecent.getTime() === 0 ? null : mostRecent);
        setLastUpdated(mostRecent.toLocaleString());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [
    backend,
    initialScreenerDate,
    frontDeskDate,
    cmMonthlyDate,
    mostRecentDate,
  ]);

  const allFormsData = useMemo(
    () => [
      ...initialScreeners,
      ...intakeStatistics,
      ...frontDeskStatistics,
      ...caseManagerStatistics,
    ],
    [
      initialScreeners,
      intakeStatistics,
      frontDeskStatistics,
      caseManagerStatistics,
    ]
  );

  const allFormsTable = useReactTable<Form>({
    data: allFormsData,
    columns,
    state: { sorting },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const initialScreenersTable = useReactTable<Form>({
    data: initialScreeners,
    columns,
    state: { sorting },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const intakeStatisticsTable = useReactTable<Form>({
    data: intakeStatistics,
    columns,
    state: { sorting },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const frontDeskStatisticsTable = useReactTable<Form>({
    data: frontDeskStatistics,
    columns,
    state: { sorting },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const caseManagerStatisticsTable = useReactTable<Form>({
    data: caseManagerStatistics,
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
  ) =>
    data.length > 0 ? (
      <Box
        borderWidth="1px"
        borderRadius="12px"
        width="100%"
        borderColor="#E2E8F0"
        padding="12px"
      >
        <TableContainer>
          <HStack
            width="100%"
            justify="space-between"
          >
            <HStack spacing="0px">
              <Box
                display="flex"
                alignItems="center"
                paddingX="16px"
                paddingY="8px"
              >
                <MdOutlineFilterAlt size="16px" />
                <Text ml="8px">Filter</Text>
              </Box>
            </HStack>
            <HStack spacing="0px">
              <Box
                display="flex"
                alignItems="center"
                paddingX="16px"
                paddingY="8px"
              >
                <MdOutlineManageSearch size="24px" />
              </Box>
              <Box
                display="flex"
                alignItems="center"
                paddingX="16px"
                paddingY="8px"
                cursor="pointer"
                onClick={() => handleExport(allFormsTable)}
              >
                <MdFileUpload size="16px" />
                <Text ml="8px">Export</Text>
              </Box>
            </HStack>
          </HStack>
          <Box
            borderWidth="1px"
            borderRadius="12px"
            width="100%"
            borderColor="#E2E8F0"
            overflow="auto"
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
                          if (cell.column.id === "rowNumber" || cell.column.id === "export")
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
        {clickedFormItem && (
          <FormPreview
            formItem={clickedFormItem}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}
      </Box>
    ) : (
      <Text>No data found.</Text>
    );

  return (
    <Box p="4">
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
        <TabList whiteSpace="nowrap">
          <Tab>All Forms</Tab>
          <Tab>Initial Screeners</Tab>
          <Tab>Client Tracking Statistics (Intake Statistics)</Tab>
          <Tab>Front Desk Statistics</Tab>
          <Tab>Case Manager Statistics</Tab>
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
        </TabPanels>
      </Tabs>
    </Box>
  );
};
