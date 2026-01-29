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
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
  Tooltip
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
import { MdFileUpload, MdOutlineManageSearch } from "react-icons/md";

interface ClientListProps {
  admin?: boolean;
}

export const ClientList = ({ admin }: ClientListProps) => {
  const headers = [
    "ID",
    "First Name",
    "Last Name",
    "Phone Number",
    "Email",
    "Case Manager First Name",
    "Case Manager Last Name",
    "Entrance Date",
    "Exit Date",
    "Estimated Exit Date",
    "Date of Birth",
    "Age",
    "Bed Nights",
    "Bed Nights Children",
    "Created By",
    "Grant",
    "Emergency Contact Name",
    "Emergency Contact Phone Number",
    "Medical",
    "Pregnant Upon Entry",
    "Disabled Children",
    "Ethnicity",
    "Race",
    "City of Last Permanent Residence",
    "Prior Living",
    "Prior Living City",
    "Shelter in Last Five Years",
    "Homelessness Length",
    "Chronically Homeless",
    "Attending School Upon Entry",
    "Employment Gained",
    "Reason for Leaving",
    "Specific Reason for Leaving",
    "Specific Destination",
    "Savings Amount",
    "Attending School Upon Exit",
    "Reunified",
    "Successful Completion",
    "Destination City",
    "Location Name",
    "Status",
    "Unit ID",
    "Comments",
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [checkboxMode, setCheckboxMode] = useState<
    "hidden" | "visible-unchecked" | "visible-checked"
  >("hidden");

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        id: "rowNumber",
        header: ({ table }) => {
          return (
            <Box textAlign="center">
              <Checkbox
                isChecked={checkboxMode === "visible-checked"}
                isIndeterminate={checkboxMode === "visible-unchecked"}
                onChange={() => {
                  const visibleClientIds = table
                    .getRowModel()
                    .rows.map((r) => r.original.id);

                  if (checkboxMode === "hidden") {
                    setCheckboxMode("visible-checked");
                    setSelectedRowIds((prev) =>
                      Array.from(new Set([...prev, ...visibleClientIds]))
                    );
                  } else if (checkboxMode === "visible-checked") {
                    setCheckboxMode("visible-unchecked");
                    setSelectedRowIds((prev) =>
                      prev.filter((id) => !visibleClientIds.includes(id))
                    );
                  } else {
                    setCheckboxMode("hidden");
                    setSelectedRowIds([]);
                  }
                }}
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
        id: "entranceDate",
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
    [checkboxMode, setSelectedRowIds]
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
      "ID": client.id,
      "First Name": client.firstName,
      "Last Name": client.lastName,
      "Phone Number": client.phoneNumber,
      "Email": client.email,
      "Case Manager First Name": client.caseManagerFirstName,
      "Case Manager Last Name": client.caseManagerLastName,
      "Entrance Date": client.entranceDate,
      "Exit Date": client.exitDate,
      "Estimated Exit Date": client.estimatedExitDate,
      "Date of Birth": client.dateOfBirth,
      "Age": client.age,
      "Bed Nights": client.bedNights,
      "Bed Nights Children": client.bedNightsChildren,
      "Created By": client.createdBy,
      "Grant": client.grant,
      "Emergency Contact Name": client.emergencyContactName,
      "Emergency Contact Phone Number": client.emergencyContactPhoneNumber,
      "Medical": client.medical,
      "Pregnant Upon Entry": client.pregnantUponEntry,
      "Disabled Children": client.disabledChildren,
      "Ethnicity": client.ethnicity,
      "Race": client.race,
      "City of Last Permanent Residence": client.cityOfLastPermanentResidence,
      "Prior Living": client.priorLiving,
      "Prior Living City": client.priorLivingCity,
      "Shelter in Last Five Years": client.shelterInLastFiveYears,
      "Homelessness Length": client.homelessnessLength,
      "Chronically Homeless": client.chronicallyHomeless,
      "Attending School Upon Entry": client.attendingSchoolUponEntry,
      "Employment Gained": client.employementGained,
      "Reason for Leaving": client.reasonForLeaving,
      "Specific Reason for Leaving": client.specificReasonForLeaving,
      "Specific Destination": client.specificDestination,
      "Savings Amount": client.savingsAmount,
      "Attending School Upon Exit": client.attendingSchoolUponExit,
      "Reunified": client.reunified,
      "Successful Completion": client.successfulCompletion,
      "Destination City": client.destinationCity,
      "Location Name": client.locationName,
      "Status": client.status,
      "Unit ID": client.unitId,
      "Comments": client.comments,
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
      setLastUpdated(
        date.toLocaleString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
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
      sx={{ maxWidth: "100%", marginX: "auto", padding: "2% 4%" }}
    >
      {showUnfinishedAlert && <UnfinishedClientAlert />}
      <Heading
        size="md"
        fontWeight="medium"
        color="brand.Blue 500"
      >
        Welcome, {user?.firstName} {user?.lastName}
      </Heading>
      <Stack width="100%">
        <Heading
          size="lg"
          fontWeight="600"
        >
          {admin ? "Client Tracking Statistics" : "My Complete Client Table"}
        </Heading>
        <Heading
          size="sm"
          fontWeight="medium"
          color="brand.Gray 700"
        >
          Last Updated: {lastUpdated}
        </Heading>
      </Stack>
      {admin && <UpdateClients />}
      <Box width="100%">
        <HStack
          width="100%"
          justifyContent="space-between"
          mb={4}
        >
          <Heading
            size="md"
            fontWeight="medium"
            color="brand.Gray 700"
          >
            Client Tracking Statistics Table
          </Heading>
          <HStack>
            <Button

              onClick={() => setDeleteModalOpen(true)}
              isDisabled={selectedRowIds.length === 0}
            >
              Delete
            </Button>
            {/* <Button fontSize="12px">add</Button> */}
            <AddClientForm
              onClientAdded={() => {
                fetchData();
              }}
              setShowUnfinishedAlert={setShowUnfinishedAlert}
            />
          </HStack>
        </HStack>
        <Box
          width="100%"
          border="1px solid"
          borderColor="#E2E8F0"
          borderRadius="md"
          padding="12px"
        >
          <HStack
            width="100%"
            justifyContent="space-between"
          >
            <HStack>
              <ClientListFilter setFilterQuery={setFilterQuery} />
            </HStack>
            <HStack pb={4} width="fit-content">
              {isSearchOpen && (
                <Box paddingRight="16px">
                  <Input
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    placeholder="Search by client name..."
                    width="260px"
                    size="sm"
                    autoFocus
                  />
                </Box>
              )}
              <Box
                display="flex"
                alignItems="center"
                paddingX="16px"
                paddingY="8px"
                cursor="pointer"
                onClick={() => setIsSearchOpen((prev) => !prev)}
              >
                <MdOutlineManageSearch size="24px" />
              </Box>
              <Tooltip
                label={selectedRowIds.length === 0 
                  && "Select rows to export"}
                isDisabled={false}
                placement="top"
              >
                <Box
                    display="flex"
                    alignItems="center"
                    paddingX="16px"
                    paddingY="8px"
                    onClick={selectedRowIds.length > 0 ? onPressCSVButton : undefined}
                    cursor={selectedRowIds.length > 0 ? "pointer" : "not-allowed"}
                    opacity={selectedRowIds.length > 0 ? 1 : 0.5}
                    width="fit-content"
                  >
                    <MdFileUpload size="16px" />
                    <Text ml="8px">{`Export (${selectedRowIds.length})`}</Text>
                </Box>
              </Tooltip>
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
                            position="relative"
                          >
                            <HStack spacing={1} alignItems="center">
                              <Box>{flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}</Box>
                              {header.column.getCanSort() && (
                                <Box ml={1}>
                                  {header.column.getIsSorted() === "asc" ? (
                                    <TriangleUpIcon color="blue.500" />
                                  ) : header.column.getIsSorted() === "desc" ? (
                                    <TriangleDownIcon color="blue.500" />
                                  ) : (
                                    <TriangleDownIcon opacity={0.3} />
                                  )}
                                </Box>
                              )}
                            </HStack>
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
                        onClick={() => navigate(`/ViewClient/${row.original.id}`)}
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
                            alwaysVisible={checkboxMode !== "hidden"}
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
        </Box>
      </Box>
      <DeleteRowModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </VStack>
  );
};
