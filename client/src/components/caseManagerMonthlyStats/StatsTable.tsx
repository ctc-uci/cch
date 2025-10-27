import { useMemo, useState, useRef, useEffect } from "react";

import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useNumberInput,
  VStack,
} from "@chakra-ui/react";

import {
  MdFileUpload,
  MdHideSource,
  MdOutlineManageSearch,
  MdPushPin,
  MdZoomIn,
} from "react-icons/md";

import type { Table as StatsTableProps } from "../../types/monthlyStat.ts";
import { downloadCSV } from "../../utils/downloadCSV.ts";

export const StatsTable = ({ table, setHiddenFields, setPinnedFields, hiddenFields, pinnedFields }: { table: StatsTableProps, setHiddenFields: (fields: string[]) => void, setPinnedFields: (fields: string[]) => void, hiddenFields: string[], pinnedFields: string[] }) => {
  const { tableName, tableData } = table;
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 100,
      min: 1,
      max: 100,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  // Handle clicks outside search input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Filter table data based on search term
  const filteredTableData = useMemo(() => {
    if (!searchTerm.trim()) {
      return tableData;
    }

    const searchLower = searchTerm.toLowerCase();
    return Object.fromEntries(
      Object.entries(tableData).filter(([, row]) =>
        row.categoryName.toLowerCase().includes(searchLower)
      )
    );
  }, [tableData, searchTerm]);

  const buttonStyle = {
    variant: "ghost",
  };

  const csvHeaders = ["Category", ...monthNames, "Total"];
  const csvData = Object.values(filteredTableData).map((row) => {
    return {
      Category: row.categoryName,
      ...row.monthlyCounts.reduce((acc: Record<string, number>, m) => {
        acc[m.month] = m.count;
        return acc;
      }, {}),
      Total: row.total,
    };
  });

  return (
    <VStack
      align="start"
      spacing="24px"
      paddingTop="24px"
    >
      <HStack justify="space-between" width="100%">
      <Heading fontSize="20px">{tableName}</Heading>
      {
        hiddenFields.includes(tableName) && (
          <Button
            {...buttonStyle}
            leftIcon={<MdHideSource />}
            onClick={() => setHiddenFields(hiddenFields.filter((field) => field !== tableName))}
          >
            Show fields
          </Button>
        )
      }
      </HStack>
      {!hiddenFields.includes(tableName) && (
      <Box
        borderWidth="1px"
        borderRadius="12px"
        width="100%"
      >
        <HStack
          width="100%"
          justify="space-between"
          paddingLeft="16px"
          paddingTop="8px"
          paddingRight="16px"
          paddingBottom="8px"
        >
          <HStack>
            <Button
              {...buttonStyle}
              leftIcon={<MdHideSource />}
              onClick={() => setHiddenFields([...hiddenFields, tableName])}
            >
              Hide fields
            </Button>
            {!pinnedFields.includes(tableName) ? (
              <Button
                {...buttonStyle}
                leftIcon={<MdPushPin />}
                onClick={() => setPinnedFields([...pinnedFields, tableName])}
              >
                Pin fields
              </Button>
            ) : (
              <Button
                {...buttonStyle}
                colorScheme="blue"
                leftIcon={<MdPushPin />}
                onClick={() => setPinnedFields(pinnedFields.filter((field) => field !== tableName))}
              >
                Unpin fields
              </Button>
            )}
            {/* <MdZoomIn />
            <Text>Zoom</Text>
            <Flex width="17ch">
              <InputGroup>
                <Input
                  type="number"
                  {...input}
                />
                <InputRightElement children="%" />
              </InputGroup>
              <Button
                {...buttonStyle}
                {...dec}
              >
                -
              </Button>
              <Button
                {...buttonStyle}
                {...inc}
                >
                  +
              </Button>
            </Flex> */}
          </HStack>
            <HStack>
              <div ref={searchRef}>
                {!isSearchOpen && (
                  <IconButton
                    {...buttonStyle}
                    icon={<MdOutlineManageSearch />}
                    aria-label={"search"}
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    style={{ cursor: "pointer" }}
                  />
                )}
                {isSearchOpen && (
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search categories"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                )}
              </div>
            <Button
              {...buttonStyle}
              leftIcon={<MdFileUpload />}
              onClick={() =>
                downloadCSV(csvHeaders, csvData, `${tableName}Stats.csv`)
              }
            >
              Export
            </Button>
          </HStack>
        </HStack>
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th textAlign="left">Category</Th>
                {monthNames.map((month) => (
                  <Th
                    key={month}
                    textAlign="center"
                  >
                    {month}
                  </Th>
                ))}
                <Th textAlign="center">Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(filteredTableData).map(([key, tableRow]) => (
                <Tr key={key}>
                  <Td textAlign="left">{tableRow.categoryName}</Td>
                  {tableRow.monthlyCounts.map((monthlyCount) => (
                    <Td
                      key={monthlyCount.month}
                      textAlign="center"
                    >
                      {monthlyCount.count}
                    </Td>
                  ))}
                  <Td textAlign="center">{tableRow.total}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      )}
    </VStack>
  );
};
