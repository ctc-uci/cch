import { useEffect, useState } from "react";

import {
  Button,
  ButtonGroup,
  Heading,
  HStack,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext.ts";
import { StatsTable } from "./StatsTable.tsx";

export const CaseManagerMonthlyStats = () => {
  const [allTables, setAllTables] = useState([]);
  const { backend } = useBackendContext();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await backend.get(`/calculateMonthlyStats/2025`);
        setAllTables(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [backend]);

  const buttonStyle = {
    variant: "outline",
    colorScheme: "blue",
  };

  return (
    <VStack
      align="start"
      sx={{ maxWidth: "100%", padding: "4%" }}
    >
      <VStack
        align="start"
        gap="10px"
      >
        <Heading>Monthly Statistics</Heading>
        <Text fontSize="14px">Last Updated: MM/DD/YYYY HH:MM XX</Text>
      </VStack>

      <HStack alignSelf="end">
        <ButtonGroup size="sm">
          <Button {...buttonStyle}>Start Front Desk Form</Button>
          <Button {...buttonStyle}>Start Case Manager Form</Button>
        </ButtonGroup>
        <Select>
          <option>2025</option>
        </Select>
      </HStack>

      <Tabs isFitted w="full">
        <TabList whiteSpace="nowrap">
          {/* "All Statistics" tab plus one tab for each table */}
          <Tab key="all">All Statistics</Tab>
          {allTables.map((table) => (
            <Tab key={table.tabName}>{table.tabName}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {/* All Statistics: render all tables */}
          <TabPanel>
            {allTables.map((table) => (
              <StatsTable key={table.tabName} title={table.tabName} data={table.data} />
            ))}
          </TabPanel>
          {/* Render each table in its own tab panel */}
          {allTables.map((table) => ( 
            <TabPanel key={table.tabName}>
              <StatsTable title={table.tabName} data={table.data} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
