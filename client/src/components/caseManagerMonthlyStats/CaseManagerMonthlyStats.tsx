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
import { LoadingWheel } from ".././loading/loading.tsx"

export const CaseManagerMonthlyStats = () => {
  const navigate = useNavigate();

  const { backend } = useBackendContext();
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const [allTabData, setAllTabData] = useState<TabData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [hiddenFields, setHiddenFields] = useState<string[]>([]);
  const [pinnedFields, setPinnedFields] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthlyStatsResponse, frontDeskResponse, cmResponse] = await Promise.all([
          backend.get(`/calculateMonthlyStats/${selectedYear}`),
          backend.get(`/lastUpdated/front_desk_monthly`),
          backend.get(`/lastUpdated/cm_monthly_stats`)
        ]);
  
        setAllTabData(monthlyStatsResponse.data);
  
        const frontDesk = new Date(frontDeskResponse.data[0].lastUpdatedAt);
        const cmMonthly = new Date(cmResponse.data[0].lastUpdatedAt);
  
        const mostRecent = new Date(Math.max(
          frontDesk ? frontDesk.getTime() : 0,
          cmMonthly ? cmMonthly.getTime() : 0
        ));
  
        if (mostRecent.getTime() === 0) {
          setLastUpdated("N/A");
        } else {
          const formattedDate = mostRecent.toLocaleString();
          setLastUpdated(formattedDate);
        }
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally{
        setLoading(false);
      }
    };
  
    fetchData();
  }, [backend, selectedYear]);
  

  const buttonStyle = {
    colorScheme: "blue",
  };

  // Sort tables: pinned first, then visible, then hidden
  const sortTables = (tables: any[]) => {
    return [...tables].sort((a, b) => {
      const aIsPinned = pinnedFields.includes(a.tableName);
      const bIsPinned = pinnedFields.includes(b.tableName);
      const aIsHidden = hiddenFields.includes(a.tableName);
      const bIsHidden = hiddenFields.includes(b.tableName);

      // Pinned tables come first
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;

      // Among non-pinned tables, hidden ones go to bottom
      if (!aIsPinned && !bIsPinned) {
        if (aIsHidden && !bIsHidden) return 1;
        if (!aIsHidden && bIsHidden) return -1;
      }

      return 0;
    });
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
        <Text fontSize="14px">Last Updated: {lastUpdated}</Text>
      </VStack>

      <HStack alignSelf="end">
        <ButtonGroup size="sm">
        {/* <Button
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
          </Button> */}
          <Button
            {...buttonStyle}
            onClick={() => navigate('/casemanager')}
          >
            Export
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
          {allTabData.map((tab) => (
            <Tab key={tab.tabName}>{tab.tabName}</Tab>
          ))}
          <Tab key="all">All</Tab>
        </TabList>
        {loading ? 
        <LoadingWheel/> :
        <TabPanels>
          {/* Render each table in its own tab panel */}
          {allTabData.map((tab) => (
            <TabPanel key={tab.tabName}>
              {sortTables(tab.tables).map((table) => (
                <StatsTable
                  key={table.tableName}
                  setHiddenFields={setHiddenFields}
                  setPinnedFields={setPinnedFields}
                  table={table}
                  hiddenFields={hiddenFields}
                  pinnedFields={pinnedFields}
                />
              ))}
            </TabPanel>
          ))}
          {/* All Statistics: render all tables */}
          <TabPanel>
            {sortTables(allTabData.flatMap((tab) => tab.tables)).map((table) => (
              <StatsTable
                key={table.tableName}
                hiddenFields={hiddenFields}
                pinnedFields={pinnedFields}
                setHiddenFields={setHiddenFields}
                setPinnedFields={setPinnedFields}
                table={table} 
              />
            ))}
          </TabPanel>
        </TabPanels>
        }
      </Tabs>
    </VStack>
  );
};
