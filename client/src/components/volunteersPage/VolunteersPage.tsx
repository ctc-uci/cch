import { useEffect, useState } from "react";

import { Heading, HStack, Text, VStack } from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import VolunteersStatistics from "./VolunteersStatistics";
import VolunteersTable from "./VolunteersTable";

const VolunteersPage = () => {
  const { backend } = useBackendContext();
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalHoursResponse = await backend.get("/volunteers/total-hours");
        const totalVolunteersResponse = await backend.get(
          "/volunteers/total-volunteers"
        );
        setTotalHours(totalHoursResponse.data.totalHours);
        setTotalVolunteers(totalVolunteersResponse.data.totalVolunteers);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [backend]);


  return (
    <HStack
      align="start"
      spacing="24px"
      paddingTop="24px"
      paddingLeft="24px"
      width="100%"
    >
      <VStack
      width="20%"
      flexShrink={0}>
        <Heading fontSize="24px">Volunteer Tracking</Heading>
        <Text fontSize="14px">Last Updated: MM/DD/YYYY HH:MM XX</Text>
        <VolunteersStatistics
          totalVolunteers={totalVolunteers}
          totalHours={totalHours}
        />
      </VStack>
      <VolunteersTable />
    </HStack>
  );
};

export default VolunteersPage;
