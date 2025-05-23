import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Collapse,
  VStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useDisclosure,
  HStack,
  Checkbox,
} from "@chakra-ui/react";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { HoverCheckbox } from "../hoverCheckbox/hoverCheckbox";

interface IdMap {
  [key: number]: boolean;
}

export const UpdateClients = () => {
  const { backend } = useBackendContext();
  const [updateRequests, setUpdateRequests] = useState<any[]>([]);
  const { currentUser } = useAuthContext();
  const { isOpen, onToggle } = useDisclosure();
  const [ allIds, setAllIds ] = useState<number[]>([]);
  const [ selectedIds, setSelectedIds ] = useState<IdMap>({});
  const [ allSelected, setAllSelected] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        fillTable();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [backend, refresh]);

  const fillTable = async () => {
    const requests = await backend.get("/request/activeRequests");
    setUpdateRequests(requests.data.requests);
    setAllIds(requests.data.ids.map((id: any) => id.id));
    setSelectedIds(requests.data.ids.reduce((acc: IdMap, id: number) => { acc[id] = false; return acc; }, {}))
  };

  const handleComplete = async () => {
    try{
      setDisabled(true);
      const selectedIdsArray = Object.keys(selectedIds).filter((id) => selectedIds[Number(id)]);
      if (selectedIdsArray.length === 0) {
        return;
      }
      // console.log("Selected IDs:", selectedIdsArray);
      await backend.put("/request", {
        ids: selectedIdsArray,
        status: "approved",
        admin: currentUser,
      });
      setAllSelected(false);
      setSelectedIds(allIds.reduce((acc: IdMap, id: number) => { acc[id] = false; return acc; }, {}))
      setRefresh((prev) => !prev);
    }catch(err){
    }
  };

  const handleSelectAll = () => {
    if(Object.values(selectedIds).every((value) => value === true)) {
      setSelectedIds(allIds.reduce((acc: IdMap, id: number) => { acc[id] = false; return acc; }, {}))
      setAllSelected(false)
    } else {
      setSelectedIds(allIds.reduce((acc: IdMap, id: number) => { acc[id] = true; return acc; }, {}))
      setAllSelected(true)
    }
    
  }

  const handleCheckbox = (id: number) => {
    const newSelectedIds = { ...selectedIds, [id]: !selectedIds[id] };
    setSelectedIds(newSelectedIds);
    if (allSelected) {
      setAllSelected(false);
    } else {
      const allTrue = Object.values(newSelectedIds).every((value) => value === true);
      setAllSelected(allTrue);
    }
    const allFalse = Object.values(newSelectedIds).every((value) => value === false);
    if (allFalse) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }

  return (
    <VStack alignItems={'start'} width={'100%'}>
      <HStack width={'100%'} justifyContent={'space-between'}>
        <Button
          rightIcon={isOpen ? <FaAngleUp /> : <FaAngleDown />}
          onClick={onToggle}
          variant={'ghost'}
          _hover={'ghost'}
          _active={'ghost'}
          size={'lg'}
        >
          Edit Requests
        </Button>
        {isOpen &&
          <Button size={'lg'} onClick={handleComplete} isDisabled={disabled}>Complete</Button>
        }
      </HStack>
      
      <Box width="full">
        <Collapse
          in={isOpen}
          animateOpacity
        >
          <TableContainer
            width="100%"
            height="40vh"
            sx={{
              overflowX: "auto",
              overflowY: "auto",
              maxWidth: "100%",
              border: "1px solid gray",
            }}
          >
            <Table variant="striped">
              <Thead
                position={"sticky"}
                zIndex={10}
                top={0}
                background={"white"}
              >
                <Tr>
                  <Th><Checkbox onChange={handleSelectAll} isChecked={allSelected}></Checkbox></Th>
                  <Th>Time and Date Submitted</Th>
                  <Th>Case Manager</Th>
                  <Th>Name</Th>
                  <Th>Request to Edit</Th>
                </Tr>
              </Thead>
              <Tbody>
                {updateRequests
                  ? updateRequests.map((approvals, index) => (
                      <Tr key={approvals.id}>
                        <Td><HoverCheckbox
                          id={approvals.id}
                          isSelected={selectedIds[approvals.id] || false}
                          onSelectionChange={handleCheckbox}
                          index={index}
                        /></Td>
                        <Td>
                          {new Date(approvals.created_at).toLocaleString(
                            "en-GB",
                            { timeZone: "America/Los_Angeles" }
                          )}
                        </Td>
                        <Td>
                          {approvals.cm_first_name} {approvals.cm_last_name}
                        </Td>
                        <Td>
                          {approvals.first_name} {approvals.last_name}
                        </Td>
                        <Td>{approvals.comments}</Td>
                      </Tr>
                    ))
                  : null}
              </Tbody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>
    </VStack>
  );
};
