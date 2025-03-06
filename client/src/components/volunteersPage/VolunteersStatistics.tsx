import {
  Box,
  Heading,
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
      <VStack align="left" spacing="4px">
        <Text
          fontSize="30px"
          fontWeight="semibold"
        >
          Volunteer Tracking
        </Text>
        <Text size="med">Last Updated: MM/DD/YYYY HH:MM XX</Text>
      </VStack>
      <Stat
        border="1px solid #E2E8F0"
        borderRadius="8px"
        padding="24px"
        w="100%"
      >
        <StatNumber
          fontSize={"4xl"}
          fontWeight="bold"
          paddingBottom="8px"
          lineHeight="40px"
        >
          {totalVolunteers}
        </StatNumber>
        <StatLabel>
          <HStack spacing={1}>
            <MdOutlineEmojiPeople
              color="#4397CD"
              size="20px"
            />
            <Text
              fontWeight="normal"
              size="med"
            >
              Total Volunteers
            </Text>
          </HStack>
        </StatLabel>
      </Stat>
      <Stat
        border="1px solid #E2E8F0"
        borderRadius="8px"
        padding="24px"
        w="100%"
      >
        <StatNumber
          fontSize={"4xl"}
          fontWeight="bold"
          paddingBottom="8px"
          lineHeight="40px"
        >
          {totalHours}
        </StatNumber>
        <StatLabel>
          <HStack spacing={1}>
            <MdOutlineAccessAlarm
              color="#4397CD"
              size="20px"
            />
            <Text
              fontWeight="normal"
              size="med"
            >
              Total Hours
            </Text>
          </HStack>
        </StatLabel>
      </Stat>
    </VStack>
  );
};

export default VolunteersStatistics;
