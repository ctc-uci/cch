import { Heading, VStack } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  HStack,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { InitialScreenerTable } from "./FormTables/InitialScreenerTable.tsx";
import { SuccessStoryTable } from "./FormTables/SuccessStoryTable.tsx";
import { ExitSurveyTable } from "./FormTables/ExitSurveyTable.tsx";
import { RandomClientTable } from "./FormTables/RandomClientTable.tsx";
import { AllFormTable } from "./FormTables/AllFormTable.tsx";


export const AdminFormsHub = () => {
  return (
    <VStack
      overflowX="hidden"
      w="100vw"
      spacing={8}
      align="stretch"
    >
      <Box px={9}>
        <Heading
          p={6}
          as="h1"
          size="xl"
          mb={2}
        >
          Client Forms
        </Heading>
      </Box>
      <Box px={10}>
        <Box p="4">
          <Text
            fontSize="13pt"
            fontWeight="bold"
          >
            Form History
          </Text>
          <Text fontSize="12pt">Last Updated: MM/DD/YYYY HH:MM XX</Text>
          {/* <Text fontSize="12pt">Last Updated: {lastUpdated}</Text> */}

          <Tabs
            isFitted
            w="full"
          >
            {/* maybe use some onClick to change some variable to the name of the current panel to do the last updated stuff */}
            <TabList whiteSpace="nowrap"> 
              <Tab>Initial Screeners</Tab>
              <Tab>Success Stories</Tab>
              <Tab>Exit Surveys</Tab>
              <Tab>Random Client Surveys</Tab>
              <Tab>All Forms</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <InitialScreenerTable />
              </TabPanel>
              <TabPanel>
                <SuccessStoryTable />
              </TabPanel>
              <TabPanel>
                <ExitSurveyTable />
              </TabPanel>
              <TabPanel>
                <RandomClientTable />
              </TabPanel>
              <TabPanel>
                <AllFormTable />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </VStack>
  );
};
