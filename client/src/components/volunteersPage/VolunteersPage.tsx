import { useEffect, useState } from "react";

import { Heading, HStack, Text, VStack } from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import VolunteersStatistics from "./VolunteersStatistics";
import VolunteersTable from "./VolunteersTable";

const VolunteersPage = () => {
  const { backend } = useBackendContext();
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [refreshStatus, setRefreshStatus] = useState(true);

  // const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (refreshStatus) {
      fetchData();
      setRefreshStatus(false);
    }

    fetchData();
  }, [backend, refreshStatus]);


  return (
    <HStack
      align="start"
      spacing="24px"
      paddingTop="24px"
      paddingLeft="24px"
    >
      <VStack>
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
