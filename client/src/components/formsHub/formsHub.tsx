import { Box, Heading, Text, VStack } from "@chakra-ui/react";

import { FormTable } from "./formsTable";
import { StartForms } from "./startForm";

export const FormsHub = () => {
  return (
    <VStack
      overflowX="hidden"
      w="100vw"
      spacing={8}
      align="stretch"
    >
      <Box>
        <Heading
          p={6}
          as="h1"
          size="xl"
          mb={2}
        >
          Forms
        </Heading>
      </Box>
      <Text
        fontWeight="bold"
        px={6}
        fontSize="lg"
      >
        Start a Form
      </Text>

      <StartForms />
      <Box px={8}>
        <FormTable />
      </Box>
    </VStack>
  );
};
