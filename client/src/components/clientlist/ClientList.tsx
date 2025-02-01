import { useEffect, useState } from "react";

import {
  Button,
  Heading,
  HStack,
  IconButton,
  Input,
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

import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Client } from "../../types/client";
import { downloadCSV } from "../../utils/downloadCSV";

export const ClientList = () => {
  const headers = [
    "Client First Name",
    "Client Last Name",
    "Phone Number",
    "E-mail",
    "Entrance Date",
    "Exit Date",
    "Birthday",
  ];

  const navigate = useNavigate();

  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();

  const [clients, setClients] = useState<Client[]>([]);
  const [searchKey, setSearchKey] = useState("");

  const onPressCSVButton = () => {
    const data = 
      clients.map(client => {return {
        "Client First Name": client.firstName,
        "Client Last Name": client.lastName,
        "Phone Number": client.phoneNumber,
        "E-mail": client.email,
        "Entrance Date": client.entranceDate,
        "Exit Date": client.exitDate,
        "Birthday": client.dateOfBirth
      }});
    
      downloadCSV(headers, data)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = searchKey
          ? await backend.get(`/clients?page=&filter=&search=${searchKey}`)
          : await backend.get("/clients");
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [backend, searchKey]);

  return (
    <VStack
      spacing={2}
      align="start"
      sx={{ maxWidth: "100%", marginX: "auto", padding: "4%" }}
    >
      <Heading paddingBottom="4%">Welcome, {currentUser?.displayName}</Heading>
      <HStack width="100%">
        <Heading size="md">My Complete Client Table</Heading>
        <Heading
          size="sm"
          paddingLeft="10%"
        >
          Last Updated: {}
        </Heading>
      </HStack>

      <VStack></VStack>
      <HStack
        width="100%"
        justifyContent="space-between"
      >
        <Input
          fontSize="12px"
          width="20%"
          height="30px"
          placeholder="search"
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <HStack
          width="55%"
          justifyContent="space-between"
        >
          <Text fontSize="12px">
            showing {clients.length} results on this page
          </Text>
          <HStack>
            <Button></Button>
            <Text fontSize="12px">
              page {} of {Math.ceil(clients.length / 20)}
            </Text>
            <Button></Button>
          </HStack>
          <HStack>
            <Button fontSize="12px">delete</Button>
            <Button fontSize="12px">add</Button>
            <IconButton
              aria-label="Download CSV"
              onClick={() =>
                onPressCSVButton()
              }
            >
              <FiUpload />
            </IconButton>
          </HStack>
        </HStack>
      </HStack>
      <TableContainer
        sx={{
          overflowX: "auto",
          maxWidth: "100%",
          border: "1px solid gray",
        }}
      >
        <Table variant="striped">
          <Thead>
            <Tr>
              {headers.map((header, index) => (
                <Th key={index}>{header}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {clients
              ? clients.map((client) => (
                  <Tr
                    key={client.id}
                    onClick={() => navigate(`/ViewClient/${client.id}`)}
                    style={{ cursor: "pointer" }}
                  >
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
    </VStack>
  );
};
