import { useCallback, useEffect, useMemo, useState } from "react";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  HStack,
  Input,
  Select,
  Table,
  TableContainer,
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
  MdImportExport,
  MdOutlineFilterAlt,
  MdOutlineManageSearch,
} from "react-icons/md";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import type { Volunteer } from "../../types/volunteer";
import { eventTypes } from "../../types/volunteer";
import VolunteerDrawer from "./VolunteerDrawer";
import { formatDateString } from "../../utils/dateUtils";

interface VolunteersTableProps {
  toggleRefresh: boolean;
  setToggleRefresh: (value: boolean) => void;
  setTotalVolunteers: (value: number) => void;
  setTotalHours: (value: number) => void;
}

const VolunteersTable = ({
  toggleRefresh,
  setToggleRefresh,
  setTotalVolunteers,
  setTotalHours,
}: VolunteersTableProps) => {
  const { backend } = useBackendContext();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [currentlySelectedVolunteer, setCurrentlySelectedVolunteer] =
    useState<Volunteer | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventTypeFilter, setEventTypeFilter] = useState("");

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const params = {startDate: startDate ? startDate.toLocaleDateString('en-US', { timeZone: 'UTC' }) : "", endDate: endDate ? endDate.toLocaleDateString('en-US', { timeZone: 'UTC' }) : "", eventType: eventTypeFilter ? eventTypeFilter : ""};
        const response = backend.get("/volunteers", {
          params,
        });
        const totalVolunteers = backend.get("/volunteers/total-volunteers", {
          params,
        });
        const totalHours = backend.get("/volunteers/total-hours", {
          params,
        });
        const [responseData, totalVolunteersData, totalHoursData] = await Promise.all([response, totalVolunteers, totalHours]);
        setVolunteers(responseData.data);
        setTotalVolunteers(totalVolunteersData.data.totalVolunteers);
        setTotalHours(totalHoursData.data.totalHours);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, [toggleRefresh, backend, eventTypeFilter, startDate, endDate]);

  const handleResetDropdowns = () => {
    setEventTypeFilter("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setStartDate(dateValue ? new Date(dateValue) : undefined);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setEndDate(dateValue ? new Date(dateValue) : undefined);
  };

  const handleCheckboxChange = useCallback((volunteerId: number) => {
    onClose();
    setSelectedVolunteers((prevSelected) =>
      prevSelected.includes(volunteerId)
        ? prevSelected.filter((id) => id !== volunteerId)
        : [...prevSelected, volunteerId]
    );
  }, []);

  const refreshPage = () => {
    setToggleRefresh(!toggleRefresh);
  };

  const handleRowClick = (volunteer: Volunteer) => {
    setCurrentlySelectedVolunteer(volunteer);
    onOpen();
  };

  const handleDelete = async () => {
    if (selectedVolunteers.length === 0) return;

    try {
      await backend.delete("/volunteers", {
        data: { ids: selectedVolunteers },
      });
      setSelectedVolunteers([]);
      refreshPage();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = useMemo<ColumnDef<Volunteer>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (

          <Checkbox
            isChecked={selectedVolunteers.length === volunteers.length}
            onChange={() => {
              if (selectedVolunteers.length === volunteers.length) {
                setSelectedVolunteers([]);
              } else {
                setSelectedVolunteers(volunteers.map((v) => v.id));
              }
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            isChecked={selectedVolunteers.includes(row.original.id)}
            onChange={() => handleCheckboxChange(row.original.id)}
          />
        ),
      },
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
      },
      {
        accessorKey: "volunteerName",
        header: "Volunteer Name",
        cell: ({ row }) => {
          const firstName = row.original.firstName;
          const lastName = row.original.lastName;
          return `${firstName} ${lastName}`;
        },
        sortingFn: (rowA, rowB) => {
          const nameA =
            `${rowA.original.firstName} ${rowA.original.lastName}`.toLowerCase();
          const nameB =
            `${rowB.original.firstName} ${rowB.original.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        },
      },
      // {
      //   accessorKey: "email",
      //   header: "Email",
      // },
      {
        accessorKey: "eventType",
        header: "Event Type",
      },
      {
        accessorKey: "hours",
        header: "Hours",
      },
      {
        accessorKey: "value",
        header: "Value ($)",
      },
      {
        accessorKey: "total",
        header: "Total ($)",
      },
    ],
    [selectedVolunteers, volunteers, handleCheckboxChange]
  );

  const table = useReactTable({
    data: volunteers,
    columns,
    state: {
      sorting,
    },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <>
      <HStack
        width="100%"
        justify="space-between"
        align="left"
      >
        <HStack spacing="12px">
          <Select
            placeholder="Select Event Type"
            value={eventTypeFilter}
            onChange={(e) => {
              setEventTypeFilter(e.target.value);
            }}
            width="auto"
          >
            {eventTypes.map((eventType) => (
              <option
                key={eventType}
                value={eventType}
              >
                {eventType}
              </option>
            ))}
          </Select>
          <Select
            placeholder="Select Frequency"
            width="auto"
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
          <Text>From:</Text>
          <Input type="date" name="startDate" w='40%' onChange={handleStartDateChange}/>
          <Text>To:</Text>
          <Input type="date" name="endDate" w='40%' onChange={handleEndDateChange}/>
        </HStack>
        <HStack
          justify="space-between"
          paddingX="12px"
        >
          <Button
            colorScheme="red"
            onClick={handleDelete}
            isDisabled={selectedVolunteers.length === 0}
          >
            Delete
          </Button>
          <Button
            colorScheme="blue"
            onClick={onOpen}
          >
            Add
          </Button>
          <VolunteerDrawer
            onFormSubmitSuccess={refreshPage}
            onClose={onClose}
            isOpen={isOpen}
          />
        </HStack>
      </HStack>
      <HStack
        width="100%"
        justify="flex-start"
      >
        <Text
          onClick={handleResetDropdowns}
          size="med"
          color="#3182CE"
          variant="outline"
          textDecoration="underline"
        >
          Reset All Dropdowns
        </Text>
      </HStack>
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
              <Box
                display="flex"
                alignItems="center"
                paddingX="16px"
                paddingY="8px"
              >
                <MdImportExport size="16px" />
                <Text ml="8px">Sort</Text>
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
                {table.getRowModel().rows.map((row) => (
                  <Tr
                    key={row.id}
                    onClick={() => handleRowClick(row.original)}
                    cursor="pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Td
                        key={cell.id}
                        fontSize="14px"
                        fontWeight="500px"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </TableContainer>
        {currentlySelectedVolunteer && (
          <VolunteerDrawer
            volunteer={currentlySelectedVolunteer}
            onFormSubmitSuccess={refreshPage}
            isOpen={isOpen}
            onClose={() => {
              setCurrentlySelectedVolunteer(null);
              onClose();
            }}
          />
        )}
      </Box>
    </>
  );
};

export default VolunteersTable;
