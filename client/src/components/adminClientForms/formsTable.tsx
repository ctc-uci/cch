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

import { FormTableTemplate } from "./FormTable/FormTableTemplate.tsx";

export const FormTable = () => {
  return (
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
        <TabList whiteSpace="nowrap">
          <Tab>Initial Screeners</Tab>
          <Tab>Success Story</Tab>
          <Tab>Front Desk Statistics</Tab>
          <Tab>Case Manager Statistics</Tab>
          <Tab>All Forms</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormTableTemplate type="initialScreener"/>
          </TabPanel>
          <TabPanel>
          </TabPanel>
          <TabPanel>
          </TabPanel>
          <TabPanel>
          </TabPanel>
          <TabPanel>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
