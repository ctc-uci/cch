import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { useBackendContext } from "../../contexts/hooks/useBackendContext.ts";
import type { Form } from "../../types/form.ts";
import { DeleteRowModal } from "../deleteRow/deleteRowModal.tsx";
import FormPreview from "../formsHub/FormPreview.tsx";
import { AllFormTable } from "./FormTables/AllFormTable.tsx";
import { ExitSurveyTable } from "./FormTables/ExitSurveyTable.tsx";
import { InitialScreenerTable } from "./FormTables/InitialScreenerTable.tsx";
import { RandomClientTable } from "./FormTables/RandomClientTable.tsx";
import { SuccessStoryTable } from "./FormTables/SuccessStoryTable.tsx";

export const AdminFormsHub = () => {
  const { backend } = useBackendContext();
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [clickedFormItem, setClickedFormItem] = useState<Form | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshTable, setRefreshTable] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletedRowIds, setDeletedRowIds] = useState<number[]>([]);

  // Tab configurations
  const tabConfig = [
    { addRoute: "/personal", label: "Initial Screener Form", noAdd: false },
    { addRoute: "/success-story", label: "Success Story Form", noAdd: false },
    {
      addRoute: "/exit-survey",
      label: "Client Exit Survey Form",
      noAdd: false,
    },
    {
      addRoute: "/random-client-survey",
      label: "Random Client Survey Form",
      noAdd: false,
    },
    { addRoute: null, label: "All Client Forms", noAdd: true },
  ] as const;

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

  const handleDelete = async () => {
    try {
      const deleteEndpoints = [
        "/initialInterview",
        "/successStory",
        "/exitSurvey",
        "/randomSurvey",
        "/clients",
      ];
      
      const endpoint = deleteEndpoints[activeTabIndex] || "/clients";
      
      await Promise.all(
        selectedRowIds.map((row_id) =>
          backend.delete(`${endpoint}/${row_id}`)
        )
      );
      
      // update child tables locally by passing the deleted ids down
      setDeletedRowIds(selectedRowIds);
      setSelectedRowIds([]);
      setIsDeleteModalOpen(false);
      // optional: keep for other flows relying on refresh
      setRefreshTable((prev) => !prev);
    } catch (error) {
      console.error("Error deleting rows", error);
    }
  };

  return (
    <Stack
      overflowX="hidden"
      p="2% 4%"
    >
      <Heading
        as="h1"
        size="xl"
      >
        Client Forms
      </Heading>
      <Box>
        <Stack mb={12}>
          <Text
            fontSize="13pt"
            fontWeight="bold"
          >
            Form History
          </Text>
          <Text fontSize="12pt">Last Updated: {lastUpdated}</Text>
        </Stack>

        <Box>
          <Tabs
            size="sm"
            variant="line"
            onChange={setActiveTabIndex}
          >
            <HStack
              width="100%"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <TabList
                w="70%"
                justifyContent="space-between"
              >
                <Tab>Initial Screener Form</Tab>
                <Tab>Success Story Form</Tab>
                <Tab>Client Exit Survey Form</Tab>
                <Tab>Random Client Survey Form</Tab>
                <Tab>All Client Forms</Tab>
              </TabList>

              <HStack spacing={2}>
                {/* {(() => {
                  const currentTab = tabConfig[activeTabIndex];
                  if (!currentTab) return null;

                  if (!currentTab.noAdd && currentTab.addRoute) {
                    return (
                      <Button
                        fontSize="12px"
                        onClick={() => navigate(currentTab.addRoute as string)}
                      >
                        Add
                      </Button>
                    );
                  }
                  return null;
                })()} */}

                <Button
                  fontSize="12px"
                  onClick={() => setIsDeleteModalOpen(true)}
                  isDisabled={selectedRowIds.length === 0}
                  variant="outline"
                  colorScheme={selectedRowIds.length === 0 ? "gray" : "red"}
                >
                  Delete
                </Button>
              </HStack>
            </HStack>
            <TabPanels>
              <TabPanel>
                <InitialScreenerTable 
                  selectedRowIds={selectedRowIds}
                  setSelectedRowIds={setSelectedRowIds}
                  deletedRowIds={deletedRowIds}
                />
              </TabPanel>
              <TabPanel>
                <SuccessStoryTable 
                  selectedRowIds={selectedRowIds}
                  setSelectedRowIds={setSelectedRowIds}
                  deletedRowIds={deletedRowIds}
                />
              </TabPanel>
              <TabPanel>
                <ExitSurveyTable 
                  selectedRowIds={selectedRowIds}
                  setSelectedRowIds={setSelectedRowIds}
                  deletedRowIds={deletedRowIds}
                />
              </TabPanel>
              <TabPanel>
                <RandomClientTable 
                  selectedRowIds={selectedRowIds}
                  setSelectedRowIds={setSelectedRowIds}
                  deletedRowIds={deletedRowIds}
                />
              </TabPanel>
              <TabPanel>
                <AllFormTable 
                  selectedRowIds={selectedRowIds}
                  setSelectedRowIds={setSelectedRowIds}
                  deletedRowIds={deletedRowIds}
                />
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
          <DeleteRowModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
          />
        </Box>
      </Box>
    </Stack>
  );
};
