import { useEffect, useMemo, useState } from "react";

import { Box, Checkbox, VStack } from "@chakra-ui/react";

import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import type { Client } from "../../../types/client";
import { formatDateString } from "../../../utils/dateUtils";
import { downloadCSV } from "../../../utils/downloadCSV";
import { LoadingWheel } from "../.././loading/loading.tsx";
import { TableControls } from "./TableControls.tsx";
import { TableContent } from "./TableContent.tsx";

interface AllFormTableProps {
  selectedRowIds: number[];
  setSelectedRowIds: (ids: number[] | ((prev: number[]) => number[])) => void;
  deletedRowIds: number[];
}

export const AllFormTable = ({ selectedRowIds, setSelectedRowIds, deletedRowIds }: AllFormTableProps) => {
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
    "unitName",
  ];

  const { backend } = useBackendContext();

  const [clients, setClients] = useState<
    (Client & { isChecked: boolean; isHovered: boolean })[]
  >([]);
  const [searchKey, setSearchKey] = useState("");
  const [filterQuery, setFilterQuery] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [checkboxMode, setCheckboxMode] = useState<'hidden' | 'visible-unchecked' | 'visible-checked'>('hidden');

  // apply local deletion updates when parent deletes rows
  useEffect(() => {
    if (deletedRowIds && deletedRowIds.length > 0) {
      setClients((prev) => prev.filter((c) => !deletedRowIds.includes(c.id)));
      setSelectedRowIds((prev) => prev.filter((id) => !deletedRowIds.includes(id)));
    }
  }, [deletedRowIds, setSelectedRowIds]);

  const columns = useMemo<ColumnDef<Client>[]>(
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
                    // Show and select visible
                    setCheckboxMode('visible-checked');
                    setSelectedRowIds(prev => Array.from(new Set([...prev, ...visibleIds])));
                  } else if (checkboxMode === 'visible-checked') {
                    // Keep visible but uncheck visible
                    setCheckboxMode('visible-unchecked');
                    setSelectedRowIds(prev => prev.filter(id => !visibleIds.includes(id)));
                  } else {
                    // Hide and clear all selections
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
        accessorKey: "unitName",
        header: "Unit",
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
    [selectedRowIds, clients, checkboxMode, setCheckboxMode, setSelectedRowIds]
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
      unitName: client.unitName,
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
      unitName: client.unitName,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        const clientsResponse = await clientsRequest;
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
      <TableControls
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        filterQuery={filterQuery}
        setFilterQuery={setFilterQuery}
        selectedRowIds={selectedRowIds}
        onExport={onPressCSVButton}
        filterType={"allForm"}
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
          />
        )}
      </Box>
    </VStack>
  );
};
