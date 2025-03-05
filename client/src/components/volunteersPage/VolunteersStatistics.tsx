import { Box, Text } from '@chakra-ui/react';

const VolunteersStatistics = () => {
  return (
    <>
      <Box textAlign="left" width="100%">
        <Text fontSize="lg" fontWeight="bold">Total Volunteers</Text>
        <Text fontSize="2xl" color="blue.500">{5}</Text>
      </Box>
      <Box
        borderWidth="1px"
        borderRadius="12px"
        padding="16px"
        boxShadow="md"
        textAlign="center"
        width="100%"
      >
        <Text fontSize="lg" fontWeight="bold">Total Hours</Text>
        <Text fontSize="2xl" color="blue.500">{10}</Text>
      </Box>
    </>
  );
};

export default VolunteersStatistics;
