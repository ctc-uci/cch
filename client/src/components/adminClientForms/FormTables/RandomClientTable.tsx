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
import type { RandomSurvey } from "../../../types/randomSurvey.ts";
import type { Form } from "../../../types/form.ts";
import { formatDateString } from "../../../utils/dateUtils.ts";
import { downloadCSV } from "../../../utils/downloadCSV.ts";
import FormPreview from "../../formsHub/FormPreview.tsx";
import { LoadingWheel } from "../../loading/loading.tsx";
import { TableControls } from "./TableControls.tsx";
import { TableContent } from "./TableContent.tsx";

interface RandomClientTableProps {
  selectedRowIds: number[];
  setSelectedRowIds: (ids: number[] | ((prev: number[]) => number[])) => void;
}

export const RandomClientTable = ({ selectedRowIds, setSelectedRowIds }: RandomClientTableProps) => {
  // still gotta do this -- but I'll do it later
  const headers = [
    "caseMeetingFrequency",
    "cchQos",
    "clean",
    "cmFeedback",
    "cmFirstName",
    "cmLastName",
    "cmQos",
    "courteous",
    "date",
    "entryQuality",
    "id",
    "informative",
    "lifeskills",
    "makeCchMoreHelpful",
    "otherComments",
    "overallExperience",
    "promptAndHelpful",
    "recommend",
    "recommendReasoning",
    "unitQuality",
  ];

  const [randomData, setRandomData] = useState<
    (RandomSurvey & { isChecked: boolean; isHovered: boolean })[]
  >([]);
  const { backend } = useBackendContext();
  const [searchKey, setSearchKey] = useState("");
  const [filterQuery, setFilterQuery] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [clickedFormItem, setClickedFormItem] = useState<Form | null>(null);
  const [checkboxMode, setCheckboxMode] = useState<'hidden' | 'visible-unchecked' | 'visible-checked'>('hidden');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshTable, setRefreshTable] = useState(false);

  const columns = useMemo<ColumnDef<RandomSurvey>[]>(
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
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
      },
      {
        accessorKey: "cchQos",
        header: "Quality of Service: CCH",
      },
      {
        accessorKey: "cmQos",
        header: "Quality of Service: Case Management",
      },
      {
        accessorKey: "courteous",
        header: "CM: Courteous",
      },
      {
        accessorKey: "informative",
        header: "CM: Informative",
      },
      {
        accessorKey: "promptAndHelpful",
        header: "CM: Prompt and HelpfuL",
      },
      {
        accessorKey: "entryQuality",
        header: "Quality of CCH Entrance",
      },
      {
        accessorKey: "unitQuality",
        header: "Quality of Unit",
      },
      {
        accessorKey: "clean",
        header: "Site Cleanliness",
      },
      {
        accessorKey: "overallExperience",
        header: "Overall Experience",
      },
      {
        accessorKey: "caseMeetingFrequency",
        header: "Case Meeting Frequency",
      },
      {
        accessorKey: "lifeskills",
        header: "Life Skills Classes Beneficial?",
      },
      {
        accessorKey: "recommend",
        header: "Recommend CCH",
      },
      {
        accessorKey: "recommendReasoning",
        header: "Why or why not?",
      },
      {
        accessorKey: "makeCchMoreHelpful",
        header: "How make CCH more helpful?",
      },
      {
        header: "Case Manager",
        accessorFn: (row) => `${row.cmFirstName} ${row.cmLastName}`,
        cell: ({ row }) => {
          const firstName = row.original.cmFirstName;
          const lastName = row.original.cmLastName;
          return `${firstName} ${lastName}`;
        },
        sortingFn: (a, b) => {
          const aValue = `${a.original.cmFirstName} ${a.original.cmLastName}`;
          const bValue = `${b.original.cmFirstName} ${b.original.cmLastName}`;
          return aValue.localeCompare(bValue);
        },
      },
      {
        accessorKey: "cmFeedback",
        header: "Case Manager Feedback",
      },
      {
        accessorKey: "otherComments",
        header: "Additional Comments/Suggestions",
      },
    ],
    [selectedRowIds, randomData, checkboxMode, setCheckboxMode, setSelectedRowIds]
  );

  const table = useReactTable({
    data: randomData,
    columns,
    state: {
      sorting,
    },
    sortDescFirst: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  //needs changes
  const onPressCSVButton = () => {
    const selectedTableData = randomData.filter((row) =>
      selectedRowIds.includes(row.id)
    );
    const data = selectedTableData.map((row) => ({
      caseMeetingFrequency: row.caseMeetingFrequency,
      cchQos: row.cchQos,
      clean: row.clean,
      cmFeedback: row.cmFeedback,
      cmFirstName: row.cmFirstName,
      cmLastName: row.cmLastName,
      cmQos: row.cmQos,
      courteous: row.courteous,
      date: row.date,
      entryQuality: row.entryQuality,
      id: row.id,
      informative: row.informative,
      lifeskills: row.lifeskills,
      makeCchMoreHelpful: row.makeCchMoreHelpful,
      otherComments: row.otherComments,
      overallExperience: row.overallExperience,
      promptAndHelpful: row.promptAndHelpful,
      recommend: row.recommend,
      recommendReasoning: row.recommendReasoning,
      unitQuality: row.unitQuality,
    }));

    downloadCSV(headers, data, `random-client-surveys.csv`);
  };

  // doesn't need any changes
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
        let tableDataRequest;
        if (searchKey && filterQuery.length > 1) {
          tableDataRequest = backend.get(
            `/randomSurvey/search-filter?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=${searchKey}`
          );
        } else if (searchKey) {
          tableDataRequest = backend.get(
            `/randomSurvey/search-filter?page=&filter=&search=${searchKey}`
          );
        } else if (filterQuery.length > 1) {
          tableDataRequest = backend.get(
            `/randomSurvey/search-filter?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=`
          );
        } else {
          tableDataRequest = backend.get("/randomSurvey/table-data");
        }

        const tableDataResponse = await tableDataRequest;
        setRandomData(tableDataResponse.data);
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
      <TableControls
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        filterQuery={filterQuery}
        setFilterQuery={setFilterQuery}
        selectedRowIds={selectedRowIds}
        onExport={onPressCSVButton}
        filterType={"randomSurvey"}
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
                title: 'Random Client Surveys' as const,
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
