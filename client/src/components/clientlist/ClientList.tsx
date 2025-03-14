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
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import type { Client } from "../../types/client";
import { downloadCSV } from "../../utils/downloadCSV";
import { UpdateClients } from "../admin/UpdateClient";
import { ClientListFilter } from "../clientlist/ClientListFilter";
import { DeleteRowModal } from "../deleteRow/deleteRowModal";
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox";

interface ClientListProps {
  admin?: boolean;
}

export const ClientList = ({ admin }: ClientListProps) => {
  const headers = [
    "Client First Name",
    "Client Last Name",
    "Phone Number",
    "E-mail",
    "Entrance Date",
    "Exit Date",
    "Birthday",
  ];

  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();

  const [clients, setClients] = useState<
    (Client & { isChecked: boolean; isHovered: boolean })[]
  >([]);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [searchKey, setSearchKey] = useState("");
  const [filterQuery, setFilterQuery] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => {
          return (
            <HoverCheckbox
              clientId={row.original.id}
              isSelected={selectedRowIds.includes(row.original.id)}
              onSelectionChange={handleRowSelect}
            />
          );
        },
      },
      {
        accessorKey: "firstName",
        header: "Client First Name",
      },
      {
        accessorKey: "lastName",
        header: "Client Last Name",
      },
      {
        header: "Case Manager",
        cell: ({ row }) => {
          const firstName = row.original.caseManagerFirstName;
          const lastName = row.original.caseManagerLastName;
          return `${firstName} ${lastName}`;
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
      },
      {
        accessorKey: "age",
        header: "Age",
      },
      {
        accessorKey: "entranceDate",
        header: "Entry Date",
      },
      {
        accessorKey: "exitDate",
        header: "Exit Date",
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
        accessorKey: "phoneNumber",
        header: "Phone NUmber",
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
      },
      {
        accessorKey: "pregnantUponEntry",
        header: "Pregnant Upon Entry",
      },
      {
        accessorKey: "disabledChildren",
        header: "Disabled Children",
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
        header: "City of last Permanent Residence",
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
        header: "Homelessness Length",
      },
      {
        accessorKey: "chronicallyHomeless",
        header: "Chronically Homeless",
      },
      {
        accessorKey: "attendingSchoolUponEntry",
        header: "Attending School Upon Entry",
      },
      {
        accessorKey: "employmentGained",
        header: "Employment Gained",
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
        header: "Attending School Upon Exit",
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
        accessorKey: "destinationCity",
        header: "Destination City",
      },
    ],
    [selectedRowIds]
  );

  const table = useReactTable({
    data: clients,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const onPressCSVButton = () => {
    const selectedClients = clients.filter((client) =>
      selectedRowIds.includes(client.id)
    );

    const data = selectedClients.map((client) => ({
      "Client First Name": client.firstName,
      "Client Last Name": client.lastName,
      "Phone Number": client.phoneNumber,
      "E-mail": client.email,
      "Entrance Date": client.entranceDate,
      "Exit Date": client.exitDate,
      Birthday: client.dateOfBirth,
    }));

    downloadCSV(headers, data, `clients.csv`);
  };

  //TODO: use this
  const handleSelectAllCheckboxClick = () => {
    if (selectedRowIds.length === 0) {
      setSelectedRowIds(clients.map((client) => client.id));
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
        let response;
        if (searchKey && filterQuery.length > 1) {
          response = await backend.get(
            `/clients?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=${searchKey}`
          );
        } else if (searchKey) {
          response = await backend.get(
            `/clients?page=&filter=&search=${searchKey}`
          );
        } else if (filterQuery.length > 1) {
          response = await backend.get(
            `/clients?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=`
          );
        } else {
          response = await backend.get("/clients");
        }

        setClients(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [backend, searchKey, filterQuery]);

  return (
    <VStack
      spacing={2}
      align="start"
      sx={{ maxWidth: "100%", marginX: "auto", padding: "4%" }}
    >
      <Heading paddingBottom="4%">Welcome, {currentUser?.displayName}</Heading>
      <HStack width="100%">
        <Heading size="md">My Complete Client Table</Heading>
        <Heading
          size="sm"
          paddingLeft="10%"
        >
          Last Updated: {}
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
          placeholder="search"
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <ClientListFilter setFilterQuery={setFilterQuery} />
        <HStack
          width="55%"
          justifyContent="space-between"
        >
          <Text fontSize="12px">
            showing {clients.length} results on this page
          </Text>
          <HStack>
            <Button></Button>
            <Text fontSize="12px">
              page {} of {Math.ceil(clients.length / 20)}
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
      {/* If you want to have a fixed bottom height I'd prob have to change the css of this whole thing no? */}
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
                // onClick={() => handleRowClick(row.original)}
                cursor="pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    fontSize="14px"
                    fontWeight="500px"
                    onClick={(e) => {
                      if (cell.column.id === "id") {
                        e.stopPropagation();
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
          {/* <Thead
            backgroundColor="white"
            position="sticky"
            top={0}
          >
            <Tr>
              <Th>
                <Checkbox
                  colorScheme="cyan"
                  isChecked={selectedRowIds.length > 0}
                  onChange={handleSelectAllCheckboxClick}
                />
              </Th>
              <Th>Client First Name</Th>
              <Th>Client Last Name</Th>
              <Th>Case Manager</Th>
              <Th>Site</Th>
              <Th>Grant</Th>
              <Th>Birthday</Th>
              <Th>Age</Th>
              <Th>Entry Date</Th>
              <Th>Exit Date</Th>
              <Th>Bed Nights</Th>
              <Th>Total Bed Nights w/ Children</Th>
              <Th>Phone Number</Th>
              <Th>Email</Th>
              <Th>Emergency Contact Name</Th>
              <Th>Emergency Contact Phone</Th>
              <Th>Medical</Th>
              <Th>Estimated Exit Date</Th>
              <Th>Pregnant Upon Entry</Th>
              <Th>Disabled Children</Th>
              <Th>Ethnicity</Th>
              <Th>Race</Th>
              <Th>City of last Permanent Residence</Th>
              <Th>Prior Living</Th>
              <Th>Prior Living City</Th>
              <Th>Shelter in Last Five Years</Th>
              <Th>Homelessness Length</Th>
              <Th>Chronically Homelessness</Th>
              <Th>Attending School Upon Entry</Th>
              <Th>Employment Gained</Th>
              <Th>Reason For Leaving</Th>
              <Th>Specific Reason for Leaving</Th>
              <Th>Specific Destination</Th>
              <Th>Savings Amount</Th>
              <Th>Attending School Upon Exit</Th>
              <Th>Reunified</Th>
              <Th>Successful Completion</Th>
              <Th>Destination City</Th>
            </Tr>
          </Thead> */}
          {/* <Tbody>
            {clients
              ? clients.map((client, index) => (
                  <Tr
                    key={client.id}
                    style={{ cursor: "pointer" }}
                  >
                    <Td onClick={(e) => e.stopPropagation()}>
                      <HoverCheckbox
                        clientId={client.id}
                        index={index}
                        isSelected={selectedRowIds.includes(client.id)}
                        onSelectionChange={handleRowSelect}
                      />
                    </Td>
                    <Td>{client.firstName}</Td>
                    <Td>{client.lastName}</Td>
                    <Td>
                      {client.caseManagerFirstName} {client.caseManagerLastName}
                    </Td>
                    <Td>{client.locationName}</Td>
                    <Td>{client.grant}</Td>
                    <Td>{client.dateOfBirth}</Td>
                    <Td>{client.age}</Td>
                    <Td>{client.entranceDate}</Td>
                    <Td>{client.exitDate}</Td>
                    <Td>{client.bedNights}</Td>
                    <Td>{client.bedNightsChildren}</Td>
                    <Td>{client.phoneNumber}</Td>
                    <Td>{client.email}</Td>
                    <Td>{client.emergencyContactName}</Td>
                    <Td>{client.emergencyContactPhoneNumber}</Td>
                    <Td>{client.medical ? "Yes" : "No"}</Td>
                    <Td>{client.estimatedExitDate}</Td>
                    <Td>{client.pregnantUponEntry ? "Yes" : "No"}</Td>
                    <Td>{client.disabledChildren ? "Yes" : "No"}</Td>
                    <Td>{client.ethnicity}</Td>
                    <Td>{client.race}</Td>
                    <Td>{client.cityOfLastPermanentResidence}</Td>
                    <Td>{client.priorLiving}</Td>
                    <Td>{client.priorLivingCity}</Td>
                    <Td>{client.shelterInLastFiveYears ? "Yes" : "No"}</Td>
                    <Td>{client.homelessnessLength}</Td>
                    <Td>{client.chronicallyHomeless ? "Yes" : "No"}</Td>
                    <Td>{client.attendingSchoolUponEntry ? "Yes" : "No"}</Td>
                    <Td>{client.employementGained ? "Yes" : "No"}</Td>
                    <Td>{client.reasonForLeaving}</Td>
                    <Td>{client.specificReasonForLeaving}</Td>
                    <Td>{client.specificDestination}</Td>
                    <Td>{client.savingsAmount}</Td>
                    <Td>{client.attendingSchoolUponExit ? "Yes" : "No"}</Td>
                    <Td>{client.reunified ? "Yes" : "No"}</Td>
                    <Td>{client.successfulCompletion ? "Yes" : "No"}</Td>
                    <Td>{client.destinationCity}</Td>
                  </Tr>
                ))
              : null}
          </Tbody> */}
        </Table>
      </TableContainer>
      <DeleteRowModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </VStack>
  );
};
