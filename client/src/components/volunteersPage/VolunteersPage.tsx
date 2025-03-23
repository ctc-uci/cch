import { useEffect, useState } from "react";

import { Flex, VStack } from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import VolunteersStatistics from "./VolunteersStatistics";
import VolunteersTable from "./VolunteersTable";

const VolunteersPage = () => {
  const { backend } = useBackendContext();
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [toggleRefresh, setToggleRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
  }, [backend, toggleRefresh, totalVolunteers, totalHours]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get(`/lastUpdated/volunteers`);
        const date = new Date(response.data[0].lastUpdatedAt);
        const formattedDate = date.toLocaleString();
        setLastUpdated(formattedDate);

      } catch (error) {
        console.error("Error fetching last updated:", error);
      }
    };

    fetchData();
  }, [lastUpdated, backend]);

  return (
    <Flex align="start">
      <VStack
        width="25%"
        padding="24px"
      >
        <VolunteersStatistics
          totalVolunteers={totalVolunteers}
          totalHours={totalHours}
          lastUpdated={lastUpdated}
        />
      </VStack>
      <VStack
        width="74%"
        paddingTop="60px"
        spacing="14px"
      >
        <VolunteersTable
          toggleRefresh={toggleRefresh}
          setToggleRefresh={setToggleRefresh}
          setTotalVolunteers={setTotalVolunteers}
          setTotalHours={setTotalHours}
        />
      </VStack>
    </Flex>
  );
};

export default VolunteersPage;
