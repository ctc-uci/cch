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
import type { TabData, TableRow } from "../../types/monthlyStat.ts";
import { StatsTable } from "./StatsTable.tsx";
import { LoadingWheel } from ".././loading/loading.tsx"

export const CaseManagerMonthlyStats = () => {

  const { backend } = useBackendContext();
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const [allTabData, setAllTabData] = useState<TabData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [hiddenFields, setHiddenFields] = useState<string[]>([]);
  const [pinnedFields, setPinnedFields] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

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

  // Filter and sort tables: exclude hidden, pinned first
  const filterAndSortTables = (tables: any[]) => {
    const visibleTables = tables.filter((table) => !hiddenFields.includes(table.tableName));
    return visibleTables.sort((a, b) => {
      const aIsPinned = pinnedFields.includes(a.tableName);
      const bIsPinned = pinnedFields.includes(b.tableName);

      // Pinned tables come first
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return 0;
    });
  };

  // Create CSV with separate tables
  const createMultiTableCSV = (tables: any[], fileName: string) => {
    const csvRows: string[] = [];
    const headers = ["Category", ...monthNames, "Total"];

    tables.forEach((table, tableIndex) => {
      // Add table name as a header row
      csvRows.push(`"${table.tableName}"`);

      // Add column headers
      csvRows.push(headers.join(','));

      // Add data rows for this table
      const tableRows = Object.values(table.tableData) as TableRow[];
      tableRows.forEach((row) => {
        const monthlyData: Record<string, number> = {};
        row.monthlyCounts.forEach((m) => {
          monthlyData[m.month] = m.count;
        });

        const values = [
          `"${row.categoryName.replace(/"/g, '\\"')}"`,
          ...monthNames.map((month) => monthlyData[month] || 0),
          row.total,
        ];

        csvRows.push(values.join(','));
      });

      // Add blank row separator between tables (except after last table)
      if (tableIndex < tables.length - 1) {
        csvRows.push('');
      }
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAll = () => {
    const allTables = allTabData.flatMap((tab) => tab.tables);
    const filteredAndSortedTables = filterAndSortTables(allTables);
    const timestamp = new Date().toISOString().split('T')[0];
    createMultiTableCSV(
      filteredAndSortedTables,
      `MonthlyStats_All_${selectedYear}_${timestamp}.csv`
    );
  };

  const handleExport = (tables: any[]) => {
    const filteredAndSortedTables = filterAndSortTables(tables);
    const timestamp = new Date().toISOString().split('T')[0];
    createMultiTableCSV(
      filteredAndSortedTables,
      `MonthlyStats_${selectedYear}_${timestamp}.csv`
    );
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
          {tabIndex === allTabData.length ? (
          <Button
            {...buttonStyle}
            onClick={handleExportAll}
          >
            Export All
          </Button>
          ) : (
            <Button
              {...buttonStyle}
              onClick={() => {
                const currentTab = allTabData[tabIndex];
                if (currentTab) {
                  handleExport(currentTab.tables);
                }
              }}
            >
              Export
            </Button>
          )}
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
        index={tabIndex}
        onChange={setTabIndex}
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
