import {
  Box,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";

import { MdOutlineAccessAlarm, MdOutlineEmojiPeople } from "react-icons/md";

const VolunteersStatistics = ({
  totalVolunteers,
  totalHours,
}: {
  totalVolunteers: number;
  totalHours: number;
}) => {
  return (
    <VStack
      gap="24px"
      w="100%"
    >
      <Stat
        border="1px solid #E2E8F0"
        borderRadius="8px"
        p={4}
        w="100%"
        gap="16px"
      >
        <StatNumber
          fontSize={"3xl"}
          fontWeight="bold"
        >
          {totalVolunteers}
        </StatNumber>
        <StatLabel>
          <HStack spacing={1}>
            <MdOutlineEmojiPeople
              color="#4397CD"
              size="20px"
            />
            <Text fontWeight="normal">Total Volunteers</Text>
          </HStack>
        </StatLabel>
      </Stat>

      <Stat
        border="2px solid #CBD5E0"
        borderRadius="12px"
        p={4}
        w="100%"
        gap="16px"
      >
        <StatNumber
          fontSize={"3xl"}
          fontWeight="bold"
        >
          {totalHours}
        </StatNumber>
        <StatLabel>
          <HStack spacing={1}>
            <MdOutlineAccessAlarm
              color="#4397CD"
              size="20px"
            />
            <Text fontWeight="normal">Total Hours</Text>
          </HStack>
        </StatLabel>
      </Stat>
    </VStack>
  );
};

export default VolunteersStatistics;
