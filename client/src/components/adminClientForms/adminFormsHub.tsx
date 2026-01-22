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

import { useBackendContext } from "../../contexts/hooks/useBackendContext.ts";
import type { Form } from "../../types/form.ts";
import { DeleteRowModal } from "../deleteRow/deleteRowModal.tsx";
import FormPreview from "../formsHub/FormPreview.tsx";
import { DynamicFormTable } from "./FormTables/DynamicFormTable.tsx";

export const AdminFormsHub = () => {
  const { backend } = useBackendContext();
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [clickedFormItem, setClickedFormItem] = useState<Form | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshTable, setRefreshTable] = useState(false);
  const [_activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletedRowIds, setDeletedRowIds] = useState<string[]>([]);

  // Tab configurations with form_id mappings
  // form_id: 1 = Initial Screener, 2 = Exit Survey, 3 = Success Story, 4 = Random Survey
  const tabConfig = [
    { formId: 1, label: "Initial Screener Form", useDynamic: true },
    { formId: 3, label: "Success Story Form", useDynamic: true },
    { formId: 2, label: "Client Exit Survey Form", useDynamic: true },
    { formId: 4, label: "Random Client Survey Form", useDynamic: true },
  ] as const;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get last updated from intake_responses for each form
        const [
          initialResponse,
          successResponse,
          exitResponse,
          randomResponse,
        ] = await Promise.all([
          backend.get(`/intakeResponses/form/1`).catch(() => ({ data: [] })),
          backend.get(`/intakeResponses/form/3`).catch(() => ({ data: [] })),
          backend.get(`/intakeResponses/form/2`).catch(() => ({ data: [] })),
          backend.get(`/intakeResponses/form/4`).catch(() => ({ data: [] })),
        ]);

        const dates: Date[] = [];
        
        // Get most recent submitted_at from each form's responses
        [initialResponse, successResponse, exitResponse, randomResponse].forEach((response) => {
          if (response.data && response.data.length > 0) {
            const latest = response.data[0]?.submittedAt;
            if (latest) {
              dates.push(new Date(latest));
            }
          }
        });

        if (dates.length === 0) {
          setLastUpdated("N/A");
        } else {
          const mostRecent = new Date(Math.max(...dates.map(d => d.getTime())));
          const formattedDate = mostRecent.toLocaleString();
          setLastUpdated(formattedDate);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLastUpdated("N/A");
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
      // Delete by session_id for intake_responses
      await Promise.all(
        selectedRowIds.map((sessionId) =>
          backend.delete(`/intakeResponses/session/${sessionId}`)
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
                  Delete ({selectedRowIds.length})
                </Button>
              </HStack>
            </HStack>
            <TabPanels>
              {tabConfig.map((tab, index) => (
                <TabPanel key={index}>
                  <DynamicFormTable
                    formId={tab.formId}
                    formName={tab.label}
                    selectedRowIds={selectedRowIds}
                    setSelectedRowIds={setSelectedRowIds}
                    deletedRowIds={deletedRowIds}
                  />
                </TabPanel>
              ))}
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
