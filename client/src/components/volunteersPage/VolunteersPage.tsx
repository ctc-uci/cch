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
    };

    fetchData();
  }, [backend]);

  return (
    <HStack align="start">
      <VStack
        width="25%"
        padding="24px"
        flexShrink={0}
      >
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
