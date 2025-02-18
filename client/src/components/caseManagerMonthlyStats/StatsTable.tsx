import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
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

export const StatsTable = ({ table }: { table: StatsTableProps }) => {
  const { tableName, tableData } = table;
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

  const buttonStyle = {
    variant: "ghost",
  };

  const csvHeaders = ["Category", ...monthNames, "Total"];
  const csvData = Object.values(tableData).map((row) => {
    return {
      Category: row.categoryName,
      ...row.monthlyCounts.reduce((acc, m) => {
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
      <Heading fontSize="20px">{tableName}</Heading>
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
            >
              Hide fields
            </Button>
            <Button
              {...buttonStyle}
              leftIcon={<MdPushPin />}
            >
              Pin fields
            </Button>
            <MdZoomIn />
            <Text>Zoom</Text>
            <Flex maxW="163px">
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
            </Flex>
          </HStack>
          <HStack>
            <IconButton
              {...buttonStyle}
              icon={<MdOutlineManageSearch />}
              aria-label={"search"}
            />
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
              {Object.entries(tableData).map(([key, tableRow]) => (
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
    </VStack>
  );
};
