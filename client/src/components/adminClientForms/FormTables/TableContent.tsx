import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { flexRender, Table as TanStackTable } from "@tanstack/react-table";
import { HoverCheckbox } from "../../hoverCheckbox/hoverCheckbox.tsx";
import { useEffect } from "react";

interface TableContentProps<T> {
  table: TanStackTable<T>;
  selectedRowIds: number[];
  onRowSelect: (id: number, isChecked: boolean) => void;
  onRowClick?: (row: T, index: number) => void;
  showRowNumber?: boolean;
  checkboxMode: 'hidden' | 'visible-unchecked' | 'visible-checked';
  setCheckboxMode: (mode: 'hidden' | 'visible-unchecked' | 'visible-checked') => void;
}

export const TableContent = <T extends { id: number }>({
  table,
  selectedRowIds,
  onRowSelect,
  onRowClick,
  showRowNumber = true,
  checkboxMode,
  setCheckboxMode,
}: TableContentProps<T>) => {

  useEffect(() => {
    console.log(table.getRowModel().rows.map(row => row.original));
  }, [table]);
  
  return (
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
                    if (showRowNumber && cell.column.id === "rowNumber") {
                      e.stopPropagation();
                    } else if (onRowClick) {
                      onRowClick(row.original, index);
                    }
                  }}
                >
                  {showRowNumber && cell.column.id === "rowNumber" ? (
                    <HoverCheckbox
                      id={row.original.id}
                      isSelected={selectedRowIds.includes(row.original.id)}
                      onSelectionChange={onRowSelect}
                      index={index}
                      alwaysVisible={checkboxMode !== 'hidden'}
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
  );
};

