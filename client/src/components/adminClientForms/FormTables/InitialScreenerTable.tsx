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

import { useBackendContext } from "../../../contexts/hooks/useBackendContext.ts";
//have to make the separate types for each table

import type { InitialInterview } from "../../../types/initialScreener.ts";
import { formatDateString } from "../../../utils/dateUtils.ts";
import { downloadCSV } from "../../../utils/downloadCSV.ts";
import { DeleteRowModal } from "../../deleteRow/deleteRowModal.tsx";
import { HoverCheckbox } from "../../hoverCheckbox/hoverCheckbox.tsx";
import { LoadingWheel } from "../../loading/loading.tsx";
import { FilterTemplate } from "./FilterTemplate.tsx";

export const InitialScreenerTable = () => {
  // still gotta do this -- but I'll do it later
  const headers = ["First Name", "Last Name", "Phone Number", "E-mail"];

  const [initialData, setInitialData] = useState<
    (InitialInterview & { isChecked: boolean; isHovered: boolean })[]
  >([]);
  const { backend } = useBackendContext();
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [searchKey, setSearchKey] = useState("");
  const [filterQuery, setFilterQuery] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);

  // const columns = useMemo<ColumnDef<Client>[]>(
  //   () => [
  //     {
  //       id: "rowNumber",
  //       header: ({ table }) => {
  //         return (
  //           <Box textAlign="center">
  //             <Checkbox
  //               isChecked={selectedRowIds.length > 0}
  //               isIndeterminate={table.getIsSomeRowsSelected()}
  //               onChange={handleSelectAllCheckboxClick}
  //             />
  //           </Box>
  //         );
  //       },
  //       enableSorting: false,
  //     },
  //     {
  //       accessorKey: "firstName",
  //       header: "First Name",
  //     },
  //     {
  //       accessorKey: "lastName",
  //       header: "Last Name",
  //     },
  //     {
  //       header: "Case Manager",
  //       accessorFn: (row) =>
  //         `${row.caseManagerFirstName} ${row.caseManagerLastName}`,
  //       cell: ({ row }) => {
  //         const firstName = row.original.caseManagerFirstName;
  //         const lastName = row.original.caseManagerLastName;
  //         return `${firstName} ${lastName}`;
  //       },
  //       sortingFn: (a, b) => {
  //         const aValue = `${a.original.caseManagerFirstName} ${a.original.caseManagerLastName}`;
  //         const bValue = `${b.original.caseManagerFirstName} ${b.original.caseManagerLastName}`;
  //         return aValue.localeCompare(bValue);
  //       },
  //     },
  //     {
  //       accessorKey: "locationName",
  //       header: "Site",
  //     },
  //     {
  //       accessorKey: "grant",
  //       header: "Grant",
  //     },
  //     {
  //       accessorKey: "dateOfBirth",
  //       header: "Birthday",
  //       cell: ({ getValue }) => {
  //         return formatDateString(getValue() as string);
  //       },
  //     },
  //     {
  //       accessorKey: "age",
  //       header: "Age",
  //     },
  //     {
  //       accessorKey: "entranceDate",
  //       header: "Entry Date",
  //       cell: ({ getValue }) => {
  //         return formatDateString(getValue() as string);
  //       },
  //     },
  //     {
  //       accessorKey: "exitDate",
  //       header: "Exit Date",
  //       cell: ({ getValue }) => {
  //         return formatDateString(getValue() as string);
  //       },
  //     },
  //     {
  //       accessorKey: "bedNights",
  //       header: "Bed Nights",
  //     },
  //     {
  //       accessorKey: "bedNightsChildren",
  //       header: "Total Bed Nights w/ Children",
  //     },
  //     {
  //       accessorKey: "pregnantUponEntry",
  //       header: "Pregnant Upon Entry",
  //     },
  //     {
  //       accessorKey: "disabledChildren",
  //       header: "Children w/a Disability",
  //     },
  //     {
  //       accessorKey: "ethnicity",
  //       header: "Ethnicity",
  //     },
  //     {
  //       accessorKey: "race",
  //       header: "Race",
  //     },
  //     {
  //       accessorKey: "cityOfLastPermanentResidence",
  //       header: "City of Last Permanent Residence",
  //     },
  //     {
  //       accessorKey: "priorLiving",
  //       header: "Prior Living",
  //     },
  //     {
  //       accessorKey: "priorLivingCity",
  //       header: "Prior Living City",
  //     },
  //     {
  //       accessorKey: "shelterInLastFiveYears",
  //       header: "Shelter in Last Five Years",
  //     },
  //     {
  //       accessorKey: "homelessnessLength",
  //       header: "Length of Homelessness",
  //     },
  //     {
  //       accessorKey: "chronicallyHomeless",
  //       header: "Chronically Homeless",
  //     },
  //     {
  //       accessorKey: "attendingSchoolUponEntry",
  //       header: "In School Upon Entry",
  //     },
  //     {
  //       accessorKey: "reasonForLeaving",
  //       header: "Reason For Leaving",
  //     },
  //     {
  //       accessorKey: "specificReasonForLeaving",
  //       header: "Specific Reason for Leaving",
  //     },
  //     {
  //       accessorKey: "specificDestination",
  //       header: "Specific Destination",
  //     },
  //     {
  //       accessorKey: "savingsAmount",
  //       header: "Savings Amount",
  //     },
  //     {
  //       accessorKey: "attendingSchoolUponExit",
  //       header: "In School Upon Exit",
  //     },
  //     {
  //       accessorKey: "reunified",
  //       header: "Reunified",
  //     },
  //     {
  //       accessorKey: "successfulCompletion",
  //       header: "Successful Completion",
  //     },
  //     {
  //       accessorKey: "phoneNumber",
  //       header: "Phone Number",
  //     },
  //     {
  //       accessorKey: "email",
  //       header: "Email",
  //     },
  //     {
  //       accessorKey: "emergencyContactName",
  //       header: "Emergency Contact Name",
  //     },
  //     {
  //       accessorKey: "emergencyContactPhoneNumber",
  //       header: "Emergency Contact Phone",
  //     },
  //     {
  //       accessorKey: "medical",
  //       header: "Medical",
  //     },
  //     {
  //       accessorKey: "estimatedExitDate",
  //       header: "Estimated Exit Date",
  //       cell: ({ getValue }) => {
  //         return formatDateString(getValue() as string);
  //       },
  //     },
  //     {
  //       accessorKey: "employmentGained",
  //       header: "Employment Gained",
  //     },
  //     {
  //       accessorKey: "destinationCity",
  //       header: "Destination City",
  //     },
  //   ],
  //   [selectedRowIds, clients]
  // );

  //

  const columns = useMemo<ColumnDef<InitialInterview>[]>(
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
        header: "Client Name",
      },
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
        accessorKey: "whenPrevAppliedToCch",
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
        accessorKey: "custodyOfChild", //is this asking children name or if they have children because if they have more than one child, then one name is a bit pointless
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
        accessorKey: "sourcesOfIncome",
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
      {
        accessorKey: "lastEmployedDate",
        header: "Date of Last Employment",
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
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
        accessorKey: "socialWorker",
        header: "Social Worker Name",
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
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
      },
      {
        accessorKey: "lastAlcoholUse",
        header: "Last Alcohol Use",
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
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
        accessorKey: "personalReferenceTelephone",
        header: "tel",
      },
      {
        accessorKey: "futurePlansGoals",
        header: "Plan Goals",
      },
      {
        accessorKey: "lastPermanentResidenceHouseholdComposition",
        header:
          "Last permanent residence household composition (who did you live with, who paid rent and/or other household expenses)",
      },
      {
        accessorKey: "whyNoLongerAtLastResidence",
        header:
          "Reason why no longer there (list as many reasons as you would like)",
      },
      {
        accessorKey: "whatCouldPreventHomeless",
        header:
          "What would have prevented you from becoming homeless (list as many items as you want)",
      },
    ],
    [selectedRowIds, initialData]
  );
  //def needs ADAPTATION

  const table = useReactTable({
    data: initialData,
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
      setSelectedRowIds(initialData.map((row) => row.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  // this is also something I must fix -- needs ADAPTATION
  const onPressCSVButton = () => {
    const selectedTableData = initialData.filter((row) =>
      selectedRowIds.includes(row.id)
    );

    const data = selectedTableData.map((row) => ({
      "First Name": row.name.split(" ")[0],
      "Last Name": row.name.split(" ")[0],
      "Phone Number": row.phoneNumber,
      "E-mail": row.email,
    }));

    downloadCSV(headers, data, `initial-screeners.csv`);
  };

  // doesn't need any changes
  const handleRowSelect = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRowIds((prev) => [...prev, id]);
    } else {
      setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  //doesn't work yet -- DELETE FROM keyword isn't working and I'm scared of using it
  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRowIds.map((row_id) =>
          backend.delete(`/initialInterview/${row_id}`)
        )
      );
      setInitialData(
        initialData.filter((row) => !selectedRowIds.includes(row.id))
      );
      setSelectedRowIds([]);
      setDeleteModalOpen(true);
    } catch (error) {
      console.error("Error deleting interview", error);
    }
  };

  // actual data call -- needs ADAPTATION
  useEffect(() => {
    const fetchData = async () => {
      try {
        const lastUpdatedRequest = backend.get(`/lastUpdated/initialInterview`);

        let tableDataRequest;
        if (searchKey && filterQuery.length > 1) {
          tableDataRequest = backend.get(
            `/initialInterview/search-filter?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=${searchKey}`
          );
        } else if (searchKey) {
          tableDataRequest = backend.get(
            `/initialInterview/search-filter?page=&filter=&search=${searchKey}`
          );
        } else if (filterQuery.length > 1) {
          tableDataRequest = backend.get(
            `/initialInterview/search-filter?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=`
          );
        } else {
          tableDataRequest = backend.get("/initialInterview");
        }

        const [lastUpdatedResponse, tableDataResponse] = await Promise.all([
          lastUpdatedRequest,
          tableDataRequest,
        ]);
        const date = new Date(lastUpdatedResponse.data[0]?.lastUpdatedAt);
        setLastUpdated(date.toLocaleString());
        setInitialData(tableDataResponse.data);
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
      >
        <Input
          fontSize="12px"
          width="20%"
          height="30px"
          placeholder="search"
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <FilterTemplate setFilterQuery={setFilterQuery} type={"initialScreener"} />
        <HStack
          width="55%"
          justifyContent="space-between"
        >
          <Text fontSize="12px">
            showing {initialData.length} results on this page
          </Text>
          <HStack>
            <Button></Button>
            <Text fontSize="12px">
              page {} of {Math.ceil(initialData.length / 20)}
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
