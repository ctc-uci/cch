import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input, InputGroup, InputRightElement,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead, Tr,
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

export const StatsTable = () => {
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

  const buttonStyle = {
    variant: "ghost",
  };

  return (
    <VStack
      align="start"
      spacing="24px"
      paddingTop="24px"
    >
      <Heading fontSize="20px">Calls and Office Visits</Heading>
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
                <Input type="number" {...input} />
                <InputRightElement children="%"/>
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
          <Table
            variant="striped"
          >
            <Thead>
              <Th textAlign="left">Category</Th>
              <Th>January</Th>
              <Th>February</Th>
              <Th>March</Th>
              <Th>April</Th>
              <Th>May</Th>
              <Th>June</Th>
              <Th>July</Th>
              <Th>August</Th>
              <Th>September</Th>
              <Th>October</Th>
              <Th>November</Th>
              <Th>December</Th>
              <Th>Total</Th>
            </Thead>
            <Tbody>
              <Tr>
                <Th textAlign="center">Calls (includes dups)</Th>
                <Th textAlign="center">1</Th>
                <Th textAlign="center">1</Th>
                <Th textAlign="center">1</Th>
                <Th textAlign="center">1</Th>
                <Th textAlign="center">1</Th>
                <Th textAlign="center">1</Th>
                <Th textAlign="center">1</Th>
                <Th textAlign="center">1</Th>
                <Th textAlign="center">1</Th>
                <Th textAlign="center">1</Th>
                <Th textAlign="center">1</Th>
                <Th textAlign="center">1</Th>
                <Th textAlign="center">1</Th>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </VStack>
  );
};
