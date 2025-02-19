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
import type { TabData } from "../../types/monthlyStat.ts";
import { StatsTable } from "./StatsTable.tsx";
import { useNavigate } from "react-router-dom";

export const CaseManagerMonthlyStats = () => {
  const navigate = useNavigate();

  const { backend } = useBackendContext();
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const [allTabData, setAllTabData] = useState<TabData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await backend.get(
          `/calculateMonthlyStats/${selectedYear}`
        );
        setAllTabData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [backend, selectedYear]);

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
        <Button
            {...buttonStyle}
            onClick={() => navigate('/frontDesk')}
          >
            Start Front Desk Form
          </Button>
          <Button
            {...buttonStyle}
            onClick={() => navigate('/casemanager')}
          >
            Start Case Manager Form
          </Button>
        </ButtonGroup>
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from(
            { length: currentYear - startYear + 1 },
            (_, index) => currentYear - index
          ).map((year) => (
            <option
              key={year}
              value={year}
            >
              {year}
            </option>
          ))}
        </Select>
      </HStack>

      <Tabs
        isFitted
        w="full"
      >
        <TabList whiteSpace="nowrap">
          {/* "All Statistics" tab plus one tab for each table */}
          <Tab key="all">All Statistics</Tab>
          {allTabData.map((tab) => (
            <Tab key={tab.tabName}>{tab.tabName}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {/* All Statistics: render all tables */}
          <TabPanel>
            {allTabData.map((tab) =>
              tab.tables.map((table) => (
                <StatsTable
                  key={table.tableName}
                  table={table}
                />
              ))
            )}
          </TabPanel>
          {/* Render each table in its own tab panel */}
          {allTabData.map((tab) => (
            <TabPanel key={tab.tabName}>
              {tab.tables.map((table) => (
                <StatsTable
                  key={table.tableName}
                  table={table}
                />
              ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
