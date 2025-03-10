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

  useEffect(() => {
  }, [backend, toggleRefresh, totalVolunteers, totalHours]);

  return (
    <Flex align="start">
      <VStack
        width="25%"
        padding="24px"
      >
        <VolunteersStatistics
          totalVolunteers={totalVolunteers}
          totalHours={totalHours}
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
