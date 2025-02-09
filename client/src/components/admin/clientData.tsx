import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

import {
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  type: string;
  bedNightsChildren: string;
  cmFirst: string;
  cmLast: string;
  lName: string;
}

export const ClientData = () => {
  const { backend } = useBackendContext();

  const [clients, setClients] = useState<ClientData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientResponse = await backend.get("/clientData");
        setClients(clientResponse.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [backend]);

  return (
    <VStack
      spacing = {2}
      align = "start"
      sx={{ maxWidth: "100%", marginX: "auto", padding: "4%" }}
    >
      <Heading paddingBottom = "10px">Client Data</Heading>
      <Heading size = "md" paddingBottom="40px">Last Updated: {}</Heading>
      <TableContainer
        width = "100%"
        sx={{
          overflowX: "auto",
          maxWidth: "100%",
          border: "1px solid gray"
        }}
      >
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Unit Type</Th>
              <Th>Family Size</Th>
              {/* <Th>Occupied</Th> */}
              <Th>Case manager</Th>
              <Th>Site</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients
              ? clients.map((client) => (
                  <Tr key={client.id}>
                    <Td>{client.firstName}</Td>
                    <Td>{client.lastName}</Td>
                    <Td>{client.type}</Td>
                    <Td>{client.bedNightsChildren + 1}</Td>
                    <Td>{client.cmFirst + ' '+ client.cmLast}</Td>
                    <Td>{client.lName}</Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};
