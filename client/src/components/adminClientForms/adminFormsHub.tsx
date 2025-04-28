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
              <Tab>Success Story</Tab>
              <Tab>Front Desk Statistics</Tab>
              <Tab>Case Manager Statistics</Tab>
              <Tab>All Forms</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <InitialScreenerTable />
              </TabPanel>
              <TabPanel>
                <SuccessStoryTable />
              </TabPanel>
              <TabPanel></TabPanel>
              <TabPanel></TabPanel>
              <TabPanel></TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </VStack>
  );
};
