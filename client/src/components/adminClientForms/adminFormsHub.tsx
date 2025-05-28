import { useEffect, useMemo, useState } from "react";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  Heading,
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
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext.ts";
import { TabData } from "../../types/form.ts";
import FormPreview from "../formsHub/FormPreview.tsx";
import { AllFormTable } from "./FormTables/AllFormTable.tsx";
import { ExitSurveyTable } from "./FormTables/ExitSurveyTable.tsx";
import { InitialScreenerTable } from "./FormTables/InitialScreenerTable.tsx";
import { RandomClientTable } from "./FormTables/RandomClientTable.tsx";
import { SuccessStoryTable } from "./FormTables/SuccessStoryTable.tsx";

export const AdminFormsHub = () => {
  const { backend } = useBackendContext();
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [clickedFormItem, setClickedFormItem] = useState<Form | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          initialResponse,
          sucessResponse,
          exitResponse,
          randomResponse,
          clientsResponse,
        ] = await Promise.all([
          backend.get(`/lastUpdated/initial_interview`),
          backend.get(`/lastUpdated/success_story`),
          backend.get(`/lastUpdated/exit_survey`),
          backend.get(`/lastUpdated/random_survey_table`),
          backend.get(`/lastUpdated/clients`),
        ]);

        const initial = new Date(initialResponse.data[0].lastUpdatedAt);
        const sucess = new Date(sucessResponse.data[0].lastUpdatedAt);
        const exit = new Date(exitResponse.data[0].lastUpdatedAt);

        const random = new Date(randomResponse.data[0].lastUpdatedAt);
        const clients = new Date(clientsResponse.data[0].lastUpdatedAt);


        const mostRecent = new Date(
          Math.max(
            initial ? initial.getTime() : 0,
            sucess ? sucess.getTime() : 0,
            exit ? exit.getTime() : 0,
            random ? random.getTime() : 0,
            clients ? clients.getTime() : 0
          )
        );

        if (mostRecent.getTime() === 0) {
          setLastUpdated("N/A");
        } else {
          const formattedDate = mostRecent.toLocaleString();
          setLastUpdated(formattedDate);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backend]);

  useEffect(() => {
    if (clickedFormItem) {
      onOpen();
    }
  }, [clickedFormItem, onOpen]);

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
          <Text fontSize="12pt">Last Updated: {lastUpdated}</Text>

          <Tabs
            isFitted
            w="full"
          >

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
          {clickedFormItem && (
            <FormPreview
              clickedFormItem={clickedFormItem}
              isOpen={isOpen}
              onClose={() => {
                onClose();
                setClickedFormItem(null);
              }}
              refreshTable={refreshTable}
              setRefreshTable={setRefreshTable}
            />
          )}
        </Box>
      </Box>
    </VStack>
  );
};
