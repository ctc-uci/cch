import { useEffect, useMemo, useState } from "react";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  IconButton,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
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

import { useBackendContext } from "../../../contexts/hooks/useBackendContext.ts";
//have to make the separate types for each table

import type { ExitSurvey } from "../../../types/exitSurvey.ts";
import { formatDateString } from "../../../utils/dateUtils.ts";
import { downloadCSV } from "../../../utils/downloadCSV.ts";
import { DeleteRowModal } from "../../deleteRow/deleteRowModal.tsx";
import { HoverCheckbox } from "../../hoverCheckbox/hoverCheckbox.tsx";
import { LoadingWheel } from "../../loading/loading.tsx";
import { FilterTemplate } from "./FilterTemplate.tsx";

export const ExitSurveyTable = () => {
  // still gotta do this -- but I'll do it later
  const headers = ["First Name", "Last Name", "Phone Number", "E-mail"];

  const [exitData, setExitData] = useState<
    (ExitSurvey & { isChecked: boolean; isHovered: boolean })[]
  >([]);
  const { backend } = useBackendContext();
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [searchKey, setSearchKey] = useState("");
  const [filterQuery, setFilterQuery] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);

  const columns = useMemo<ColumnDef<ExitSurvey>[]>(
    () => [
      {
        id: "rowNumber",
        header: ({ table }) => {
          return (
            <Box textAlign="center">
              <Checkbox
                isChecked={selectedRowIds.length > 0}
                isIndeterminate={table.getIsSomeRowsSelected()}
                onChange={handleSelectAllCheckboxClick}
              />
            </Box>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "location",
        header: "Site",
      },
      {
        header: "Case Manager",
        accessorFn: (row) => `${row.cmFirstName} ${row.cmLastName}`,
        cell: ({ row }) => {
          const firstName = row.original.cmFirstName;
          const lastName = row.original.cmLastName;
          return `${firstName} ${lastName}`;
        },
        sortingFn: (a, b) => {
          const aValue = `${a.original.cmFirstName} ${a.original.cmLastName}`;
          const bValue = `${b.original.cmFirstName} ${b.original.cmLastName}`;
          return aValue.localeCompare(bValue);
        },
      },
      {
        accessorKey: "programDateCompletion",
        header: "Date of Program Completion",
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
      },
      {
        accessorKey: "cchRating",
        header: "Overall Rating",
      },
      {
        accessorKey: "cchLikeMost",
        header: "What did you like most about CCH?",
      },
      {
        accessorKey: "cchCouldBeImproved",
        header: "What could make CCH better?",
      },
      {
        accessorKey: "lifeSkillsRating",
        header: "Life Skills Meetings Rating",
      },
      {
        accessorKey: "lifeSkillsHelpfulTopics",
        header: "Which Life Skills Most Helpful?",
      },
      {
        accessorKey: "lifeSkillsOfferTopicsInTheFuture",
        header: "What topics CCH offer in the future?",
      },
      {
        accessorKey: "cmRating",
        header: "Case Management Rating",
      },
      {
        accessorKey: "cmChangeAbout",
        header: "What change about Case Management?",
      },
      {
        accessorKey: "cmMostBeneficial",
        header: "Most Beneficial about Case Management?",
      },
      {
        accessorKey: "experienceTakeaway",
        header: "How CCH change your future?",
      },
      {
        accessorKey: "experienceAccomplished",
        header: "What have you accomplished at CCH?",
      },
      {
        accessorKey: "experienceExtraNotes",
        header: "Extra Notes",
      },
    ],
    [selectedRowIds, exitData]
  );

  const table = useReactTable({
    data: exitData,
    columns,
    state: {
      sorting,
    },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleSelectAllCheckboxClick = () => {
    if (selectedRowIds.length === 0) {
      setSelectedRowIds(exitData.map((row) => row.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const onPressCSVButton = () => {
    const selectedTableData = exitData.filter((row) =>
      selectedRowIds.includes(row.id)
    );

    const data = selectedTableData.map((row) => ({
      Site: row.site,
    }));

    downloadCSV(headers, data, `exit-surveys.csv`);
  };

  // doesn't need any changes
  const handleRowSelect = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRowIds((prev) => [...prev, id]);
    } else {
      setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  //not sure if it works -- afraid to try
  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRowIds.map(
          (row_id) => backend.delete(`/exitSurvey/${row_id}`) //check if route exists
        )
      );
      setExitData(
        exitData.filter((row) => !selectedRowIds.includes(row.id))
      );
      setSelectedRowIds([]);
      setDeleteModalOpen(true);
    } catch (error) {
      console.error("Error deleting interview", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lastUpdatedRequest = backend.get(`/lastUpdated/exitSurvey`);

        let tableDataRequest;
        if (searchKey && filterQuery.length > 1) {
          tableDataRequest = backend.get(
            `/exitSurvey/search-filter?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=${searchKey}`
          );
        } else if (searchKey) {
          tableDataRequest = backend.get(
            `/exitSurvey/search-filter?page=&filter=&search=${searchKey}`
          );
        } else if (filterQuery.length > 1) {
          tableDataRequest = backend.get(
            `/exitSurvey/search-filter?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=`
          );
        } else {
          tableDataRequest = backend.get("/exitSurvey/table-data");
        }

        const [lastUpdatedResponse, tableDataResponse] = await Promise.all([
          lastUpdatedRequest,
          tableDataRequest,
        ]);
        const date = new Date(lastUpdatedResponse.data[0]?.lastUpdatedAt);
        setLastUpdated(date.toLocaleString());
        setExitData(tableDataResponse.data);
        console.log(tableDataResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backend, searchKey, filterQuery]);

  return (
    <VStack
      align="start"
      sx={{ maxWidth: "100%", marginX: "auto" }}
    >
      <HStack
        width="100%"
        justifyContent="space-between"
      >
        <Input
          fontSize="12px"
          width="20%"
          height="30px"
          placeholder="search"
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <FilterTemplate setFilterQuery={setFilterQuery} type={"exitSurvey"} />
        <HStack
          width="55%"
          justifyContent="space-between"
        >
          <Text fontSize="12px">
            showing {exitData.length} results on this page
          </Text>
          <HStack>
            <Button></Button>
            <Text fontSize="12px">
              page {} of {Math.ceil(exitData.length / 20)}
            </Text>
            <Button></Button>
          </HStack>
          <HStack>
            <Button
              fontSize="12px"
              onClick={() => setDeleteModalOpen(true)}
              isDisabled={selectedRowIds.length === 0}
            >
              delete
            </Button>
            <Button fontSize="12px">add</Button>
            <IconButton
              aria-label="Download CSV"
              onClick={() => onPressCSVButton()}
            >
              <FiUpload />
            </IconButton>
          </HStack>
        </HStack>
      </HStack>
      <Box
        width={"100%"}
        justifyContent={"center"}
      >
        {loading ? (
          <LoadingWheel />
        ) : (
          <TableContainer
            maxHeight="calc(100vh - 20px)"
            sx={{
              overflowX: "auto",
              overflowY: "auto",
              maxWidth: "100%",
              border: "1px solid gray",
            }}
          >
            <Table variant="striped">
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
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
                {table.getRowModel().rows.map((row, index) => (
                  <Tr
                    key={row.id}
                    cursor="pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Td
                        key={cell.id}
                        fontSize="14px"
                        fontWeight="500px"
                        onClick={(e) => {
                          if (cell.column.id === "rowNumber") {
                            e.stopPropagation();
                          }
                        }}
                      >
                        {cell.column.id === "rowNumber" ? (
                          <HoverCheckbox
                            id={row.original.id}
                            isSelected={selectedRowIds.includes(
                              row.original.id
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
          </TableContainer>
        )}
      </Box>
      <DeleteRowModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </VStack>
  );
};
