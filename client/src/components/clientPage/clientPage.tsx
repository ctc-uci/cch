import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

interface Client {
  id: number;
  name: string;
  dob: string;
  age: number;
  custody: string;
  school: string;
  grade: string;
  comments: string;
}

export const ClientChildren = () => {
  const { backend } = useBackendContext();
  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await backend.get('/clients');
      const data = response.data; // Adjust this if your response structure is different
      setItems(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data once when the component mounts

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>DOB</Th>
            <Th>Age</Th>
            <Th>Custody</Th>
            <Th>School</Th>
            <Th>Grade</Th>
            <Th>Comments</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr key={item.id}>
              <Td>{item.name}</Td>
              <Td>{item.dob}</Td>
              <Td>{item.age}</Td>
              <Td>{item.custody}</Td>
              <Td>{item.school}</Td>
              <Td>{item.grade}</Td>
              <Td>{item.comments}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};