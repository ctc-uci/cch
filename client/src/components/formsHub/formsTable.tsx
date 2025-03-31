import { useEffect, useMemo, useState } from "react";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  IconButton,
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
} from "@chakra-ui/react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { FiUpload } from "react-icons/fi";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import type { Form, TabData } from "../../types/form";
import { formatDateString } from "../../utils/dateUtils";
import { downloadCSV } from "../../utils/downloadCSV";
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox";
import PrintForm from "../PrintForm";
import { MdFileUpload, MdImportExport, MdOutlineFilterAlt, MdOutlineManageSearch } from "react-icons/md";

export const FormTable = () => {
  const { backend } = useBackendContext();
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [formsTable, setFormsTable] = useState<TabData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [initialScreeners, setInitialScreeners] = useState<Form[]>([]);
  const [intakeStatistics, setIntakeStatistics] = useState<Form[]>([]);
  const [frontDeskStatistics, setFrontDeskStatistics] = useState<Form[]>([]);
  const [caseManagerStatistics, setCaseManagerStatistics] = useState<Form[]>(
    []
  );

  const columns = useMemo<ColumnDef<Form>[]>(
    () => [
      {
        id: "rowNumber",
        header: ({ table }) => {
          return (
            <Checkbox
              isChecked={selectedRowIds.length > 0}
              isIndeterminate={table.getIsSomeRowsSelected()}
              onChange={() => handleSelectAllCheckboxClick(table)}
            />
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
    console.log("hashedid", hashedId);
    console.log("selected", selectedRowIds);

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

  const handleExport = (tableInstance: ReturnType<typeof useReactTable<Form>>) => {
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
    const getData = async () => {
      try {
        const screenerResponse = await backend.get(`/initialInterview`);
        const frontDeskResponse = await backend.get(`/frontDesk`);
        const caseManagersMonthlyResponse = await backend.get(
          `/caseManagerMonthlyStats`
        );
        const allCaseManagersResponse = await backend.get(`/caseManagers`);

        const initialScreeners: Form[] = await screenerResponse.data.map(
          (form: Form) => ({
            id: form.id,
            hashedId: `Initial Screeners ${form.id}`,
            date: form.date,
            name: form.name,
            title: "Initial Screeners",
          })
        );

        const intakeStatistics: Form[] = [];

        const frontDeskStats: Form[] = await frontDeskResponse.data.map(
          (form: Form) => ({
            id: form.id,
            hashedId: `Front Desk Monthly Statistics ${form.id}`,
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
              hashedId: `Case Manager Monthly Statistics ${form.id}`,
              date: form.date,
              name: `${matchingCM.firstName} ${matchingCM.lastName}`,
              title: "Case Manager Monthly Statistics",
            };
          });

        setInitialScreeners(initialScreeners);
        setIntakeStatistics(intakeStatistics);
        setFrontDeskStatistics(frontDeskStats);
        setCaseManagerStatistics(caseManagerStats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [backend]);

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
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const initialScreenersTable = useReactTable<Form>({
    data: initialScreeners,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const intakeStatisticsTable = useReactTable<Form>({
    data: intakeStatistics,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const frontDeskStatisticsTable = useReactTable<Form>({
    data: frontDeskStatistics,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const caseManagerStatisticsTable = useReactTable<Form>({
    data: caseManagerStatistics,
    columns,
    state: { sorting },
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
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
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
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      onClick={(e) => {
                        if (cell.column.id === "rowNumber") e.stopPropagation();
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
      <Text fontSize="12pt">Last Updated: MM/DD/YYYY HH:MM XX</Text>

      <Tabs
        isFitted
        w="full"
      >
        <TabList whiteSpace="nowrap">
          <Tab>All Forms</Tab>
          <Tab>Initial Screeners</Tab>
          <Tab>Intake Statistics</Tab>
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
