import { useCallback, useEffect, useMemo, useState } from "react";

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
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import type { Client } from "../../types/client";
import { formatDateString } from "../../utils/dateUtils";
import { downloadCSV } from "../../utils/downloadCSV";
import { LoadingWheel } from ".././loading/loading.tsx";
import { UpdateClients } from "../admin/UpdateClient";
import { AddClientForm } from "../clientlist/AddClientForm";
import { ClientListFilter } from "../clientlist/ClientListFilter";
import { DeleteRowModal } from "../deleteRow/deleteRowModal";
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox";
import { UnfinishedClientAlert } from "./UnfinishedClientAlert";

interface ClientListProps {
  admin?: boolean;
}

export const ClientList = ({ admin }: ClientListProps) => {
  const headers = [
    "First Name",
    "Last Name",
    "Phone Number",
    "E-mail",
    "Entrance Date",
    "Exit Date",
    "Birthday",
  ];

  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const navigate = useNavigate();

  const [allClients, setAllClients] = useState<
    (Client & { isChecked: boolean; isHovered: boolean })[]
  >([]);
  const [filteredClients, setFilteredClients] = useState<
    (Client & { isChecked: boolean; isHovered: boolean })[]
  >([]);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [searchKey, setSearchKey] = useState("");
  const [filterQuery, setFilterQuery] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ firstName?: string; lastName?: string }>(
    {}
  );

  const [showUnfinishedAlert, setShowUnfinishedAlert] = useState(false);

  const handleSelectAllCheckboxClick = useCallback(() => {
    if (selectedRowIds.length === 0) {
      setSelectedRowIds(filteredClients.map((client) => client.id));
    } else {
      setSelectedRowIds([]);
    }
  }, [selectedRowIds, filteredClients]);

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
    [selectedRowIds, handleSelectAllCheckboxClick]
  );

  const table = useReactTable({
    data: filteredClients,
    columns,
    state: {
      sorting,
    },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const onPressCSVButton = () => {
    const selectedClients = filteredClients.filter((client) =>
      selectedRowIds.includes(client.id)
    );

    const data = selectedClients.map((client) => ({
      "First Name": client.firstName,
      "Last Name": client.lastName,
      "Phone Number": client.phoneNumber,
      "E-mail": client.email,
      "Entrance Date": client.entranceDate,
      "Exit Date": client.exitDate,
      Birthday: client.dateOfBirth,
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
      setAllClients(
        allClients.filter((client) => !selectedRowIds.includes(client.id))
      );
      setFilteredClients(
        filteredClients.filter((client) => !selectedRowIds.includes(client.id))
      );
      setSelectedRowIds([]);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting clients", error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const lastUpdatedRequest = backend.get(`/lastUpdated/clients`);
      const userRequest = backend.get(`/users/${currentUser?.uid}`);
      const clientsRequest = backend.get("/clients");

      const [lastUpdatedResponse, userResponse, clientsResponse] =
        await Promise.all([lastUpdatedRequest, userRequest, clientsRequest]);

      setUser(userResponse.data[0]);
      const date = new Date(lastUpdatedResponse.data[0]?.lastUpdatedAt);
      setLastUpdated(date.toLocaleString());
      setAllClients(clientsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [backend, currentUser?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Client-side filtering and searching
  useEffect(() => {
    let filtered = [...allClients];

    // Apply search filter
    if (searchKey.trim()) {
      const searchLower = searchKey.toLowerCase().trim();
      filtered = filtered.filter((client) => {
        // Search by first name, last name, or both combined
        const firstName = client.firstName?.toLowerCase() || "";
        const lastName = client.lastName?.toLowerCase() || "";
        const fullName = `${firstName} ${lastName}`.trim();

        // Check if search term matches first name, last name, or full name
        return (
          firstName.includes(searchLower) ||
          lastName.includes(searchLower) ||
          fullName.includes(searchLower) ||
          // Also search other fields like the backend did
          client.phoneNumber?.toLowerCase().includes(searchLower) ||
          client.email?.toLowerCase().includes(searchLower) ||
          client.caseManagerFirstName?.toLowerCase().includes(searchLower) ||
          client.caseManagerLastName?.toLowerCase().includes(searchLower) ||
          client.locationName?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply filter queries
    if (filterQuery.length > 1) {
      filtered = filtered.filter((client) => {
        return filterQuery.slice(1).every((query) => {
          if (!query) return true;

          // Parse the filter query to extract field, operator, and value
          const match = query.match(
            /(\w+\.\w+)\s+(ILIKE|contains|=|!=|>|<)\s+['"]?([^'"]*)['"]?/
          );
          if (!match) return true;

          const [, fieldPath, operator, value] = match;
          if (!fieldPath || !operator || !value) return true;

          const [_table, _field] = fieldPath.split(".");

          // Map database field names to client object properties
          const fieldMap: { [key: string]: string } = {
            "clients.first_name": "firstName",
            "clients.last_name": "lastName",
            "clients.date_of_birth": "dateOfBirth",
            "clients.age": "age",
            "clients.phone_number": "phoneNumber",
            "clients.email": "email",
            "clients.grant": "grant",
            "clients.status": "status",
            "clients.entrance_date": "entranceDate",
            "clients.exit_date": "exitDate",
            "clients.bed_nights": "bedNights",
            "clients.bed_nights_children": "bedNightsChildren",
            "clients.pregnant_upon_entry": "pregnantUponEntry",
            "clients.disabled_children": "disabledChildren",
            "clients.ethnicity": "ethnicity",
            "clients.race": "race",
            "clients.city_of_last_permanent_residence":
              "cityOfLastPermanentResidence",
            "clients.prior_living": "priorLiving",
            "clients.prior_living_city": "priorLivingCity",
            "clients.shelter_in_last_five_years": "shelterInLastFiveYears",
            "clients.homelessness_length": "homelessnessLength",
            "clients.chronically_homeless": "chronicallyHomeless",
            "clients.attending_school_upon_entry": "attendingSchoolUponEntry",
            "clients.employement_gained": "employementGained",
            "clients.reason_for_leaving": "reasonForLeaving",
            "clients.specific_reason_for_leaving": "specificReasonForLeaving",
            "clients.specific_destination": "specificDestination",
            "clients.savings_amount": "savingsAmount",
            "clients.attending_school_upon_exit": "attendingSchoolUponExit",
            "clients.reunified": "reunified",
            "clients.successful_completion": "successfulCompletion",
            "clients.destination_city": "destinationCity",
            "case_managers.first_name": "caseManagerFirstName",
            "case_managers.last_name": "caseManagerLastName",
            "locations.name": "locationName",
          };

          const clientField = fieldMap[fieldPath];
          if (!clientField) return true;

          const clientValue = client[clientField as keyof Client];
          const stringValue = String(clientValue || "").toLowerCase();
          const filterValue = value.toLowerCase();

          switch (operator) {
            case "ILIKE":
            case "contains":
              return stringValue.includes(filterValue);
            case "=":
              return stringValue === filterValue;
            case "!=":
              return stringValue !== filterValue;
            case ">":
              return Number(clientValue) > Number(value);
            case "<":
              return Number(clientValue) < Number(value);
            default:
              return true;
          }
        });
      });
    }

    setFilteredClients(filtered);
  }, [allClients, searchKey, filterQuery]);

  return (
    <VStack
      spacing={6}
      align="start"
      sx={{ maxWidth: "100%", marginX: "auto", padding: "4%" }}
    >
      {showUnfinishedAlert && <UnfinishedClientAlert />}
      <Heading paddingBottom="4%">
        Welcome, {user?.firstName} {user?.lastName}
      </Heading>
      <HStack width="100%">
        <Heading size="md">
          {admin ? "Client Tracking Statistics" : "My Complete Client Table"}
        </Heading>
        <Heading
          size="sm"
          paddingLeft="10%"
        >
          Last Updated: {lastUpdated}
        </Heading>
      </HStack>
      {admin && <UpdateClients />}
      <VStack></VStack>
      <HStack
        width="100%"
        justifyContent="space-between"
      >
        <Input
          fontSize="12px"
          width="20%"
          height="30px"
          placeholder="search by client name"
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <ClientListFilter setFilterQuery={setFilterQuery} />
        <HStack
          width="55%"
          justifyContent="space-between"
        >
          {/* <Text fontSize="12px">
            showing {clients.length} results on this page
          </Text> */}
          <HStack>
            {/* <Button></Button> */}
            {/* <Text fontSize="12px">
              page {} of {Math.ceil(clients.length / 20)}
            </Text> */}
            {/* <Button></Button> */}
          </HStack>
          <HStack>
            <Button
              fontSize="12px"
              onClick={() => setDeleteModalOpen(true)}
              isDisabled={selectedRowIds.length === 0}
            >
              delete
            </Button>
            {/* <Button fontSize="12px">add</Button> */}
            <AddClientForm
              onClientAdded={() => {
                fetchData();
              }}
              setShowUnfinishedAlert={setShowUnfinishedAlert}
            />
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
                    onClick={() => navigate(`/ViewClient/2`)}
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
