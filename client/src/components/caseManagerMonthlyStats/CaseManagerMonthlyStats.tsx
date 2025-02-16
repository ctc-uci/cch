import {
    Button,
    ButtonGroup,
    Heading,
    HStack,
    Select,
    VStack,
    Tabs, TabList, Tab, TabPanel, TabPanels, Text
  } from "@chakra-ui/react";
  import {StatsTable} from "./StatsTable.tsx";
  
  export const CaseManagerMonthlyStats = () => {
    const buttonStyle = {
      variant: "outline",
      colorScheme: "blue",
    };
  
    return (
      <VStack
        align="start"
        sx={{ maxWidth: "100%", padding: "4%" }}
      >
        <VStack align="start" gap="10px">
          <Heading>Monthly Statistics</Heading>
          <Text fontSize="14px">Last Updated: MM/DD/YYYY HH:MM XX</Text>
        </VStack>
  
        <HStack alignSelf="end">
          <ButtonGroup size="sm">
            <Button {...buttonStyle}>Start Front Desk Form</Button>
            <Button {...buttonStyle}>Start Case Manager Form</Button>
          </ButtonGroup>
          <Select>
            <option>2025</option>
          </Select>
        </HStack>
  
        <Tabs isFitted w="full">
          <TabList whiteSpace="nowrap">
            <Tab>All Statistics</Tab>
            <Tab>Call and Office Visits</Tab>
            <Tab>Interviews</Tab>
            <Tab>Contacts</Tab>
            <Tab>Donation & Pantry Visits</Tab>
            <Tab>Birthdays</Tab>
            <Tab>E&TH Food & Bus</Tab>
            <Tab>Referrals</Tab>
            <Tab>Misc.</Tab>
          </TabList>
  
          <TabPanels>
            <TabPanel>
              <StatsTable/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    );
  };
  