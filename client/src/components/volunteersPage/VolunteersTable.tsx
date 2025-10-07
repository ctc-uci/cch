import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  Badge,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
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
import type { Volunteer } from "../../types/volunteer";
import { eventTypes } from "../../types/volunteer";
import { formatDateString } from "../../utils/dateUtils";
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox";
import VolunteerDrawer from "./VolunteerDrawer";
import { LoadingWheel } from "../loading/loading";
import { downloadCSV } from "../../utils/downloadCSV";

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
  const [checkboxMode, setCheckboxMode] = useState<'hidden' | 'visible-unchecked' | 'visible-checked'>('hidden');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [currentlySelectedVolunteer, setCurrentlySelectedVolunteer] =
    useState<Volunteer | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  type FilterField = 'firstName' | 'lastName' | 'email' | 'eventType' | 'hours' | 'value' | 'total';
  type FilterOp = 'contains' | 'equals' | 'starts_with' | 'ends_with' | '>' | '>=' | '<' | '<=';
  type FilterCond = { field: FilterField; op: FilterOp; value: string };
  const [advancedFilters, setAdvancedFilters] = useState<FilterCond[]>([]);
  const [filterCombinator, setFilterCombinator] = useState<'AND' | 'OR'>('AND');

  const filterCount =
    (eventTypeFilter ? 1 : 0) +
    (startDate ? 1 : 0) +
    (endDate ? 1 : 0) +
    advancedFilters.length;
  const isFilterActive = filterCount > 0;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const params = {
          startDate: startDate
            ? startDate.toLocaleDateString("en-US", { timeZone: "UTC" })
            : "",
          endDate: endDate
            ? endDate.toLocaleDateString("en-US", { timeZone: "UTC" })
            : "",
          eventType: eventTypeFilter ? eventTypeFilter : "",
        };
        const response = backend.get("/volunteers", {
          params,
        });
        const totalVolunteers = backend.get("/volunteers/total-volunteers", {
          params,
        });
        const totalHours = backend.get("/volunteers/total-hours", {
          params,
        });
        const [responseData, totalVolunteersData, totalHoursData] =
          await Promise.all([response, totalVolunteers, totalHours]);
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

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  // Header select-all handled inline in header using visible rows

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
        id: "rowNumber",
        header: () => {
          const visibleIds = table.getRowModel().rows.map(r => r.original.id);
          return (
            <Box textAlign="center">
              <Checkbox
                isChecked={checkboxMode === 'visible-checked'}
                isIndeterminate={checkboxMode === 'visible-unchecked'}
                onChange={() => {
                  if (checkboxMode === 'hidden') {
                    // Show and select visible
                    setCheckboxMode('visible-checked');
                    setSelectedVolunteers(prev => Array.from(new Set([...prev, ...visibleIds])));
                  } else if (checkboxMode === 'visible-checked') {
                    // Keep visible but uncheck visible
                    setCheckboxMode('visible-unchecked');
                    setSelectedVolunteers(prev => prev.filter(id => !visibleIds.includes(id)));
                  } else {
                    // Hide and clear all selections
                    setCheckboxMode('hidden');
                    setSelectedVolunteers([]);
                  }
                }}
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
    data: useMemo(() => {
      const base = volunteers.filter((v) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const dateStr = (v.date ? formatDateString(v.date as unknown as string) : "").toLowerCase();
        const nameStr = `${v.firstName ?? ""} ${v.lastName ?? ""}`.trim().toLowerCase();
        const emailStr = (v as any).email ? String((v as any).email).toLowerCase() : "";
        const eventTypeStr = (v.eventType ?? "").toLowerCase();
        const hoursStr = v.hours !== undefined && v.hours !== null ? String(v.hours).toLowerCase() : "";
        const valueStr = v.value !== undefined && v.value !== null ? String(v.value).toLowerCase() : "";
        const totalStr = v.total !== undefined && v.total !== null ? String(v.total).toLowerCase() : "";
        return [dateStr, nameStr, emailStr, eventTypeStr, hoursStr, valueStr, totalStr].some((field) => field.includes(q));
      });

      if (advancedFilters.length === 0) return base;

      const applyCond = (v: Volunteer, cond: FilterCond) => {
        const fieldMap: Record<string, any> = {
          date: v.date,
          firstName: v.firstName,
          lastName: v.lastName,
          email: (v as any).email,
          eventType: v.eventType,
          hours: v.hours,
          value: v.value,
          total: v.total,
        };
        const lhsRaw = fieldMap[cond.field];
        const lhs = lhsRaw === null || lhsRaw === undefined ? '' : String(lhsRaw).toLowerCase();
        const rhs = cond.value.toLowerCase();
        switch (cond.op) {
          case 'contains':
            return lhs.includes(rhs);
          case 'equals':
            return lhs === rhs;
          case 'starts_with':
            return lhs.startsWith(rhs);
          case 'ends_with':
            return lhs.endsWith(rhs);
          case '>':
            return Number(lhsRaw) > Number(cond.value);
          case '<':
            return Number(lhsRaw) < Number(cond.value);
          case '>=':
            return Number(lhsRaw) >= Number(cond.value);
          case '<=':
            return Number(lhsRaw) <= Number(cond.value);
          default:
            return true;
        }
      };

      return base.filter((v) => {
        const results = advancedFilters.map((c) => applyCond(v, c));
        return filterCombinator === 'AND'
          ? results.every(Boolean)
          : results.some(Boolean);
      });
    }, [volunteers, searchQuery, advancedFilters, filterCombinator]),
    columns,
    state: {
      sorting,
    },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    if (isSearchOpen) {
      // focus the input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isSearchOpen]);

  const handleExport = () => {
    const headers = [
      "Date",
      "Volunteer Name",
      "Event Type",
      "Hours",
      "Value ($)",
      "Total ($)",
    ];

    const selectedIdSet = new Set(selectedVolunteers);
    const rows = table
      .getRowModel()
      .rows
      .filter((row) => selectedIdSet.has(row.original.id))
      .map((row) => {
        const v = row.original;
        return {
          "Date": v.date ? formatDateString(v.date as unknown as string) : "",
          "Volunteer Name": `${v.firstName ?? ""} ${v.lastName ?? ""}`.trim(),
          "Event Type": v.eventType ?? "",
          "Hours": v.hours ?? "",
          "Value ($)": v.value ?? "",
          "Total ($)": v.total ?? "",
        } as Record<string, string | number>;
      });

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mi = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    const timestamp = `${yyyy}-${mm}-${dd}_${hh}-${mi}-${ss}`;

    if (rows.length === 0) {
      return;
    }
    downloadCSV(headers, rows, `volunteers_${timestamp}.csv`);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <>
      <HStack
        width="100%"
        justify="space-between"
        align="left"
      >
        {/* <HStack spacing="12px" width="60%">
          <Select
            placeholder="Select Event Type"
            value={eventTypeFilter}
            onChange={(e) => {
              setEventTypeFilter(e.target.value);
            }}
            width="100%"
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
          <Text>From:</Text>
          <Input
            type="date"
            name="startDate"
            w="60%"
            onChange={handleStartDateChange}
          />
          <Text>To:</Text>
          <Input
            type="date"
            name="endDate"
            w="60%"
            onChange={handleEndDateChange}
          />
        </HStack> */}
        {/* <HStack
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
        </HStack> */}
      </HStack>
      {/* Reset moved into filter popover */}
      <Box
        borderWidth="1px"
        borderRadius="12px"
        width="100%"
        borderColor="#E2E8F0"
        padding="12px"
      >
        {loading ? 
        <LoadingWheel/> :
        <TableContainer>
          <HStack
            width="100%"
            justify="space-between"
          >
            <HStack spacing="0px">
              <Popover placement="right-end" closeOnBlur>
                <PopoverTrigger>
                  <Box
                    display="flex"
                    alignItems="center"
                    paddingX="16px"
                    paddingY="8px"
                    cursor="pointer"
                  >
                    <MdOutlineFilterAlt size="16px" />
                    <HStack ml="8px" spacing={2}>
                      <Text>Filter</Text>
                      {isFilterActive && (
                        <Badge colorScheme="blue" borderRadius="full">{filterCount}</Badge>
                      )}
                    </HStack>
                  </Box>
                </PopoverTrigger>
                <PopoverContent w="md">
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Filter options</PopoverHeader>
                  <PopoverBody>
                    {/* <HStack spacing="12px" width="100%">
                      <Select
                        placeholder="Select Event Type"
                        value={eventTypeFilter}
                        onChange={(e) => {
                          setEventTypeFilter(e.target.value);
                        }}
                        width="100%"
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
                    </HStack> */}
                    <HStack mt={3} spacing="12px" align="center">
                      <Text>From:</Text>
                      <Input
                        type="date"
                        name="startDate"
                        w="60%"
                        onChange={handleStartDateChange}
                      />
                      <Text>To:</Text>
                      <Input
                        type="date"
                        name="endDate"
                        w="60%"
                        onChange={handleEndDateChange}
                      />
                    </HStack>
                    <Box mt={4}>
                      <Text fontWeight="semibold" mb={2}>Advanced filters</Text>
                      {advancedFilters.map((cond, idx) => (
                        <HStack key={idx} spacing={2} mb={2}>
                          <Select
                            value={cond.field}
                            onChange={(e) => {
                              const v = e.target.value as FilterField;
                              setAdvancedFilters((prev) => {
                                const next = [...prev];
                                const existing = next[idx] as FilterCond;
                                next[idx] = { field: v, op: existing.op, value: existing.value };
                                return next;
                              });
                            }}
                            size="sm"
                            width="32%"
                          >
                            <option value="firstName">First Name</option>
                            <option value="lastName">Last Name</option>
                            <option value="email">Email</option>
                            <option value="eventType">Event Type</option>
                            <option value="hours">Hours</option>
                            <option value="value">Value</option>
                            <option value="total">Total</option>
                          </Select>
                          <Select
                            value={cond.op}
                            onChange={(e) => {
                              const v = e.target.value as FilterOp;
                              setAdvancedFilters((prev) => {
                                const next = [...prev];
                                const existing = next[idx] as FilterCond;
                                next[idx] = { field: existing.field, op: v, value: existing.value };
                                return next;
                              });
                            }}
                            size="sm"
                            width="28%"
                          >
                            <option value="contains">contains</option>
                            <option value="equals">equals</option>
                            <option value="starts_with">starts with</option>
                            <option value="ends_with">ends with</option>
                            <option value=">">{'>'}</option>
                            <option value=">=">{'>='}</option>
                            <option value="<">{'<'}</option>
                            <option value="<=">{'<='}</option>
                          </Select>
                          <Input
                            value={cond.value}
                            onChange={(e) => {
                              const v = e.target.value;
                              setAdvancedFilters((prev) => {
                                const next = [...prev];
                                const existing = next[idx] as FilterCond;
                                next[idx] = { field: existing.field, op: existing.op, value: v };
                                return next;
                              });
                            }}
                            size="sm"
                            width="32%"
                            placeholder="Value"
                          />
                        <Button
                            size="sm"
                            onClick={() => setAdvancedFilters((prev) => prev.filter((_, i) => i !== idx))}
                          >
                            Remove
                          </Button>
                        </HStack>
                      ))}
                      <HStack justify="space-between">
                        <Button
                          size="sm"
                          onClick={() => setAdvancedFilters((prev) => [...prev, { field: 'eventType', op: 'contains', value: '' }])}
                        >
                          Add filter
                        </Button>
                        <HStack>
                          <Text>Match</Text>
                          <Select
                            size="sm"
                            value={filterCombinator}
                            onChange={(e) => setFilterCombinator(e.target.value as 'AND' | 'OR')}
                            width="100px"
                          >
                            <option value="AND">ALL</option>
                            <option value="OR">ANY</option>
                          </Select>
                          <Text>conditions</Text>
                        </HStack>
                      </HStack>
                    </Box>
                    <HStack mt={3}>
                      <Text
                        onClick={handleResetDropdowns}
                        size="med"
                        color="#3182CE"
                        variant="outline"
                        textDecoration="underline"
                        cursor="pointer"
                      >
                        Reset All Filters
                      </Text>
                    </HStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
            <HStack spacing="0px">
              <Box
                display="flex"
                alignItems="center"
                paddingX="16px"
                paddingY="8px"
              >
                <MdOutlineManageSearch
                  size="24px"
                  onClick={() => setIsSearchOpen((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                />
              </Box>
              {isSearchOpen && (
                <Box paddingY="8px" paddingRight="16px">
                  <Input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    width="260px"
                    size="sm"
                  />
                </Box>
              )}
              <HStack>
                <Box
                  display="flex"
                  alignItems="center"
                  paddingX="16px"
                  paddingY="8px"
                  onClick={selectedVolunteers.length > 0 ? handleExport : undefined}
                  cursor={selectedVolunteers.length > 0 ? "pointer" : "not-allowed"}
                  opacity={selectedVolunteers.length > 0 ? 1 : 0.5}
                >
                  <MdFileUpload size="16px" />
                  <Text ml="8px">{`Export (${selectedVolunteers.length})`}</Text>
                </Box>
                {/* {selectedVolunteers.length === 0 && (
                  <Text fontSize="sm" color="gray.500">Select rows to enable export</Text>
                )} */}
              </HStack>
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
                      <Tooltip
                        key={header.id}
                        label={header.column.getCanSort() ? "Click to sort" : undefined}
                        openDelay={300}
                      >
                        <Th
                          cursor={
                            header.column.getCanSort() ? "pointer" : "default"
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          textAlign="center"
                        >
                          <HStack justify="center" spacing={1}>
                            <Text>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </Text>
                            {header.column.getCanSort() && (
                              <Box display="inline-block">
                                {header.column.getIsSorted() === "asc" ? (
                                  <TriangleUpIcon />
                                ) : header.column.getIsSorted() === "desc" ? (
                                  <TriangleDownIcon />
                                ) : (
                                  <TriangleUpIcon opacity={0.3} />
                                )}
                              </Box>
                            )}
                          </HStack>
                        </Th>
                      </Tooltip>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row, index) => (
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
                        onClick={(e) => {
                          if (cell.column.id === "rowNumber") {
                            e.stopPropagation();
                          }
                        }}
                      >
                        {cell.column.id === "rowNumber" ? (
                          <HoverCheckbox
                            id={row.original.id}
                            isSelected={selectedVolunteers.includes(
                              row.original.id
                            )}
                            onSelectionChange={handleCheckboxChange}
                            index={index}
                            alwaysVisible={checkboxMode !== 'hidden'}
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
        </TableContainer>}
        <HStack
          justify="flex-end"
          mt="12px"
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
