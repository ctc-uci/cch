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
import type { ExitSurvey } from "../../../types/exitSurvey.ts";
import type { Form } from "../../../types/form.ts";
import { formatDateString } from "../../../utils/dateUtils.ts";
import { downloadCSV } from "../../../utils/downloadCSV.ts";
import FormPreview from "../../formsHub/FormPreview.tsx";
import { LoadingWheel } from "../../loading/loading.tsx";
import { TableControls } from "./TableControls.tsx";
import { TableContent } from "./TableContent.tsx";

interface ExitSurveyTableProps {
  selectedRowIds: number[];
  setSelectedRowIds: (ids: number[] | ((prev: number[]) => number[])) => void;
  deletedRowIds: number[];
}

export const ExitSurveyTable = ({ selectedRowIds, setSelectedRowIds, deletedRowIds }: ExitSurveyTableProps) => {
  // still gotta do this -- but I'll do it later
  const headers = [
    "cchCouldBeImproved",
    "cchLikeMost",
    "cchRating",
    "cmChangeAbout",
    "cmFirstName",
    "cmLastName",
    "cmMostBeneficial",
    "cmRating",
    "experienceAccomplished",
    "experienceExtraNotes",
    "experienceTakeaway",
    "id",
    "lifeSkillsHelpfulTopics",
    "lifeSkillsOfferTopicsInTheFuture",
    "lifeSkillsRating",
    "location",
    "programDateCompletion",
  ];
  const [exitData, setExitData] = useState<
    (ExitSurvey & { isChecked: boolean; isHovered: boolean })[]
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

  const columns = useMemo<ColumnDef<ExitSurvey>[]>(
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
        accessorKey: "location",
        header: "Site",
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
        accessorKey: "programDateCompletion",
        header: "Date of Program Completion",
        cell: ({ getValue }) => {
          return formatDateString(getValue() as string);
        },
      },
      {
        accessorKey: "cchRating",
        header: "Overall Rating",
      },
      {
        accessorKey: "cchLikeMost",
        header: "What did you like most about CCH?",
      },
      {
        accessorKey: "cchCouldBeImproved",
        header: "What could make CCH better?",
      },
      {
        accessorKey: "lifeSkillsRating",
        header: "Life Skills Meetings Rating",
      },
      {
        accessorKey: "lifeSkillsHelpfulTopics",
        header: "Which Life Skills Most Helpful?",
      },
      {
        accessorKey: "lifeSkillsOfferTopicsInTheFuture",
        header: "What topics CCH offer in the future?",
      },
      {
        accessorKey: "cmRating",
        header: "Case Management Rating",
      },
      {
        accessorKey: "cmChangeAbout",
        header: "What change about Case Management?",
      },
      {
        accessorKey: "cmMostBeneficial",
        header: "Most Beneficial about Case Management?",
      },
      {
        accessorKey: "experienceTakeaway",
        header: "How CCH change your future?",
      },
      {
        accessorKey: "experienceAccomplished",
        header: "What have you accomplished at CCH?",
      },
      {
        accessorKey: "experienceExtraNotes",
        header: "Extra Notes",
      },
    ],
    [selectedRowIds, exitData, checkboxMode, setCheckboxMode, setSelectedRowIds]
  );

  // apply local deletion updates when parent deletes rows
  useEffect(() => {
    if (deletedRowIds && deletedRowIds.length > 0) {
      setExitData((prev) => prev.filter((r) => !deletedRowIds.includes(r.id)));
      setSelectedRowIds((prev) => prev.filter((id) => !deletedRowIds.includes(id)));
    }
  }, [deletedRowIds, setSelectedRowIds]);

  const table = useReactTable({
    data: exitData,
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
    const selectedTableData = exitData.filter((row) =>
      selectedRowIds.includes(row.id)
    );
    const data = selectedTableData.map((row) => ({
      cchCouldBeImproved: row.cchCouldBeImproved,
      cchLikeMost: row.cchLikeMost,
      cchRating: row.cchRating,
      cmChangeAbout: row.cmChangeAbout,
      cmFirstName: row.cmFirstName,
      cmLastName: row.cmLastName,
      cmMostBeneficial: row.cmMostBeneficial,
      cmRating: row.cmRating,
      experienceAccomplished: row.experienceAccomplished,
      experienceExtraNotes: row.experienceExtraNotes,
      experienceTakeaway: row.experienceTakeaway,
      id: row.id,
      lifeSkillsHelpfulTopics: row.lifeSkillsHelpfulTopics,
      lifeSkillsOfferTopicsInTheFuture: row.lifeSkillsOfferTopicsInTheFuture,
      lifeSkillsRating: row.lifeSkillsRating,
      location: row.location,
      programDateCompletion: row.programDateCompletion,
    }));

    downloadCSV(headers, data, `exit-surveys.csv`);
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
            `/exitSurvey/search-filter?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=${searchKey}`
          );
        } else if (searchKey) {
          tableDataRequest = backend.get(
            `/exitSurvey/search-filter?page=&filter=&search=${searchKey}`
          );
        } else if (filterQuery.length > 1) {
          tableDataRequest = backend.get(
            `/exitSurvey/search-filter?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=`
          );
        } else {
          tableDataRequest = backend.get("/exitSurvey/table-data");
        }

        const tableDataResponse = await tableDataRequest;
        setExitData(tableDataResponse.data);
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
        filterType={"exitSurvey"}
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
                title: 'Exit Surveys' as const,
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
