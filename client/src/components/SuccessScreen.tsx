import { Box, Center, Text, VStack } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

export const SuccessScreen = () => {
  return (
    <Center minH="100vh" bg="white">
      <VStack spacing={6}>
        <Text fontSize="2xl" fontWeight="normal">
          You're all set!
        </Text>
        <Box
          bg="#4CAF50"
          w="80px"
          h="80px"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CheckIcon color="white" boxSize={10} />
        </Box>
        <Text color="gray.500" fontSize="sm">
          Please return device to front desk.
        </Text>
      </VStack>
    </Center>
  );
}; 