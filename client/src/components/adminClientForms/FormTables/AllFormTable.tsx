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

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import type { Client } from "../../../types/client";
import { formatDateString } from "../../../utils/dateUtils";
import { downloadCSV } from "../../../utils/downloadCSV";
import { LoadingWheel } from "../.././loading/loading.tsx";
import { UpdateClients } from "../../admin/UpdateClient";
import { DeleteRowModal } from "../../deleteRow/deleteRowModal";
import { HoverCheckbox } from "../../hoverCheckbox/hoverCheckbox";
import { FilterTemplate } from "./FilterTemplate.tsx";

export const AllFormTable = () => {
  const headers = [
    "age",
    "attendingSchoolUponEntry",
    "attendingSchoolUponExit",
    "bedNights",
    "bedNightsChildren",
    "caseManagerFirstName",
    "caseManagerLastName",
    "chronicallyHomeless",
    "cityOfLastPermanentResidence",
    "comments",
    "createdBy",
    "dateOfBirth",
    "destinationCity",
    "disabledChildren",
    "email",
    "emergencyContactName",
    "emergencyContactPhoneNumber",
    "employementGained",
    "entranceDate",
    "estimatedExitDate",
    "ethnicity",
    "exitDate",
    "firstName",
    "grant",
    "homelessnessLength",
    "id",
    "lastName",
    "locationName",
    "medical",
    "phoneNumber",
    "pregnantUponEntry",
    "priorLiving",
    "priorLivingCity",
    "race",
    "reasonForLeaving",
    "reunified",
    "savingsAmount",
    "shelterInLastFiveYears",
    "specificDestination",
    "specificReasonForLeaving",
    "status",
    "successfulCompletion",
    "unitId",
  ];

  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();

  const [clients, setClients] = useState<
    (Client & { isChecked: boolean; isHovered: boolean })[]
  >([]);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [searchKey, setSearchKey] = useState("");
  const [filterQuery, setFilterQuery] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);

  const columns = useMemo<ColumnDef<Client>[]>(
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
        accessorKey: "firstName",
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
      {
        header: "Case Manager",
        accessorFn: (row) =>
          `${row.caseManagerFirstName} ${row.caseManagerLastName}`,
        cell: ({ row }) => {
          const firstName = row.original.caseManagerFirstName;
          const lastName = row.original.caseManagerLastName;
          return `${firstName} ${lastName}`;
        },
        sortingFn: (a, b) => {
          const aValue = `${a.original.caseManagerFirstName} ${a.original.caseManagerLastName}`;
          const bValue = `${b.original.caseManagerFirstName} ${b.original.caseManagerLastName}`;
          return aValue.localeCompare(bValue);
        },
      },
      {
        accessorKey: "locationName",
        header: "Site",
      },
      {
        accessorKey: "grant",
        header: "Grant",
      },
      {
        accessorKey: "dateOfBirth",
        header: "Birthday",
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
      },
      {
        accessorKey: "age",
        header: "Age",
      },
      {
        accessorKey: "entranceDate",
        header: "Entry Date",
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
      },
      {
        accessorKey: "exitDate",
        header: "Exit Date",
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
      },
      {
        accessorKey: "bedNights",
        header: "Bed Nights",
      },
      {
        accessorKey: "bedNightsChildren",
        header: "Total Bed Nights w/ Children",
      },
      {
        accessorKey: "pregnantUponEntry",
        header: "Pregnant Upon Entry",
      },
      {
        accessorKey: "disabledChildren",
        header: "Children w/a Disability",
      },
      {
        accessorKey: "ethnicity",
        header: "Ethnicity",
      },
      {
        accessorKey: "race",
        header: "Race",
      },
      {
        accessorKey: "cityOfLastPermanentResidence",
        header: "City of Last Permanent Residence",
      },
      {
        accessorKey: "priorLiving",
        header: "Prior Living",
      },
      {
        accessorKey: "priorLivingCity",
        header: "Prior Living City",
      },
      {
        accessorKey: "shelterInLastFiveYears",
        header: "Shelter in Last Five Years",
      },
      {
        accessorKey: "homelessnessLength",
        header: "Length of Homelessness",
      },
      {
        accessorKey: "chronicallyHomeless",
        header: "Chronically Homeless",
      },
      {
        accessorKey: "attendingSchoolUponEntry",
        header: "In School Upon Entry",
      },
      {
        accessorKey: "reasonForLeaving",
        header: "Reason For Leaving",
      },
      {
        accessorKey: "specificReasonForLeaving",
        header: "Specific Reason for Leaving",
      },
      {
        accessorKey: "specificDestination",
        header: "Specific Destination",
      },
      {
        accessorKey: "savingsAmount",
        header: "Savings Amount",
      },
      {
        accessorKey: "attendingSchoolUponExit",
        header: "In School Upon Exit",
      },
      {
        accessorKey: "reunified",
        header: "Reunified",
      },
      {
        accessorKey: "successfulCompletion",
        header: "Successful Completion",
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "emergencyContactName",
        header: "Emergency Contact Name",
      },
      {
        accessorKey: "emergencyContactPhoneNumber",
        header: "Emergency Contact Phone",
      },
      {
        accessorKey: "medical",
        header: "Medical",
      },
      {
        accessorKey: "estimatedExitDate",
        header: "Estimated Exit Date",
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
      },
      {
        accessorKey: "employementGained",
        header: "Employment Gained",
      },
      {
        accessorKey: "destinationCity",
        header: "Destination City",
      },
    ],
    [selectedRowIds, clients]
  );

  const table = useReactTable({
    data: clients,
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
      setSelectedRowIds(clients.map((client) => client.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const onPressCSVButton = () => {
    const selectedClients = clients.filter((client) =>
      selectedRowIds.includes(client.id)
    );

    const data = selectedClients.map((client) => ({
      age: client.age,
      attendingSchoolUponEntry: client.attendingSchoolUponEntry,
      attendingSchoolUponExit: client.attendingSchoolUponExit,
      bedNights: client.bedNights,
      bedNightsChildren: client.bedNightsChildren,
      caseManagerFirstName: client.caseManagerFirstName,
      caseManagerLastName: client.caseManagerLastName,
      chronicallyHomeless: client.chronicallyHomeless,
      cityOfLastPermanentResidence: client.cityOfLastPermanentResidence,
      comments: client.comments,
      createdBy: client.createdBy,
      dateOfBirth: client.dateOfBirth,
      destinationCity: client.destinationCity,
      disabledChildren: client.disabledChildren,
      email: client.email,
      emergencyContactName: client.emergencyContactName,
      emergencyContactPhoneNumber: client.emergencyContactPhoneNumber,
      employementGained: client.employementGained,
      entranceDate: client.entranceDate,
      estimatedExitDate: client.estimatedExitDate,
      ethnicity: client.ethnicity,
      exitDate: client.exitDate,
      firstName: client.firstName,
      grant: client.grant,
      homelessnessLength: client.homelessnessLength,
      id: client.id,
      lastName: client.lastName,
      locationName: client.locationName,
      medical: client.medical,
      phoneNumber: client.phoneNumber,
      pregnantUponEntry: client.pregnantUponEntry,
      priorLiving: client.priorLiving,
      priorLivingCity: client.priorLivingCity,
      race: client.race,
      reasonForLeaving: client.reasonForLeaving,
      reunified: client.reunified,
      savingsAmount: client.savingsAmount,
      shelterInLastFiveYears: client.shelterInLastFiveYears,
      specificDestination: client.specificDestination,
      specificReasonForLeaving: client.specificReasonForLeaving,
      status: client.status,
      successfulCompletion: client.successfulCompletion,
      unitId: client.unitId,
    }));

    downloadCSV(headers, data, `clients.csv`);
  };

  const handleRowSelect = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRowIds((prev) => [...prev, id]);
    } else {
      setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRowIds.map((row_id) => backend.delete(`/clients/${row_id}`))
      );
      setClients(
        clients.filter((client) => !selectedRowIds.includes(client.id))
      );
      setSelectedRowIds([]);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting clients", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lastUpdatedRequest = backend.get(`/lastUpdated/clients`);

        let clientsRequest;
        if (searchKey && filterQuery.length > 1) {
          clientsRequest = backend.get(
            `/clients?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=${searchKey}`
          );
        } else if (searchKey) {
          clientsRequest = backend.get(
            `/clients?page=&filter=&search=${searchKey}`
          );
        } else if (filterQuery.length > 1) {
          clientsRequest = backend.get(
            `/clients?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=`
          );
        } else {
          clientsRequest = backend.get("/clients");
        }

        const [lastUpdatedResponse, clientsResponse] = await Promise.all([
          lastUpdatedRequest,
          clientsRequest,
        ]);

        const date = new Date(lastUpdatedResponse.data[0]?.lastUpdatedAt);
        setLastUpdated(date.toLocaleString());
        setClients(clientsResponse.data);
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
        alignItems="center"
      >
        <HStack width="100%">
          <Input
            fontSize="12px"
            width="20%"
            height="30px"
            placeholder="search"
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <FilterTemplate
            setFilterQuery={setFilterQuery}
            type={"allForm"}
          />
        </HStack>

        <HStack justifyContent="space-between">
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
              isDisabled={selectedRowIds.length === 0}
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
