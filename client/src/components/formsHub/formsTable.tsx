import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

type FormItem = {
  id: number;
  date: string;
  name: string;
  title:
    | "Initial Screeners"
    | "Intake Statistics"
    | "Front Desk Monthly Stats"
    | "Case Manager Monthly Stats";
};

type ViewOption =
  | "All Forms"
  | "Initial Screeners"
  | "Front Desk Monthly Statistics"
  | "Case Manager Monthly Statistics"
  | "Client Tracking Statistics (Intake Statistics)";

export const FormTable = () => {
  const { backend } = useBackendContext();
  const [items, setItems] = useState<FormItem[]>([]);
  const [currentView, setCurrentView] = useState<ViewOption>("All Forms");

  const formatDate = (x: string) => {
    const date = new Date(x);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const screenerResponse = await backend.get(`/initialInterview`);
        const frontDeskResponse = await backend.get(`/frontDesk`);
        const caseManagersMonthlyResponse = await backend.get(`/caseManagerMonthlyStats`);
        const allCaseManagersResponse = await backend.get(`/caseManagers`);

        // TO BE IMPLEMENTED:
        // Not sure if intake statistics are implemented yet. Will need to fetch data once the table exists.
        // Will need to link the routes between each form.

        // const intakeStatisticsResponse = await backend.get(`/undefined`);

        const initialScreeners: FormItem[] = screenerResponse.data.map(
          (item) => ({
            id: item.id,
            date: item.date,
            name: item.name,
            title: "Initial Screeners",
          })
        );

        const intakeStatistics: FormItem[] = [];

        const frontDeskStats: FormItem[] = frontDeskResponse.data.map(
          (item) => ({
            id: item.id,
            date: item.date,
            name: "",
            title: "Front Desk Monthly Statistics",
          })
        );

        const caseManagerStats: FormItem[] =
          caseManagersMonthlyResponse.data.map((item) => {
            const matchingCM = allCaseManagersResponse.data.find(
              (cm) => cm.id === item.cmId
            );
            return {
              id: item.id,
              date: item.date,
              name: `${matchingCM.firstName} ${matchingCM.lastName}`,
              title: "Case Manager Monthly Statistics",
            };
          });

        setItems([
          ...initialScreeners,
          ...intakeStatistics,
          ...frontDeskStats,
          ...caseManagerStats,
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [backend]);

  const buttonStyle = (view: ViewOption) => {
    const isActive = currentView === view;
    return {
      px: "3vh",
      fontSize: "15pt",
      textAlign: "center" as const,
      cursor: "pointer",
      color: isActive ? "#3182CE" : "#1A202C",
      borderBottom: isActive ? "2px solid" : "none",
      borderColor: isActive ? "#3182CE" : "transparent",
      _hover: { bg: "transparent" },
      whiteSpace: "nowrap",
    };
  };

  const filteredData = useMemo(() => {
    if (currentView === "All Forms") return items;

    return items.filter((item) => {
      if (currentView === "Client Tracking Statistics (Intake Statistics)") {
        return item.title === "Intake Statistics";
      }

      return item.title === currentView;
    });
  }, [currentView, items]);

  const baseFontSize = 16;
  return (
    <Box p="4">
      <Text
        fontSize="13pt"
        fontWeight="bold"
      >
        Form History
      </Text>
      <Text fontSize="12pt">Last Updated: MM/DD/YYYY HH:MM XX</Text>

      <Flex
        overflowX="auto"
        marginTop="1.5rem"
        h="40px"
        alignItems="center"
        w="95%"
        mb="4"
      >
        <Box
          {...buttonStyle("All Forms")}
          onClick={() => setCurrentView("All Forms")}
        >
          All Forms
        </Box>
        <Box
          {...buttonStyle("Initial Screeners")}
          onClick={() => setCurrentView("Initial Screeners")}
        >
          Initial Screeners
        </Box>
        <Box
          {...buttonStyle("Client Tracking Statistics (Intake Statistics)")}
          onClick={() =>
            setCurrentView("Client Tracking Statistics (Intake Statistics)")
          }
        >
          Client Tracking Statistics (Intake Statistics)
        </Box>
        <Box
          {...buttonStyle("Front Desk Monthly Statistics")}
          onClick={() => setCurrentView("Front Desk Monthly Statistics")}
        >
          Front Desk Monthly Statistics
        </Box>
        <Box
          {...buttonStyle("Case Manager Monthly Statistics")}
          onClick={() => setCurrentView("Case Manager Monthly Statistics")}
        >
          Case Manager Monthly Statistics
        </Box>
      </Flex>

      <Box borderWidth="2pt" borderColor="#E2E8F0" borderRadius='1rem' p={5}>

      <Box maxW="100%" overflow="auto" bg="white" p="4">
        <TableContainer fontSize={baseFontSize}>
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Index</Th>
                <Th>Date</Th>
                <Th>Name</Th>
                <Th minW="200px">Form Title</Th>
                <Th w="50px" textAlign="right">
                  Export
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((item, index) => (
                <Tr key={item.id} _hover={{ bg: "gray.200" }}>
                  <Td w="10%">{index + 1}</Td>
                  <Td w="15%">{formatDate(item.date)}</Td>
                  <Td w="20%">{item.name}</Td>
                  <Td minW="200px">{item.title}</Td>
                  <Td w="50px" textAlign="right">
                  </Td>
                </Tr>
              ))}
              {filteredData.length === 0 && (
                <Tr>
                  <Td colSpan={5} textAlign="center" py={6}>
                    No data found.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      </Box>
    </Box>
  );
};
