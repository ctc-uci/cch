import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CSVButton from "./CSVButton.tsx";
import {
  Button,
  Input,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  HStack,
} from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  entranceDate: string;
  exitDate: string;
  dateOfBirth: string;
}

export const ClientList = () => {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();

  const [clients, setClients] = useState<Client[]>([]);
  const [searchKey, setSearchKey] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (searchKey) {
          response = await backend.get(`/clients?page=&filter=&search=${searchKey}`);
        } else {
          response = await backend.get("/clients");
        }
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [backend, searchKey]);

  return (
    <VStack
      spacing = {2}
      align = "start"
      sx={{ maxWidth: "100%", marginX: "auto", padding: "4%" }}
    >
      <Heading paddingBottom = "4%">Welcome, {currentUser?.displayName}</Heading>
      <HStack width="100%">
        <Heading size = "md">My Complete Client Table</Heading>
        <Heading size = "sm" paddingLeft = "10%">Last Updated: {}</Heading>
      </HStack>

      <VStack>
      </VStack>
      <HStack width = "100%" justifyContent = "space-between">
        <Input fontSize = "12px" width = "20%" height= "30px" placeholder = 'search' onChange={(e) => setSearchKey(e.target.value)}/>
        <HStack width  = "55%" justifyContent="space-between">
          <Text fontSize = "12px">showing {Object.keys(clients).length} results on this page</Text>
          <HStack>
            <Button></Button>
            <Text fontSize = "12px">page {} of {Math.ceil((Object.keys(clients).length)/20)}</Text>
            <Button></Button>
          </HStack>
          <HStack>
            <Button fontSize = "12px">delete</Button>
            <Button fontSize = "12px">add</Button>
          </HStack>
        </HStack>
      </HStack>
      <TableContainer
        sx={{
          overflowX: "auto",
          maxWidth: "100%",
          border: "1px solid gray"
        }}
      >
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Client First Name</Th>
              <Th>Client Last Name</Th>
              <Th>Phone Number</Th>
              <Th>E-mail</Th>
              <Th>Entrance Date</Th>
              <Th>Exit Date</Th>
              <Th>Birthday</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients
              ? clients.map((client) => (
                  <Tr key={client.id} onClick={() => navigate(``)} style={{ cursor: "pointer" }}>
                    <Td>{client.firstName}</Td>
                    <Td>{client.lastName}</Td>
                    <Td>{client.phoneNumber}</Td>
                    <Td>{client.email}</Td>
                    <Td>{client.entranceDate}</Td>
                    <Td>{client.exitDate}</Td>
                    <Td>{client.dateOfBirth}</Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>
      <CSVButton data={clients} />
    </VStack>
  );
};
