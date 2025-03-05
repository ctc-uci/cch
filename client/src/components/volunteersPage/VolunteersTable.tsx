import { useEffect, useState } from "react";

import {
  Box,
  Heading,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const VolunteersTable = () => {
  const { backend } = useBackendContext();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await backend.get("/volunteers"); // Adjust the API endpoint as necessary
        setVolunteers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, [backend]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th textAlign="left">ID</Th>
                <Th textAlign="left">First Name</Th>
                <Th textAlign="left">Last Name</Th>
                <Th textAlign="left">Email</Th>
                <Th textAlign="left">Event Type</Th>
                <Th textAlign="left">Date</Th>
                <Th textAlign="center">Hours</Th>
                <Th textAlign="center">Value ($)</Th>
                <Th textAlign="center">Total ($)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {volunteers.map((volunteer) => (
                <Tr key={volunteer.id}>
                  <Td textAlign="left">{volunteer.id}</Td>
                  <Td textAlign="left">{volunteer.firstName}</Td>
                  <Td textAlign="left">{volunteer.lastName}</Td>
                  <Td textAlign="left">{volunteer.email}</Td>
                  <Td textAlign="left">{volunteer.eventType}</Td>
                  <Td textAlign="left">{volunteer.date}</Td>
                  <Td textAlign="center">{volunteer.hours}</Td>
                  <Td textAlign="center">{volunteer.value}</Td>
                  <Td textAlign="center">{volunteer.total}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
  );
};

export default VolunteersTable;
