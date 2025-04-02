import { useEffect, useMemo, useState } from "react";

import { useDisclosure } from "@chakra-ui/hooks";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  Input,
  Select,
  Stat,
  StatLabel,
  StatNumber,
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
import { FaBalanceScale, FaDollarSign } from "react-icons/fa";

// import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import {
  formatDateString,
  formatDateStringForAPI,
} from "../../utils/dateUtils";
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox";
import EditDrawer from "./editDonationDrawer";
import { Donation } from "./types";

export const Donations = () => {
  //   const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();

  const [donor, setDonor] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [valueSum, setValueSum] = useState<number | null>(null);
  const [weightSum, setWeightSum] = useState<number | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  const [toggleRefresh, setToggleRefresh] = useState<boolean>(false);

  const handleRowClick = (donation: Donation) => {
    setSelectedDonation(donation);
    onOpen();
  };

  const handleDonorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDonor(event.target.value);
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const dateValue = event.target.value;
    setStartDate(new Date(dateValue));
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setEndDate(new Date(dateValue));
  };

  const onDelete = async () => {
    try {
      await backend.delete("/donations", {
        data: {
          ids: selectedRowIds,
        },
      });
      refreshPage();
    } catch (error) {
      console.error("Error deleting users:", error);
    }
    setSelectedRowIds([]);
  };

  const refreshPage = () => {
    setToggleRefresh(!toggleRefresh);
  };

  const columns = useMemo<ColumnDef<Donation>[]>(
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
        header: "Date",
        accessorFn: (row) => `${row.date}`,
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
      },
      {
        accessorKey: "donor",
        header: "Donor",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "weight",
        header: "Weight (LB)",
      },
      {
        accessorKey: "value",
        header: "Value ($)",
      },
      {
        accessorKey: "total",
        header: "Total",
      },
    ],
    [selectedRowIds, allDonations]
  );

  const table = useReactTable({
    data: allDonations,
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
      setSelectedRowIds(allDonations.map((donation) => donation.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleRowSelect = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRowIds((prev) => [...prev, id]);
    } else {
      setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const formattedStartDate = startDate
        ? formatDateStringForAPI(startDate)
        : "";
      const formattedEndDate = endDate ? formatDateStringForAPI(endDate) : "";

      try {
        const valuesResponse = (
          await backend.get(
            `/donations/valueSum?donor=${donor}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
          )
        ).data[0].sum;
        setValueSum(valuesResponse);
      } catch (error) {
        console.error("Error fetching value sum:", error);
      }

      try {
        const weightResponse = await backend.get(
          `/donations/weightSum?donor=${donor}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );
        setWeightSum(weightResponse.data[0].sum);
      } catch (error) {
        console.error("Error fetching weight sum:", error);
      }

      try {
        const response = await backend.get(
          `/donations/filter?donor=${donor}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );
        setAllDonations(response.data);
      } catch (err) {
        console.error("Error fetching donation data", err);
      }
    };
    fetchData();
  }, [donor, startDate, endDate, toggleRefresh, backend]);

  return (
    <HStack
      w="100%"
      h="100%"
    >
      <VStack
        w="25vw"
        h="100vh"
      >
        <Heading>Donations</Heading>
        <Text>Last Updated: MM/DD/YYYY HH:MM XX</Text>
        <HStack
          border="2px solid #CBD5E0"
          borderRadius="12px"
          p={4}
          w="75%"
          justify="center"
        >
          <Stat>
            <StatNumber
              fontSize={"3xl"}
              fontWeight="bold"
            >
              ${valueSum}
            </StatNumber>
            <StatLabel>
              <HStack spacing={1}>
                <FaDollarSign color="#4397CD" />
                <span>Total Value</span>
              </HStack>
            </StatLabel>
          </Stat>
        </HStack>
        <HStack
          bg="white"
          border="2px solid #CBD5E0"
          borderRadius="12px"
          p={4}
          w="75%"
          justify="center"
        >
          <Stat>
            <StatNumber
              fontSize={"3xl"}
              fontWeight="bold"
            >
              {weightSum}
            </StatNumber>
            <StatLabel>
              <HStack spacing={1}>
                <FaBalanceScale color="#4397CD" />
                <span>Total Weight (lbs)</span>
              </HStack>
            </StatLabel>
          </Stat>
        </HStack>
      </VStack>

      <VStack
        w="69vw"
        h="95vh"
      >
        <HStack
          w="90%"
          spacing={4}
          align="center"
        >
          <Select
            id="donorSelect"
            placeholder="Select Donor"
            w="50%"
            onChange={handleDonorChange}
          >
            <option value="panera">Panera</option>
            <option value="sprouts">Sprouts</option>
            <option value="copia">Copia</option>
            <option value="mcdonalds">Mcdonalds</option>
            <option value="pantry">Pantry</option>
            <option value="grand theater">Grand Theater</option>
            <option value="costco">Costco</option>
          </Select>

          <Select
            placeholder="Select Frequency"
            w="50%"
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>

          <Text>From:</Text>
          <Input
            type="date"
            name="startDate"
            w="40%"
            onChange={handleStartDateChange}
          />
          <Text>To:</Text>
          <Input
            type="date"
            name="endDate"
            w="40%"
            onChange={handleEndDateChange}
          />

          <Button
            ml="auto"
            onClick={onDelete}
          >
            Delete
          </Button>
          <Button
            ml="auto"
            onClick={() => {
              setSelectedDonation(null);
              onOpen();
            }}
          >
            Add
          </Button>
          <EditDrawer
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setSelectedDonation(null);
            }}
            onFormSubmitSuccess={refreshPage}
          />
        </HStack>

        <TableContainer
          width="100%"
          maxHeight="75%"
          sx={{
            overflowX: "auto",
            overflowY: "auto",
            maxWidth: "100%",
          }}
        >
          <Table
            variant="striped"
            sx={{
              borderCollapse: "collapse",
              border: "1px solid gray",
              width: "100%",
            }}
          >
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
                          isSelected={selectedRowIds.includes(row.original.id)}
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
          {selectedDonation && (
            <EditDrawer
              isOpen={isOpen}
              onClose={() => {
                onClose();
                setSelectedDonation(null);
                refreshPage();
              }}
              existingDonation={selectedDonation}
              onFormSubmitSuccess={refreshPage}
            />
          )}
        </TableContainer>
      </VStack>
    </HStack>
  );
};
