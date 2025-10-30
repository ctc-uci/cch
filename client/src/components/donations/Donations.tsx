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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
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
  useToast,
  VStack,
  Stack
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
import { MdFileUpload, MdOutlineManageSearch } from "react-icons/md";


import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import {
  formatDateString,
} from "../../utils/dateUtils";
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox";
import EditDrawer from "./editDonationDrawer";
import { Donation } from "./types";
import { downloadCSV } from "../../utils/downloadCSV";
import { LoadingWheel } from ".././loading/loading.tsx";
import { DonationFilter } from "./DonationFilter.tsx";
import { DonationListFilter } from "./DonationListFilter.tsx";
import AddDonationsDrawer from "./addDonations/addDonationsDrawer.tsx"


export const Donations = () => {
  const toast = useToast();

  const { backend } = useBackendContext();

  const [donor, setDonor] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [valueSum, setValueSum] = useState<number>(0);
  const [weightSum, setWeightSum] = useState<number>(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  const [toggleRefresh, setToggleRefresh] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const [freq, setFreq] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [donors, setDonors] = useState<string[]>([]);
  const [newDonor, setNewDonor] = useState<string>("");

  const [filterQuery, setFilterQuery] = useState<string[]>([]);
  const [searchKey, setSearchKey] = useState("");

  const [showSearch, setShowSearch] = useState(false);


  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const columnsReg = useMemo<ColumnDef<Donation>[]>(
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

  const columnsFreq = useMemo<ColumnDef<Donation>[]>(
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
        accessorKey: "monthYear",
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
        accessorKey: "totalWeight",
        header: "Total Weight (LB)",
      },
      {
        accessorKey: "totalValue",
        header: "Total Value ($)",
      },
    ],
    [selectedRowIds, allDonations]
  );

  const [columns, setColumns] = useState<ColumnDef<Donation>[]>(freq === "monthly" || freq === "yearly" ? columnsFreq : columnsReg);

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

  const handleAddDonor = async () => {
    try {
      await backend.post("/donations/donors", {
        name: newDonor,
      });
      setDonors((prev) => [...prev, newDonor]);
      setNewDonor("");
    } catch (error) {
      console.error("Error adding donor:", error);
    }
  }

  const handleReset = () => {
    setDonor("");
    setFreq("");
    setColumns(columnsReg);
    setStartDate(null);
    setEndDate(null);
    refreshPage();
  };

  // const handleCheckboxChange = (id: number) =>
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const checked = event.target.checked;
  //   if (checked) {
  //     setDeletes([...deletes, id]);
  //   } else {
  //     setDeletes(deletes.filter((deleteId) => !(deleteId === id)));
  //   }
  // };

  const donorMap: {[key: string]: string} = {
    "panera": "Panera",
    "mcdonalds": "McDonald's",
    "grand theater": "Grand Theater",
    "pantry": "Pantry",
    "copia": "Copia",
    "costco": "Costco",
    "sprouts": "Sprouts",
  }

  const handleFreqChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Handle frequency change logic here
    setFreq(event.target.value);
    if (event.target.value === "monthly" || event.target.value === "yearly") {
      setColumns(columnsFreq);
    } else {
      setColumns(columnsReg);
    }
    refreshPage();
  }

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
      toast({
        title: 'Donation(s) Not Deleted',
        description: "There was something wrong that happened and the donation(s) were not deleted.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setSelectedRowIds([]);
    toast({
      title: 'Selected Donation(s) Deleted',
      description: "The donation(s) have successfully been deleted from the database.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const refreshPage = () => {
    setToggleRefresh(!toggleRefresh);
  };

  const filteredDonations = useMemo(() => {
    // Helper to check if a donation falls within user range
    const withinRange = (dateStr: string) => {
      const date = new Date(dateStr);
      if (startDate && (!dateStr || date < startDate)) return false;
      if (endDate && (!dateStr || date > endDate)) return false;
      return true;
    };

    let filtered = allDonations;
    if (donor) {
      filtered = filtered.filter(d => d.donor === donor);
    }
    // Only filter by date if dates are valid 
    if (startDate || endDate) {
      filtered = filtered.filter(d => withinRange(d.date || d.monthYear));
    }
    return filtered;
  }, [allDonations, donor, startDate, endDate]);

  const table = useReactTable({
    data: filteredDonations,
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

  const onPressCSVButton = () => {
      let headers, data;
      const selectedDonations = allDonations.filter((donation) => selectedRowIds.includes(donation.id));

      const donationsToExport = selectedRowIds.length > 0 ? selectedDonations : allDonations;

      if (freq !== "yearly" && freq !== "monthly") {
        headers = [
          "ID",
          "Date",
          "Donor",
          "Category",
          "Weight (lb)",
          "Value ($)",
          "Total"
        ];

        data = donationsToExport.map((donation) => ({
          "ID": donation.id,
          "Date": donation.date,
          "Donor": donation.donor,
          "Category": donation.category,
          "Weight (lb)": donation.weight,
          "Value ($)": donation.value,
          "Total": donation.total,
        }));

      } else {
        headers = [
          "Date",
          "Donor",
          "Category",
          "Total Weight (lb)",
          "Total Value ($)"
        ];
        data = donationsToExport.map((donation) => ({
          "Date": donation.monthYear,
          "Donor": donation.donor,
          "Category": donation.category,
          "Total Weight (lb)": donation.totalWeight,
          "Total Value ($)": donation.totalValue,
        }));
      }

      const now = new Date();
      const dateStr = now.toLocaleDateString().replace(/\//g, '-');
      const timeStr = now.toLocaleTimeString().replace(/:/g, '-');
      
      // Create descriptive filename
      const freqStr = freq ? `_${freq}` : '';
      const donorStr = donor ? `_${donor}` : '';
      const filename = `donations${freqStr}${donorStr}_${dateStr}_${timeStr}.csv`;

      downloadCSV(headers, data, filename);
      toast({
        title: 'Successfully Exported',
        description: `Donation data exported to ${filename}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    };

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    const fetchData = async () => {

      try {
        const getIsoDateOrEmpty = (date: Date | null) =>
          date instanceof Date && !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : "";
        const start = getIsoDateOrEmpty(startDate);
        const end = getIsoDateOrEmpty(endDate);

        let allDonationsQuery =
          freq === "monthly" ?
            `/donations/monthfilter?donor=${donor}&startDate=${start}&endDate=${end}`
            :
              freq === "yearly" ?
                `/donations/yearfilter?donor=${donor}&startDate=${start}&endDate=${end}`
                : `/donations/filter?donor=${donor}&startDate=${start}&endDate=${end}`;

        if (freq !== "monthly" && freq !== "yearly") {
          allDonationsQuery = `/donations/filter?donor=${donor}&startDate=${start}&endDate=${end}`;
          if (filterQuery.length > 0 || searchKey.length > 0) {
            const filterParam = filterQuery.length > 0 ? encodeURIComponent(filterQuery.join(" ")) : "";
            const searchParam = searchKey.length > 0 ? searchKey : "";
            allDonationsQuery += `&filter=${filterParam}&search=${searchParam}`;
          }
        } else {
          if (filterQuery.length > 0 && searchKey.length > 0) {
            allDonationsQuery += `&filter=${encodeURIComponent(filterQuery.join(" "))}&search=${searchKey}`;
          }
          else if (searchKey.length > 0) {
            allDonationsQuery += `&filter=&search=${searchKey}`;
          }
          else if (filterQuery.length > 0) {
            allDonationsQuery += `&filter=${encodeURIComponent(filterQuery.join(" "))}&search=`;
          }
        }

        const [valuesResponse, weightResponse, donationsResponse, lastUpdatedResponse, donorResponse] = await Promise.all([
          backend.get(`/donations/valueSum?donor=${donor}&startDate=${start}&endDate=${end}`),
          backend.get(`/donations/weightSum?donor=${donor}&startDate=${start}&endDate=${end}`),
          backend.get(allDonationsQuery),
          backend.get(`/lastUpdated/donations`),
          backend.get(`/donations/donors`)
        ]);

        if (!donationsResponse.data[0].id) {
          donationsResponse.data = donationsResponse.data.map((donation: any, index: number) => ({
            ...donation,
            id: index + 1
          }));
        }
        setValueSum(valuesResponse.data[0]?.sum || 0);
        setWeightSum(weightResponse.data[0]?.sum || 0);
        setAllDonations(donationsResponse.data);
        setDonors(donorResponse.data.map((donor: { name: string }) => donor.name));
      
        const date = new Date(lastUpdatedResponse.data[0]?.lastUpdatedAt);
        setLastUpdated(date.toLocaleString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }));

      } catch (error) {
        console.error("Error fetching value sum:", error);
      }finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [donor, startDate, endDate, toggleRefresh, freq, filterQuery, searchKey, backend]);

  return (
    <HStack
      w="100%"
      maxHeight="100%"
    >
      <Stack
        w="25vw"
        h="100vh"
        ml="4rem"
        mt="2rem"
      > 
        <Heading>Donations</Heading>
        <Text>Last Updated: {lastUpdated}</Text>
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
              ${formatter.format(valueSum)}
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
              {formatter.format(weightSum)}
            </StatNumber>
            <StatLabel>
              <HStack spacing={1}>
                <FaBalanceScale color="#4397CD" />
                <span>Total Weight (lbs)</span>
              </HStack>
            </StatLabel>
          </Stat>
        </HStack>
      </Stack>

      <Stack
        w="65vw"
        h="95vh"
      >
        <HStack>
        <HStack
          spacing={4}
          align="center"
          overflowX="auto"
        >
          <DonationFilter
          donors={donors}
        donor={donor}
        setDonor={setDonor}
        newDonor={newDonor}
        setNewDonor={setNewDonor}
        handleAddDonor={handleAddDonor}
        />

            <Select placeholder='Select Frequency' w='50%' onChange={handleFreqChange} value={freq}>
              <option value='monthly'>Monthly</option>
              <option value='yearly'>Yearly</option>
            </Select>

            <Text>From:</Text>
            <Input
              type="date"
              name="startDate"
              w="40%"
              value={startDate instanceof Date && !isNaN(startDate.getTime()) ? startDate.toISOString().split("T")[0] : ""}
              onChange={handleStartDateChange}
            />
            <Text>To:</Text>
            <Input
              type="date"
              name="endDate"
              w="40%"
              value={endDate instanceof Date && !isNaN(endDate.getTime()) ? endDate.toISOString().split("T")[0] : ""}
              onChange={handleEndDateChange}
            />
          </HStack>
          <HStack
            align="right">
            <Button
                ml="auto"
                color = "gray.500"
                background={"white"}
                border={"0.5px solid"}
                borderColor={"gray.300"}
                onClick={onDeleteOpen}
              >
                Delete
              </Button>
              {/* <Button
                ml="auto"
                background={"#4397CD"}
                color="white"
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
              /> */}
              <AddDonationsDrawer refresh={refreshPage}/>
          </HStack>
        </HStack>
        <HStack w="100%" justifyContent="flex-start">
          <Button
            variant = "link"
            color="#4397CD"
            size="sm"
            onClick={handleReset}
          >
            Reset All Dropdowns
          </Button> could move to be inline with filter button?
        </HStack>
        {loading ?
        <LoadingWheel/> :
        <Box border="1px solid" padding = "10px" borderColor="gray.300" borderRadius="md" overflow="hidden" width="100%" maxHeight="80%">
          <HStack padding="5px">
            <DonationListFilter setFilterQuery={setFilterQuery}/>
            <HStack width="100%" justifyContent={"right"}>
              <Input maxWidth="20%" placeholder="search" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} display={showSearch ? 'block' : 'none'}></Input>
              <Box
                display="flex"
                alignItems="center"
                paddingX="16px"
                paddingY="8px"
                cursor="pointer"
                onClick={() => {setShowSearch(!showSearch); setSearchKey("")}}
              >
                <MdOutlineManageSearch size="24px" />
              </Box>
              <Button
                display="flex"
                alignItems="center"
                paddingX="16px"
                paddingY="8px"
                cursor="pointer"
                onClick={() => onPressCSVButton()}
                isDisabled={selectedRowIds.length === 0}
              >
                <MdFileUpload size="16px" />
                <Text ml="8px">Export</Text>
              </Button>
            </HStack>
          </HStack>
          <TableContainer
            width="100%"
            maxHeight="100%"
            paddingBottom="10"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="sm"
            sx={{
              overflowX: "auto",
              overflowY: "auto",
              maxWidth: "100%",
            }}
          >
            <Table
              variant="striped"
              border="1px solid gray"
              borderRadius="lg"
              sx={{
                borderCollapse: "separate",
                borderSpacing: "0",
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
                          cell.column.id === "category" ? (
                            <CategoryChip category={cell.getValue() as string} />
                          ) : (
                            cell.column.id === "donor" ? (
                              <Text>
                                {donorMap[cell.getValue() as string] || 'Costco'}
                              </Text>
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            )
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
        </Box>
        }
      </Stack>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Donation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure? You can't undo this action afterwards.
        </ModalBody>

        <ModalFooter>
          <Button
            color="gray.500"
            background="white"
            border="0.5px solid"
            borderColor="gray.300"
            mr={3}
            onClick={onDeleteClose}
          >
            Cancel
          </Button>
          <Button
            color="white"
            background="#4397CD"
            onClick={() => {
              onDelete();
              onDeleteClose();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    </HStack>
  );
};


const CategoryChip = ({ category }: { category: string }) => {
  const categoryColors: { [key: string]: string } = {
    "food": "#FEEBCB",
    "client": "#BEE3F8",
  };

  const fontColors: { [key: string]: string } = {
    "food": "#652B19",
    "client": "#2A4365",
  };

  return (
    <Box
      backgroundColor={categoryColors[category] || "#CBD5E0"}
      color={fontColors[category] || "#2D3748"}
      borderRadius="lg"
      paddingX={2}
      paddingY={1}
      fontSize="sm"
      width={16}
      textAlign={"center"}
    >
      {category === 'food' ? 'Food' : 'Client'}
    </Box>
  );
}