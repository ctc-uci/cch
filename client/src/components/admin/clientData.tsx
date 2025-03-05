import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

import {
  Button,
  Checkbox,
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
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox";
import { DeleteRowModal } from "../deleteRow/deleteRowModal";

interface ClientData {
  id: number;
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

  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);


  const handleSelectAllCheckboxClick = () => {
    if (selectedRowIds.length === 0) {
      setSelectedRowIds(clients.map((client) => client.id));
    } else {
      setSelectedRowIds([]);
    }
  };


  const handleRowSelect = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRowIds((prev) => [...prev, id]);
    } else {
      setSelectedRowIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRowIds.map((row_id) => backend.delete(`/clientData/${row_id}`))
      );
      setClients(clients.filter((client) => !selectedRowIds.includes(client.id)));
      setSelectedRowIds([]);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting client data", error);
    }
  };


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
      <Button
              fontSize="12px"
              onClick={() => setDeleteModalOpen(true)}
              isDisabled={selectedRowIds.length === 0}
            >
              delete
      </Button>
      <TableContainer
        width = "100%"
        sx={{
          overflowX: "auto",
          overflowY: "auto",
          maxWidth: "100%",
          maxHeight:"50%",
          border: "1px solid gray",
        }}
      >
        <Table variant="striped">
          <Thead backgroundColor="white" position="sticky" top={0} zIndex={1} >
            <Tr>
              <Th>
                  <Checkbox
                    colorScheme="cyan"
                    isChecked={selectedRowIds.length > 0}
                    onChange={handleSelectAllCheckboxClick}
                  />
              </Th>
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
              ? clients.map((client,index) => (
                  <Tr key={client.id}>
                    <Td onClick={(e) => e.stopPropagation()}
                          >
                          <HoverCheckbox
                      clientId={client.id}
                      index={index}
                      isSelected={selectedRowIds.includes(client.id)}
                      onSelectionChange={handleRowSelect}
                    />
                  </Td>
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
      <DeleteRowModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </VStack>
  );
};
