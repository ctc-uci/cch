import { useEffect, useMemo, useState } from "react";

import { Box, Checkbox, VStack, useDisclosure } from "@chakra-ui/react";

import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext.ts";
import type { InitialInterview } from "../../../types/initialScreener.ts";
import type { Form } from "../../../types/form.ts";
import { formatDateString } from "../../../utils/dateUtils.ts";
import { downloadCSV } from "../../../utils/downloadCSV.ts";
import FormPreview from "../../formsHub/FormPreview.tsx";
import { LoadingWheel } from "../../loading/loading.tsx";
import { TableControls } from "./TableControls.tsx";
import { TableContent } from "./TableContent.tsx";

interface InitialScreenerTableProps {
  selectedRowIds: number[];
  setSelectedRowIds: (ids: number[] | ((prev: number[]) => number[])) => void;
  deletedRowIds: number[];
}

export const InitialScreenerTable = ({ selectedRowIds, setSelectedRowIds, deletedRowIds }: InitialScreenerTableProps) => {
  // still gotta do this -- but I'll do it later
  const headers = [
    "name",
    "age",
    "dateOfBirth",
    "maritalStatus",
    "phoneNumber",
    "email",
    "ssnLastFour",
    "ethnicity",
    "veteran",
    "disabled",
    "currentAddress",
    "reasonForLeavingPermAddress",
    "whereResideLastNight",
    "currentlyHomeless",
    "eventLeadingToHomelessness",
    "howLongExperiencingHomelessness",
    "prevAppliedToCch",
    "whenPrevAppliedToCch",
    "prevInCch",
    "whenPrevInCch",
    "custodyOfChild",
    "nameSchoolChildrenAttend",
    "cityOfSchool",
    "howHearAboutCch",
    "programsBeenInBefore",
    "monthlyIncome",
    "sourcesOfIncome",
    "monthlyBills",
    "currentlyEmployed",
    "lastEmployer",
    "lastEmployedDate",
    "educationHistory",
    "transportation",
    "legalResident",
    "medical",
    "medicalCity",
    "medicalInsurance",
    "medications",
    "domesticViolenceHistory",
    "socialWorker",
    "socialWorkerTelephone",
    "socialWorkerOfficeLocation",
    "lengthOfSobriety",
    "lastDrugUse",
    "lastAlcoholUse",
    "timeUsingDrugsAlcohol",
    "beenConvicted",
    "convictedReasonAndTime",
    "presentWarrantExist",
    "warrantCounty",
    "probationParoleOfficer",
    "probationParoleOfficerTelephone",
    "personalReferences",
    "personalReferenceTelephone",
    "futurePlansGoals",
    "lastPermanentResidenceHouseholdComposition",
    "whyNoLongerAtLastResidence",
    "whatCouldPreventHomeless",
    "id",
    "applicantType",
    "childDob",
    "childName",
    "clientId",
    "date",
    "fatherName",
    "lastPermAddress",
  ];

  const [initialData, setInitialData] = useState<
    (InitialInterview & { isChecked: boolean; isHovered: boolean })[]
  >([]);
  const { backend } = useBackendContext();
  const [filterQuery, setFilterQuery] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [clickedFormItem, setClickedFormItem] = useState<Form | null>(null);
  const [checkboxMode, setCheckboxMode] = useState<'hidden' | 'visible-unchecked' | 'visible-checked'>('hidden');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshTable, setRefreshTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = useMemo<ColumnDef<InitialInterview>[]>(
    () => [
      {
        id: "rowNumber",
        header: ({ table }) => {
          const visibleIds = table.getRowModel().rows.map(r => r.original.id);
          return (
            <Box textAlign="center">
              <Checkbox
                isChecked={checkboxMode === 'visible-checked'}
                isIndeterminate={checkboxMode === 'visible-unchecked'}
                onChange={() => {
                  if (checkboxMode === 'hidden') {
                    setCheckboxMode('visible-checked');
                    setSelectedRowIds(prev => Array.from(new Set([...prev, ...visibleIds])));
                  } else if (checkboxMode === 'visible-checked') {
                    setCheckboxMode('visible-unchecked');
                    setSelectedRowIds(prev => prev.filter(id => !visibleIds.includes(id)));
                  } else {
                    setCheckboxMode('hidden');
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
    [selectedRowIds, initialData, checkboxMode, setCheckboxMode, setSelectedRowIds]
  );

  // apply local deletion updates when parent deletes rows
  useEffect(() => {
    if (deletedRowIds && deletedRowIds.length > 0) {
      setInitialData((prev) => prev.filter((r) => !deletedRowIds.includes(r.id)));
      setSelectedRowIds((prev) => prev.filter((id) => !deletedRowIds.includes(id)));
    }
  }, [deletedRowIds, setSelectedRowIds]);
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

  const onPressCSVButton = () => {
    const selectedTableData = initialData.filter((row) =>
      selectedRowIds.includes(row.id)
    );
    const data = selectedTableData.map((row) => ({
      name: row.name,
      age: row.age,
      dateOfBirth: row.dateOfBirth,
      maritalStatus: row.maritalStatus,
      phoneNumber: row.phoneNumber,
      email: row.email,
      ssnLastFour: row.ssnLastFour,
      ethnicity: row.ethnicity,
      veteran: row.veteran,
      disabled: row.disabled,
      currentAddress: row.currentAddress,
      reasonForLeavingPermAddress: row.reasonForLeavingPermAddress,
      whereResideLastNight: row.whereResideLastNight,
      currentlyHomeless: row.currentlyHomeless,
      eventLeadingToHomelessness: row.eventLeadingToHomelessness,
      howLongExperiencingHomelessness: row.howLongExperiencingHomelessness,
      prevAppliedToCch: row.prevAppliedToCch,
      whenPrevAppliedToCch: row.whenPrevAppliedToCch,
      prevInCch: row.prevInCch,
      whenPrevInCch: row.whenPrevInCch,
      custodyOfChild: row.custodyOfChild,
      nameSchoolChildrenAttend: row.nameSchoolChildrenAttend,
      cityOfSchool: row.cityOfSchool,
      howHearAboutCch: row.howHearAboutCch,
      programsBeenInBefore: row.programsBeenInBefore,
      monthlyIncome: row.monthlyIncome,
      sourcesOfIncome: row.sourcesOfIncome,
      monthlyBills: row.monthlyBills,
      currentlyEmployed: row.currentlyEmployed,
      lastEmployer: row.lastEmployer,
      lastEmployedDate: row.lastEmployedDate,
      educationHistory: row.educationHistory,
      transportation: row.transportation,
      legalResident: row.legalResident,
      medical: row.medical,
      medicalCity: row.medicalCity,
      medicalInsurance: row.medicalInsurance,
      medications: row.medications,
      domesticViolenceHistory: row.domesticViolenceHistory,
      socialWorker: row.socialWorker,
      socialWorkerTelephone: row.socialWorkerTelephone,
      socialWorkerOfficeLocation: row.socialWorkerOfficeLocation,
      lengthOfSobriety: row.lengthOfSobriety,
      lastDrugUse: row.lastDrugUse,
      lastAlcoholUse: row.lastAlcoholUse,
      timeUsingDrugsAlcohol: row.timeUsingDrugsAlcohol,
      beenConvicted: row.beenConvicted,
      convictedReasonAndTime: row.convictedReasonAndTime,
      presentWarrantExist: row.presentWarrantExist,
      warrantCounty: row.warrantCounty,
      probationParoleOfficer: row.probationParoleOfficer,
      probationParoleOfficerTelephone: row.probationParoleOfficerTelephone,
      personalReferences: row.personalReferences,
      personalReferenceTelephone: row.personalReferenceTelephone,
      futurePlansGoals: row.futurePlansGoals,
      lastPermanentResidenceHouseholdComposition:
        row.lastPermanentResidenceHouseholdComposition,
      whyNoLongerAtLastResidence: row.whyNoLongerAtLastResidence,
      whatCouldPreventHomeless: row.whatCouldPreventHomeless,
      id: row.id,
      applicantType: row.applicantType,
      childDob: row.childDob,
      childName: row.childName,
      clientId: row.clientId,
      date: row.date,
      fatherName: row.fatherName,
      lastPermAddress: row.lastPermAddress,
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

  // actual data call -- needs ADAPTATION
  useEffect(() => {
    const fetchData = async () => {
      try {
        let tableDataRequest;
        if (searchQuery && filterQuery.length > 1) {
          tableDataRequest = backend.get(
            `/initialInterview/search-filter?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=${searchQuery}`
          );
        } else if (searchQuery) {
          tableDataRequest = backend.get(
            `/initialInterview/search-filter?page=&filter=&search=${searchQuery}`
          );
        } else if (filterQuery.length > 1) {
          tableDataRequest = backend.get(
            `/initialInterview/search-filter?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=`
          );
        } else {
          tableDataRequest = backend.get("/initialInterview");
        }

        const tableDataResponse = await tableDataRequest;
        setInitialData(tableDataResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backend, searchQuery, filterQuery]);

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
      <TableControls
        searchKey={searchQuery}
        setSearchKey={setSearchQuery}
        filterQuery={filterQuery}
        setFilterQuery={setFilterQuery}
        selectedRowIds={selectedRowIds}
        onExport={onPressCSVButton}
        filterType={"initialScreener"}
        showExportCount={true}
      />
      <Box
        width={"100%"}
        justifyContent={"center"}
      >
        {loading ? (
          <LoadingWheel />
        ) : (
          <TableContent
            table={table}
            selectedRowIds={selectedRowIds}
            onRowSelect={handleRowSelect}
            checkboxMode={checkboxMode}
            setCheckboxMode={setCheckboxMode}
            onRowClick={(row) => {
              const formItem: Form = {
                ...row,
                hashedId: row.id || 0,
                date: (row as any).date || '',
                name: (row as any).name || '',
                title: 'Initial Screeners' as const,
                id: row.id,
              };
              setClickedFormItem(formItem);
              onOpen();
            }}
          />
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
    </VStack>
  );
};
