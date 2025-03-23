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
  Checkbox,
  Th,
  Thead,
  IconButton,
  Tr,
} from "@chakra-ui/react";

import { FiUpload } from "react-icons/fi";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { downloadCSV } from "../../utils/downloadCSV";
import PrintForm from "../PrintForm";
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox";

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

  const tableMapping: Record<FormItem["title"], number> = {
    "Initial Screeners": 1,
    "Intake Statistics": 2,
    "Front Desk Monthly Stats": 3,
    "Case Manager Monthly Stats": 4,
  };

// I know you said to also include the formTable but I wanted to be able to treat all forms
// with an INT id so I just pushed the ids to the right and put a marker at the front
// For example if a row came from initial screeners and had id 2 it would become 12.
const createHashedId = (id: number, title: FormItem["title"]) => {
  const tableNumber = tableMapping[title];
  return (id << 2) | tableNumber;
};



export const FormTable = () => {
  const { backend } = useBackendContext();
  const [items, setItems] = useState<FormItem[]>([]);
  const [currentView, setCurrentView] = useState<ViewOption>("All Forms");
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [initialScreenerDate, setInitialScreenerDate] = useState<Date | null>(null);
  const [frontDeskDate, setFrontDeskDate] = useState<Date | null>(null);
  const [cmMonthlyDate, setCMMonthlyDate] = useState<Date | null>(null);
  const [mostRecentDate, setMostRecentDate] = useState<Date | null>(null);

  const formatDate = (x: string) => {
    const date = new Date(x);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSelectAllCheckboxClick = () => {
    if (selectedRowIds.length === 0) {
      setSelectedRowIds(items.map((item) => createHashedId(item.id, item.title)));
    } else {
      setSelectedRowIds([]);
    }
  };



  const handleRowSelect = (hashedId: number, isChecked: boolean) => {

    if (isChecked) {
      setSelectedRowIds((prev) => [...prev, hashedId]);
    } else {
      setSelectedRowIds((prev) => prev.filter((id) => id !== hashedId));
    }
  };



  const handleExport = () => {
    const selectedItems = items.filter(item =>
      selectedRowIds.includes(createHashedId(item.id, item.title))
    );
    const headers = ["Date", "Name", "Form Title"];
    const data = selectedItems.map(item => ({
      "Date": formatDate(item.date),
      "Name": item.name,
      "Form Title": item.title,
    }));
    downloadCSV(headers, data, "forms.csv");
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const screenerResponse = await backend.get(`/initialInterview`);
        const frontDeskResponse = await backend.get(`/frontDesk`);
        const caseManagersMonthlyResponse = await backend.get(`/caseManagerMonthlyStats`);
        const allCaseManagersResponse = await backend.get(`/caseManagers`);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialScreenerResponse = await backend.get(`/lastUpdated/initial_interview`);
        const frontDeskMonthlyStatsResponse = await backend.get(`/lastUpdated/front_desk_monthly`);
        const cmMonthlyStatsResponse = await backend.get(`/lastUpdated/cm_monthly_stats`);
        
        const getDate = (date) => {
          if (date && date[0] && date[0].lastUpdatedAt){
            return new Date(date[0].lastUpdatedAt);
          }
          return null;
        }

        const initialScreener = getDate(initialScreenerResponse.data);
        const frontDesk = getDate(frontDeskMonthlyStatsResponse.data);
        const cmMonthly = getDate(cmMonthlyStatsResponse.data);
        
        setInitialScreenerDate(initialScreener);
        setFrontDeskDate(frontDesk);
        setCMMonthlyDate(cmMonthly);
  
        const mostRecent = new Date(Math.max(
          initialScreener ? initialScreener.getTime() : 0,
          frontDesk ? frontDesk.getTime() : 0,
          cmMonthly ? cmMonthly.getTime() : 0
        ));
        setMostRecentDate(mostRecent.getTime() === 0 ? null : mostRecent);
      } catch (error) {
        console.error("Error fetching last updated:", error);
      }
    };
  
    fetchData();
  }, [backend]);

  useEffect(() => {
    if (currentView === "All Forms" && mostRecentDate) {
      setLastUpdated(mostRecentDate.toLocaleString());
    } else if (currentView === "Initial Screeners" && initialScreenerDate) {
      setLastUpdated(initialScreenerDate.toLocaleString());
    } else if (currentView === "Front Desk Monthly Statistics" && frontDeskDate) {
      setLastUpdated(frontDeskDate.toLocaleString());
    } else if (currentView === "Case Manager Monthly Statistics" && cmMonthlyDate) {
      setLastUpdated(cmMonthlyDate.toLocaleString());
    } else {
      setLastUpdated("");
    }
  }, [currentView, initialScreenerDate, frontDeskDate, cmMonthlyDate, mostRecentDate])


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
      {/* <Text fontSize="12pt">Last Updated: MM/DD/YYYY HH:MM XX</Text> */}
      <Text fontSize="12pt">Last Updated: {lastUpdated}</Text>

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
        <TableContainer fontSize={baseFontSize} sx={{
            overflowX: "auto",
            maxHeight: "600px",
            overflowY: "auto",
            maxWidth: "100%"
          }}>
          <Table variant="striped" colorScheme="gray">
            <Thead zIndex={1} backgroundColor="white" position="sticky" top={0}>
              <Tr>
              <Th textAlign={"center"}>
                  <Checkbox
                    justifySelf="center"
                    colorScheme="cyan"
                    isChecked={selectedRowIds.length > 0}
                    onChange={handleSelectAllCheckboxClick}
                  />
                </Th>
                <Th>Date</Th>
                <Th>Name</Th>
                <Th minW="200px">Form Title</Th>
                <Th w="50px" textAlign="right">
                <IconButton
              aria-label="Download CSV"
              onClick={() =>
                handleExport()
              }
            >
              <FiUpload />
            </IconButton>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((item, index) => (
                <Tr key={item.id} _hover={{ bg: "gray.200" }}>
                  <Td w="10%" onClick={(e) => e.stopPropagation()}
                          >
                          <HoverCheckbox
  clientId={createHashedId(item.id, item.title)}
  index={index}
  isSelected={selectedRowIds.includes(createHashedId(item.id, item.title))}
  onSelectionChange={handleRowSelect}
/>
</Td>
                  <Td w="15%">{formatDate(item.date)}</Td>
                  <Td w="20%">{item.name}</Td>
                  <Td minW="200px">{item.title}</Td>
                  <Td w="50px" textAlign="right">
                  <PrintForm formId={item.id} formType={item.title} />
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
