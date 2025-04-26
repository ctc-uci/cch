import { useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext.ts";
import { formatDateString } from "../../utils/dateUtils.ts";

export const RequestFormPreview = () => {
  const { backend } = useBackendContext();

  const [requestHistoryDates, setRequestHistoryDates] = useState([]);
  const [requestComment, setRequestComment] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await backend.get("/request/activeRequests");
        const dates = [];

        for (const data of response.data) {
          dates.push(formatDateString(data.created_at));
        }

        setRequestHistoryDates(dates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [backend, setRequestHistoryDates]);

  const handleSubmitRequest = async () => {
    try {
      await backend.post("/request", {
        comments: requestComment,
        cm_id: 0,
        client_ids: [],
      });
    } catch (error) {
      console.error("Error handing submit request:", error);
    }
  };

  return (
    <Box
      w="100%"
      p={6}
    >
      <Box
        w="100%"
        h="100%"
        mx="auto"
        border="1px"
        borderColor="gray.200"
        bg="gray.100"
        borderRadius="md"
        boxShadow="sm"
        p={6}
      >
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
            <Text
              fontSize="sm"
              color="gray.600"
            >
              To protect our clients’ sensitive information, the form preview
              isn’t available. We take data privacy seriously and want to ensure
              that all details are kept secure.
            </Text>
          </Box>

          <Box>
            <Text
              fontWeight="semibold"
              mb={1}
            >
              Need to edit form? Send a Request to an Admin here:
            </Text>
            <FormControl>
              <FormLabel fontSize="sm">Request Change:</FormLabel>
              <Textarea
                placeholder="Type Here"
                size="sm"
                onChange={(e) => setRequestComment(e.target.value)}
              />
            </FormControl>
            <Button
              mt={3}
              colorScheme="blue"
              size="sm"
              onClick={handleSubmitRequest}
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
            <TableContainer>
              <Table
                variant="simple"
                size="sm"
              >
                <Thead>
                  <Tr>
                    <Th fontSize="xs"># REQUEST SENT</Th>
                    <Th fontSize="xs">DATE AND TIME</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {requestHistoryDates.length === 0 ? (
                    <Tr>
                      <Td colSpan={2}>
                        <Text
                          fontSize="sm"
                          color="gray.500"
                        >
                          No entries yet
                        </Text>
                      </Td>
                    </Tr>
                  ) : (
                    requestHistoryDates.map((date, index) => (
                      <Tr>
                        <Td>{index + 1}</Td>
                        <Td>{date}</Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};
