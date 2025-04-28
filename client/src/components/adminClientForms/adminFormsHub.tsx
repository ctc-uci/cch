import { Box, Heading, Text, VStack } from "@chakra-ui/react";

import { FormTable } from "./formsTable";

export const AdminFormsHub = () => {
  return (

    <VStack
      overflowX="hidden"
      w="100vw"
      spacing={8}
      align="stretch"
    >
      <Box px={9}>
        <Heading
          p={6}
          as="h1"
          size="xl"
          mb={2}
        >
          Client Forms
        </Heading>
      </Box>
      <Box px={10}>
        <FormTable />
      </Box>
    </VStack>
  );
};
