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

import { useAuthContext } from "../../contexts/hooks/useAuthContext.ts";
import { useBackendContext } from "../../contexts/hooks/useBackendContext.ts";
import type { Client } from "../../types/client.ts";
import { formatDateString } from "../../utils/dateUtils.ts";
import { downloadCSV } from "../../utils/downloadCSV.ts";
import { UpdateClients } from "../admin/UpdateClient.tsx";
import { ClientListFilter } from "../clientlist/ClientListFilter.tsx";
import { DeleteRowModal } from "../deleteRow/deleteRowModal.tsx";
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox.tsx";
import { LoadingWheel } from "../loading/loading.tsx"


interface ClientListProps {
  admin?: boolean;
}

export const FormClientTable = ({ admin }: ClientListProps) => {
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
        accessorKey: "name",
        header: "First Name",
      },
      {
        accessorKey: "name",
        header: "Last Name",
      },
      // {
      //   header: "Case Manager",
      //   accessorFn: (row) =>
      //     `${row.caseManagerFirstName} ${row.caseManagerLastName}`,
      //   cell: ({ row }) => {
      //     const firstName = row.original.caseManagerFirstName;
      //     const lastName = row.original.caseManagerLastName;
      //     return `${firstName} ${lastName}`;
      //   },
      //   sortingFn: (a, b) => {
      //     const aValue = `${a.original.caseManagerFirstName} ${a.original.caseManagerLastName}`;
      //     const bValue = `${b.original.caseManagerFirstName} ${b.original.caseManagerLastName}`;
      //     return aValue.localeCompare(bValue);
      //   },
      // },
      {
        accessorKey: "age",
        header: "Age",
      },
      {
        accessorKey: "dateOfBirth",
        header: "Birthday",
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
      },
      {
        accessorKey: "maritalStatus",
        header: "Marital Status",
      },

      // {
      //   accessorKey: "entranceDate",
      //   header: "Entry Date",
      //   cell: ({ getValue }) => {
      //     return formatDateString(getValue() as string);
      //   },
      // },
      // {
      //   accessorKey: "exitDate",
      //   header: "Exit Date",
      //   cell: ({ getValue }) => {
      //     return formatDateString(getValue() as string);
      //   },
      // },
      // {
      //   accessorKey: "bedNights",
      //   header: "Bed Nights",
      // },
      {
        accessorKey: "phoneNumber",
        header: "Telephone #",
      },
      {
        accessorKey: "email",
        header: "Email Address",
      },
      {
        accessorKey: "ssnLastFour",
        header: "Last 4 # SSID",
      },
      {
        accessorKey: "ethnicity",
        header: "Ethnicity",
      },
      {
        accessorKey: "veteran",
        header: "Veteran",
      },
      {
        accessorKey: "disabled",
        header: "Disabled",
      },
      {
        accessorKey: "currentAddress",
        header: "Current Address",
      },
      {
        accessorKey: "reasonForLeavingPermAddress",
        header: "Reason For Leaving Permanent Address",
      },
      {
        accessorKey: "whereResideLastNight",
        header: "Lcation of Last Night's Residence",
      },
      {
        accessorKey: "currentlyHomeless",
        header: "Currently Homeless?",
      },
      {
        accessorKey: "eventLeadingToHomelessness",
        header: "If yes, please explain event leading to homelessness",
      },
      {
        accessorKey: "howLongExperiencingHomelessness",
        header: "Length of homelessness",
      },
      {
        accessorKey: "prevAppliedToCch",
        header: "Previously applied to CCH",
      },
      {
        accessorKey: "whenAppliedToCch",
        header: "If yes, when?",
      },
      {
        accessorKey: "prevInCch",
        header: "Have you been in CCH before?",
      },
      {
        accessorKey: "whenPrevInCch",
        header: "If yes, when?",
      },
      {
        accessorKey: "custody_of_child",
        header: "Children",
      },
      {
        accessorKey: "nameSchoolChildrenAttend",
        header: "Children’s Schools",
      },
      {
        accessorKey: "cityOfSchool",
        header: "City of Schools",
      },
      {
        accessorKey: "howHearAboutCch",
        header: "How did you hear about CCH?",
      },
      {
        accessorKey: "programsBeenInBefore",
        header: "What programs have you been in before?",
      },
      {
        accessorKey: "monthlyIncome",
        header: "Monthly Income",
      },
      {
        accessorKey: "sources",
        header: "Sources",
      },
      {
        accessorKey: "monthlyBills",
        header: "Monthly Bills",
      },
      {
        accessorKey: "currentlyEmployed",
        header: "Currently Employed",
      },
      {
        accessorKey: "lastEmployer",
        header: "Last Employer",
      },
      // {
      //   accessorKey: "estimatedExitDate",
      //   header: "Estimated Exit Date",
      //   cell: ({ getValue }) => {
      //     return formatDateString(getValue() as string);
      //   },
      // },
      {
        accessorKey: "lastEmployedDate",
        header: "Date of Last Employment",
      },
      {
        accessorKey: "educationHistory",
        header: "Education History",
      },
      {
        accessorKey: "transportation",
        header: "Transportation",
      },
      {
        accessorKey: "legalResident",
        header: "Legal Resident of US",
      },
      {
        accessorKey: "medical",
        header: "Medical Insurance",
      },
      {
        accessorKey: "medicalCity",
        header: "If yes, what city?",
      },
      {
        accessorKey: "medicalInsurance",
        header: "If no, what insurance?",
      },
      {
        accessorKey: "medications",
        header: "Medical History (medications)",
      },
      {
        accessorKey: "domesticViolenceHistory",
        header: "Domestic Violence History",
      },
      {
        accessorKey: "socialWorkerTelephone",
        header: "Phone Number",
      },
      {
        accessorKey: "socialWorkerOfficeLocation",
        header: "Office Location",
      },
      {
        accessorKey: "lengthOfSobriety",
        header: "Length of Sobriety",
      },
      {
        accessorKey: "lastDrugUse",
        header: "Last Drug Use",
      },
      {
        accessorKey: "lastAlcoholUse",
        header: "Last Alcohol Use",
      },
      {
        accessorKey: "timeUsingDrugsAlcohol",
        header: "Length of Drug/Alcohol Use",
      },
      {
        accessorKey: "beenConvicted",
        header: "Convicted of a Crime",
      },
      {
        accessorKey: "convictedReasonAndTime",
        header: "If yes, for what and why?",
      },
      {
        accessorKey: "presentWarrantExist",
        header: "Any present warrants out for your arrest",
      },
      {
        accessorKey: "warrantCounty",
        header: "County",
      },
      {
        accessorKey: "probationParoleOfficer",
        header: "Probation/Parole Officer",
      },
      {
        accessorKey: "probationParoleOfficerTelephone",
        header: "tel",
      },
      {
        accessorKey: "personalReferences",
        header: "Personal References",
      },
      {
        accessorKey: "personalReferencesTelephone",
        header: "tel",
      },
      {
        accessorKey: "educationHistory",
        header: "Education",
      },
      {
        accessorKey: "futurePlansGoals",
        header: "Plan Goals",
      },
      {
        accessorKey: "whyNoLongerAtLastResidence",
        header: "Reason why no longer there (list as many reasons as you would like)",
      },
      {
        accessorKey: "lastPermanentResidenceHouseholdComposition",
        header: "Last permanent residence household composition (who did you live with, who paid rent and/or other household expenses)",
      },
      {
        accessorKey: "whatCouldPreventHomeless",
        header: "What would have prevented you from becoming homeless (list as many items as you want)",
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
          clientsRequest = backend.get(`/clients?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=${searchKey}`);
        } else if (searchKey) {
          clientsRequest = backend.get(`/clients?page=&filter=&search=${searchKey}`);
        } else if (filterQuery.length > 1) {
          clientsRequest = backend.get(`/clients?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=`);
        } else {
          clientsRequest = backend.get("/initialInterview");
        }
  
        const [lastUpdatedResponse, clientsResponse] = await Promise.all([lastUpdatedRequest, clientsRequest]);
  
        console.log(clientsRequest);
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
      <Box
        width = {'100%'}
        justifyContent={"center"}
      >
      {loading ?
      <LoadingWheel/> : 
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
                        isSelected={selectedRowIds.includes(row.original.id)}
                        onSelectionChange={handleRowSelect}
                        index={index}
                      />
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      }
      </Box>
      <DeleteRowModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </VStack>
  );
};
