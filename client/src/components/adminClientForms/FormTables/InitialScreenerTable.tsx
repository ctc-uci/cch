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
  useDisclosure,
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
//have to make the separate types for each table

import { useNavigate } from "react-router-dom";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext.ts";
import type { InitialInterview } from "../../../types/initialScreener.ts";
import { formatDateString } from "../../../utils/dateUtils.ts";
import { downloadCSV } from "../../../utils/downloadCSV.ts";
import { DeleteRowModal } from "../../deleteRow/deleteRowModal.tsx";
import FormPreview from "../../formsHub/FormPreview.tsx";
import { HoverCheckbox } from "../../hoverCheckbox/hoverCheckbox.tsx";
import { LoadingWheel } from "../../loading/loading.tsx";
import { FilterTemplate } from "./FilterTemplate.tsx";

export const InitialScreenerTable = () => {
  // still gotta do this -- but I'll do it later
  const headers = [
    "age",
    "applicantType",
    "beenConvicted",
    "childDob",
    "childName",
    "cityOfSchool",
    "clientId",
    "convictedReasonAndTime",
    "currentAddress",
    "currentlyEmployed",
    "currentlyHomeless",
    "custodyOfChild",
    "date",
    "dateOfBirth",
    "disabled",
    "domesticViolenceHistory",
    "educationHistory",
    "email",
    "ethnicity",
    "eventLeadingToHomelessness",
    "fatherName",
    "futurePlansGoals",
    "howHearAboutCch",
    "howLongExperiencingHomelessness",
    "id",
    "lastAlcoholUse",
    "lastDrugUse",
    "lastEmployedDate",
    "lastEmployer",
    "lastPermAddress",
    "lastPermanentResidenceHouseholdComposition",
    "legalResident",
    "lengthOfSobriety",
    "maritalStatus",
    "medical",
    "medicalCity",
    "medicalInsurance",
    "medications",
    "monthlyBills",
    "monthlyIncome",
    "name",
    "nameSchoolChildrenAttend",
    "personalReferenceTelephone",
    "personalReferences",
    "phoneNumber",
    "presentWarrantExist",
    "prevAppliedToCch",
    "prevInCch",
    "probationParoleOfficer",
    "probationParoleOfficerTelephone",
    "programsBeenInBefore",
    "reasonForLeavingPermAddress",
    "socialWorker",
    "socialWorkerOfficeLocation",
    "socialWorkerTelephone",
    "sourcesOfIncome",
    "ssnLastFour",
    "timeUsingDrugsAlcohol",
    "transportation",
    "veteran",
    "warrantCounty",
    "whatCouldPreventHomeless",
    "whenPrevAppliedToCch",
    "whenPrevInCch",
    "whereResideLastNight",
    "whyNoLongerAtLastResidence",
  ];

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
  const [clickedFormItem, setClickedFormItem] = useState<Form | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshTable, setRefreshTable] = useState(false);

  const navigate = useNavigate();
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

  const onPressCSVButton = () => {
    const selectedTableData = initialData.filter((row) =>
      selectedRowIds.includes(row.id)
    );
    const data = selectedTableData.map((row) => ({
      age: row.age,
      applicantType: row.applicantType,
      beenConvicted: row.beenConvicted,
      childDob: row.childDob,
      childName: row.childName,
      cityOfSchool: row.cityOfSchool,
      clientId: row.clientId,
      convictedReasonAndTime: row.convictedReasonAndTime,
      currentAddress: row.currentAddress,
      currentlyEmployed: row.currentlyEmployed,
      currentlyHomeless: row.currentlyHomeless,
      custodyOfChild: row.custodyOfChild,
      date: row.date,
      dateOfBirth: row.dateOfBirth,
      disabled: row.disabled,
      domesticViolenceHistory: row.domesticViolenceHistory,
      educationHistory: row.educationHistory,
      email: row.email,
      ethnicity: row.ethnicity,
      eventLeadingToHomelessness: row.eventLeadingToHomelessness,
      fatherName: row.fatherName,
      futurePlansGoals: row.futurePlansGoals,
      howHearAboutCch: row.howHearAboutCch,
      howLongExperiencingHomelessness: row.howLongExperiencingHomelessness,
      id: row.id,
      lastAlcoholUse: row.lastAlcoholUse,
      lastDrugUse: row.lastDrugUse,
      lastEmployedDate: row.lastEmployedDate,
      lastEmployer: row.lastEmployer,
      lastPermAddress: row.lastPermAddress,
      lastPermanentResidenceHouseholdComposition:
        row.lastPermanentResidenceHouseholdComposition,
      legalResident: row.legalResident,
      lengthOfSobriety: row.lengthOfSobriety,
      maritalStatus: row.maritalStatus,
      medical: row.medical,
      medicalCity: row.medicalCity,
      medicalInsurance: row.medicalInsurance,
      medications: row.medications,
      monthlyBills: row.monthlyBills,
      monthlyIncome: row.monthlyIncome,
      name: row.name,
      nameSchoolChildrenAttend: row.nameSchoolChildrenAttend,
      personalReferenceTelephone: row.personalReferenceTelephone,
      personalReferences: row.personalReferences,
      phoneNumber: row.phoneNumber,
      presentWarrantExist: row.presentWarrantExist,
      prevAppliedToCch: row.prevAppliedToCch,
      prevInCch: row.prevInCch,
      probationParoleOfficer: row.probationParoleOfficer,
      probationParoleOfficerTelephone: row.probationParoleOfficerTelephone,
      programsBeenInBefore: row.programsBeenInBefore,
      reasonForLeavingPermAddress: row.reasonForLeavingPermAddress,
      socialWorker: row.socialWorker,
      socialWorkerOfficeLocation: row.socialWorkerOfficeLocation,
      socialWorkerTelephone: row.socialWorkerTelephone,
      sourcesOfIncome: row.sourcesOfIncome,
      ssnLastFour: row.ssnLastFour,
      timeUsingDrugsAlcohol: row.timeUsingDrugsAlcohol,
      transportation: row.transportation,
      veteran: row.veteran,
      warrantCounty: row.warrantCounty,
      whatCouldPreventHomeless: row.whatCouldPreventHomeless,
      whenPrevAppliedToCch: row.whenPrevAppliedToCch,
      whenPrevInCch: row.whenPrevInCch,
      whereResideLastNight: row.whereResideLastNight,
      whyNoLongerAtLastResidence: row.whyNoLongerAtLastResidence,
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
      setDeleteModalOpen(false);
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

  useEffect(() => {
    if (clickedFormItem) {
      onOpen();
    }
  }, [clickedFormItem, onOpen]);

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
            <Button
              fontSize="12px"
              onClick={() => navigate("/personal")}
            >
              add
            </Button>
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
                          (row.original as { [key: string]: any }).title =
                            "Initial Screeners";
                          setClickedFormItem(row.original);
                          onOpen();
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
        {clickedFormItem && (
          <FormPreview
            clickedFormItem={clickedFormItem}
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setClickedFormItem(null);
            }}
            refreshTable={refreshTable}
            setRefreshTable={setRefreshTable}
          />
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
