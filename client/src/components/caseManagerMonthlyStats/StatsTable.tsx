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

export const StatsTable = ({ title, data }) => {
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

  return (
    <VStack
      align="start"
      spacing="24px"
      paddingTop="24px"
    >
      <Heading fontSize="20px">{title}</Heading>
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
              {Object.entries(data).map(([key, categoryData]) => (
                <Tr key={key}>
                  <Td textAlign="left">{categoryData.categoryName}</Td>
                  {categoryData.entries.map((entry) => (
                    <Td
                      key={entry.month}
                      textAlign="center"
                    >
                      {entry.count}
                    </Td>
                  ))}
                  <Td textAlign="center">{categoryData.total}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </VStack>
  );
};
