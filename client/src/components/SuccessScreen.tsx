import { Box, Center, Text, VStack } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/hooks/useAuthContext";

export const SuccessScreen = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  return (
    <Center
      minH="100vh"
      bg="white"
      cursor="pointer"
      onClick={async () => {
        try {
          await logout();
        } finally {
          navigate('/landing-page');
        }
      }}
    >
      <VStack spacing={6}>
        <Text fontSize="3xl" fontWeight="normal">
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
        <Text color="gray.500" fontSize="md">
          Please return device to front desk.
        </Text>
      </VStack>
    </Center>
  );
};