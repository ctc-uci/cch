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
import type { SuccessStory } from "../../../types/successStory.ts";
import type { Form } from "../../../types/form.ts";
import { formatDateString } from "../../../utils/dateUtils.ts";
import { downloadCSV } from "../../../utils/downloadCSV.ts";
import FormPreview from "../../formsHub/FormPreview.tsx";
import { LoadingWheel } from "../../loading/loading.tsx";
import { TableControls } from "./TableControls.tsx";
import { TableContent } from "./TableContent.tsx";

interface SuccessStoryTableProps {
  selectedRowIds: number[];
  setSelectedRowIds: (ids: number[] | ((prev: number[]) => number[])) => void;
  deletedRowIds: number[];
}

export const SuccessStoryTable = ({ selectedRowIds, setSelectedRowIds, deletedRowIds }: SuccessStoryTableProps) => {
  // still gotta do this -- but I'll do it later
  const headers = [
    "cchImpact",
    "cmFirstName",
    "cmLastName",
    "entranceDate",
    "exitDate",
    "id",
    "location",
    "previousSituation",
    "quote",
    "tellDonors",
    "whereNow",
  ];

  const [successData, setSuccessData] = useState<
    (SuccessStory & { isChecked: boolean; isHovered: boolean })[]
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

  const columns = useMemo<ColumnDef<SuccessStory>[]>(
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
        accessorKey: "location",
        header: "Site",
      },
      {
        accessorKey: "entranceDate",
        header: "Entrance Date",
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
        accessorKey: "previousSituation",
        header: "Situation Before Entering CCH",
      },
      {
        accessorKey: "whereNow",
        header: "Current Situation",
      },
      {
        accessorKey: "tellDonors",
        header: "Tell Donors",
      },
      {
        accessorKey: "quote",
        header: "Quote",
      },
    ],
    [selectedRowIds, successData, checkboxMode, setCheckboxMode, setSelectedRowIds]
  );

  // apply local deletion updates when parent deletes rows
  useEffect(() => {
    if (deletedRowIds && deletedRowIds.length > 0) {
      setSuccessData((prev) => prev.filter((r) => !deletedRowIds.includes(r.id)));
      setSelectedRowIds((prev) => prev.filter((id) => !deletedRowIds.includes(id)));
    }
  }, [deletedRowIds, setSelectedRowIds]);

  const table = useReactTable({
    data: successData,
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
    const selectedTableData = successData.filter((row) =>
      selectedRowIds.includes(row.id)
    );
    const data = selectedTableData.map((row) => ({
      cchImpact: row.cchImpact,
      cmFirstName: row.cmFirstName,
      cmLastName: row.cmLastName,
      entranceDate: row.entranceDate,
      exitDate: row.exitDate,
      id: row.id,
      location: row.location,
      previousSituation: row.previousSituation,
      quote: row.quote,
      tellDonors: row.tellDonors,
      whereNow: row.whereNow,
    }));

    downloadCSV(headers, data, `success-stories.csv`);
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
            `/successStory/search-filter?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=${searchKey}`
          );
        } else if (searchKey) {
          tableDataRequest = backend.get(
            `/successStory/search-filter?page=&filter=&search=${searchKey}`
          );
        } else if (filterQuery.length > 1) {
          tableDataRequest = backend.get(
            `/successStory/search-filter?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=`
          );
        } else {
          tableDataRequest = backend.get("/successStory/table-data");
        }

        const tableDataResponse = await tableDataRequest;
        setSuccessData(tableDataResponse.data);
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
        filterType={"successStory"}
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
                title: 'Success Stories' as const,
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
