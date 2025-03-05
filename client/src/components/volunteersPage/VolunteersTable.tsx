import { useCallback, useEffect, useMemo, useState } from "react";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  HStack,
  IconButton,
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
import { FiUpload } from "react-icons/fi";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import type { Volunteer } from "../../types/volunteer";
import { eventTypes } from "../../types/volunteer";
import VolunteerDrawer from "./VolunteerDrawer";

const VolunteersTable = () => {
  const { backend } = useBackendContext();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [toggleRefresh, setToggleRefresh] = useState(false);
  const [currentlySelectedVolunteer, setCurrentlySelectedVolunteer] =
    useState<Volunteer | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventTypeFilter, setEventTypeFilter] = useState("");

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await backend.get("/volunteers", {
          params: eventTypeFilter ? { eventType: eventTypeFilter } : undefined,
        });
        setVolunteers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, [toggleRefresh, backend, eventTypeFilter]);

  const handleResetDropdowns = () => {
    setEventTypeFilter("");
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
      setToggleRefresh(!toggleRefresh);
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
          const date = getValue() as string;
          return new Date(date).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Uses browser's timezone
          });
        },
      },
      {
        accessorKey: "firstName",
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
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
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <Box>
      <HStack
        width="100%"
        justify="space-between"
        paddingX="20px"
      >
        <HStack
          width="60%"
          justify="space-between"
        >
          <Select
            placeholder="Select Event Type"
            value={eventTypeFilter}
            onChange={(e) => {
              setEventTypeFilter(e.target.value);
            }}
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
          <Select placeholder="Select Frequency">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
          <Select placeholder="Select Date Range">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
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
      <Button
        onClick={handleResetDropdowns}
        size="sm"
        variant="outline"
        ml={4}
      >
        Reset All Filters
      </Button>
      <TableContainer>
        <IconButton aria-label="Download CSV">
          <FiUpload />
        </IconButton>
        <Table variant="striped">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    cursor={header.column.getCanSort() ? "pointer" : "default"}
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
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
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
  );
};

export default VolunteersTable;
