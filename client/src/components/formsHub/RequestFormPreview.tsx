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
  Tr, useToast,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext.ts";
import { useAuthContext } from "../../contexts/hooks/useAuthContext.ts";
import { formatDateString } from "../../utils/dateUtils.ts";

export const RequestFormPreview = ({
  cmId,
  clientEmail,
  onClose,
}: {
  cmId?: number;
  clientEmail?: string;
  onClose: () => void;
}) => {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();

  const toast = useToast();

  const [requestHistoryDates, setRequestHistoryDates] = useState<string[]>([]);
  const [requestComment, setRequestComment] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        // If we don't have a client email, we can't look up history
        if (!clientEmail) {
          setRequestHistoryDates([]);
          return;
        }

        // Resolve client ID from email
        let clientId: number | undefined;

        try {
          const response = await backend.get(
            `/clients/email/${encodeURIComponent(clientEmail)}`
          );
          const clients = Array.isArray(response.data) ? response.data : [];
          if (clients.length > 0 && clients[0]?.id) {
            clientId = clients[0].id;
          }
        } catch {
          // If we can't resolve the client, just show empty history
        }

        if (!clientId) {
          setRequestHistoryDates([]);
          return;
        }

        // Fetch all requests and filter to this specific client
        const response = await backend.get("/request");
        const allRequests = Array.isArray(response.data) ? response.data : [];

        const clientRequests = allRequests
          .filter(
            (request: { client_id?: number }) => request.client_id === clientId
          )
          .sort(
            (a: { created_at?: string }, b: { created_at?: string }) =>
              new Date(b.created_at ?? "").getTime() -
              new Date(a.created_at ?? "").getTime()
          );

        const dates = clientRequests.map((req: { created_at?: string }) =>
          req.created_at ? formatDateString(req.created_at) : ""
        );

        setRequestHistoryDates(dates.filter((d) => d !== ""));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [backend, clientEmail, setRequestHistoryDates]);

  const handleSubmitRequest = async () => {
    try {
      if (!cmId || !clientEmail) {
        toast({
          title: "Missing required data",
          description:
            "Unable to submit the request without case manager or client information.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Find the client by email
      let clientId: number | undefined;

      try {
        const response = await backend.get(
          `/clients/email/${encodeURIComponent(clientEmail)}`
        );
        const clients = Array.isArray(response.data) ? response.data : [];
        if (clients.length > 0 && clients[0]?.id) {
          clientId = clients[0].id;
        }
      } catch (_error) {
        // Ignore and surface unified "Client not found" toast below
      }

      if (!clientId) {
        toast({
          title: "Client not found",
          description:
            "We couldn't find a client matching the provided email address.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      await backend.post("/request", {
        comments: requestComment,
        client_ids: [clientId],
        admin: currentUser,
      });

      toast({
        title: "Successfully request form",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Error handing submit request:", error);

      toast({
        title: "Did not successfully submit request form",
        description: `There was an error while submitting the request.`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
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
