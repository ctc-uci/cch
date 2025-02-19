import { VStack, Heading, Text, Box } from "@chakra-ui/react";
import { StartForms } from "./startForm";
import { FormTable } from "./formsTable";

export const FormsHub = () => {
  return (
    <VStack spacing={8} align="stretch" >
      <Box>
        <Heading p={6} as="h1" size="xl" mb={2}>
          Forms
        </Heading>
        </Box>
        <Text fontWeight="bold" px={6} fontSize="lg" >
          Start a Form
        </Text>

      <StartForms />
      <Box px={8}>
      <FormTable />
      </Box>
    </VStack>
  );
};
