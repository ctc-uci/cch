import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Table,
  Text,
  Textarea,
  Thead,
  Tr,
  VStack,
  Box,
  Tbody,
  Td,
  Th
} from "@chakra-ui/react";

export const RequestFormPreview = () => {
  return (
    <VStack
      spacing={6}
      align="stretch"
    >
      <Box>
        <Heading
          size="sm"
          mb={2}
        >
          Unable to Show Form Preview
        </Heading>
        <Text fontSize="sm">
          To protect our clients’ sensitive information, the form preview isn’t
          available. We take data privacy seriously and want to ensure that all
          details are kept secure.
        </Text>
      </Box>

      <Box>
        <Text
          fontWeight="medium"
          mb={1}
        >
          Need to edit form? Send a Request to an Admin here:
        </Text>
        <FormControl>
          <FormLabel>Request Change:</FormLabel>
          <Textarea placeholder="Type Here" />
        </FormControl>
        <Button
          mt={2}
          colorScheme="blue"
        >
          Send Request
        </Button>
      </Box>

      <Box>
        <Heading
          size="sm"
          mb={2}
        >
          Request History
        </Heading>
        <Table
          variant="simple"
          size="sm"
        >
          <Thead>
            <Tr>
              <Th># REQUEST SENT</Th>
              <Th>DATE AND TIME</Th>
            </Tr>
          </Thead>
          <Tbody>
              <Tr>
                <Td colSpan={2}>No entries yet</Td>
              </Tr>
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};
