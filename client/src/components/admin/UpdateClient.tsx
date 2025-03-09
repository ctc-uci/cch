import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useDisclosure } from '@chakra-ui/react'

import {
    Button,
    Box,
    Collapse,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
  } from "@chakra-ui/react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";


export const UpdateClients = () => {
  const { backend } = useBackendContext();
  const [updateRequests, setUpdateRequests] = useState<any[]>([]);
  const { currentUser } = useAuthContext();
  const { isOpen, onToggle } =    useDisclosure()


  useEffect(() => {
    const fetchData = async () => {
      try { 
        fillTable();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [backend]);

  const fillTable = async () => {
    const requests = await backend.get("/request/activeRequests");
    setUpdateRequests(requests.data);
  }

  const handleClick = async (status, request_id) => {
    try{
        const res = await backend.put(`/request/${request_id}`, {status, admin: { uid: currentUser.uid }});
        fillTable();
    }catch(e){
        console.log(e);
    }
    
  };


  return (
    <>
        <Button rightIcon={ isOpen ? <FaAngleUp /> : <FaAngleDown/>} onClick={onToggle}>Edit Requests</Button>
        <Box width = "full">
            <Collapse in={isOpen} animateOpacity>
                <TableContainer
                width = "100%"
                height = "40vh"
                sx={{
                overflowX: "auto",
                overflowY: "auto",
                maxWidth: "100%",
                border: "1px solid gray"
                }}
                >
                    <Table variant="striped">
                    <Thead 
                    position={"sticky"} 
                    zIndex={10} top={0} 
                    background={"white"}
                    >
                        <Tr>
                            <Th>Id</Th>
                            <Th>Time and Date Submitted</Th>
                            <Th>Case Manager</Th>
                            <Th>Name</Th>
                            <Th>Request to Edit</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {updateRequests
                        ? updateRequests.map((approvals) => (
                            <Tr key={approvals.id}>
                                <Td>{approvals.id}</Td>
                                <Td>{new Date(approvals.created_at).toLocaleString("en-GB", { timeZone: "America/Los_Angeles" })}</Td>
                                <Td>{approvals.cm_first_name} {approvals.cm_last_name}</Td>
                                <Td>{approvals.first_name} {approvals.last_name}</Td>
                                <Td>{approvals.comments}</Td>
                                <Td>
                                    <Button onClick={() => (handleClick('approved', approvals.id))}>Approve</Button>
                                    <Button onClick={() => (handleClick('rejected', approvals.id))}>Deny</Button>
                                </Td>
                            </Tr>
                            ))
                        : null}
                    </Tbody>
                    </Table>
                </TableContainer>
            </Collapse> 
        </Box>
    </>
  );
};


