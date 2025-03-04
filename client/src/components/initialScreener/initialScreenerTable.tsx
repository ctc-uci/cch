import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineManageSearch } from "react-icons/md";
import {
  IconButton,
  Heading,
  HStack,
  Box,
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

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

import { InitialScreener } from "../../types/initialScreener";
import { InitialScreeningFilter } from "./initialScreeningFilter";

export const InitialScreenerTable = () => {

  const navigate = useNavigate();

  const { backend } = useBackendContext();

  const [screeners, setScreeners] = useState<InitialScreener[]>([]);
  const [searchKey, setSearchKey] = useState("");
  const [filterQuery, setFilterQuery] = useState<string[]>([]);
  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleIconClick = () => {
    setIsInputVisible(true); 
  };

  const handleInputBlur = () => {
    if (!searchKey) {
      setIsInputVisible(false); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (searchKey && filterQuery.length > 1) {
          response = await backend.get(
            `/initialInterview/initial-interview-table-data?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=${searchKey}`
          );
        } else if (searchKey) {
          response = await backend.get(
            `/initialInterview/initial-interview-table-data?page=&filter=&search=${searchKey}`
          );
        } else if (filterQuery.length > 1) {
          response = await backend.get(
            `/initialInterview/initial-interview-table-data?page=&filter=${encodeURIComponent(filterQuery.join(" "))}&search=`
          );
        } else {
          response = await backend.get("/initialInterview/initial-interview-table-data");
        }
        setScreeners(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [backend, searchKey, filterQuery]);

  return (
    <VStack
      spacing={2}
      align="start"
      sx={{ maxWidth: "100%", marginX: "auto", padding: "4%" }}
    >
    
      <Heading fontSize="3xl" lineHeight="9" fontWeight="extrabold" paddingBottom={"0.5%"}>
    List of Initial Screeners
        </Heading>
        <Text
            size="sm"
            marginBottom={"1%"}
            >
          Last Updated: MM/DD/YYYY HH:MM XX {}
        </Text>
        <Heading fontSize="md" lineHeight="6" fontWeight="semibold" marginBottom={"0.5%"}> Choose a Screener</Heading>


     <Box border="1px" borderColor={"#E2E8F0"} borderRadius="md" p={4} overflow="hidden" w="100%">
            
        <HStack
            width="100%"
            justifyContent="space-between"
        >
            <InitialScreeningFilter setFilterQuery={setFilterQuery}/>
            {isInputVisible ? (
                <Input
                fontSize="12px"
                width="150px"  // Adjust width as needed
                height="30px"
                placeholder="Search"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                onBlur={handleInputBlur}
                />
            ) : (
                <IconButton
                aria-label="Search"
                icon={<MdOutlineManageSearch fontSize={"24px"}/>}
                onClick={handleIconClick}
                variant="ghost"
                />
            )}

        </HStack>
        <TableContainer
            sx={{
            overflowX: "auto",
            maxWidth: "100%",
            }}
        >
            <Table variant="striped">
            <Thead>
                <Tr>
                <Th>Client First Name</Th>
                <Th>Client Last Name</Th>
                <Th>Site</Th>
                <Th>Case Manager</Th>
                <Th>Phone Number</Th>
                <Th>E-mail</Th>
                <Th>Date</Th>
                </Tr>
            </Thead>
            <Tbody>
            {screeners?.map((screener) => {
                const [firstName, ...lastNameParts] = screener.clientName.split(" ");
                const lastName = lastNameParts.join(" ");


                return (
                    <Tr
                    key={screener.clientId}
                    onClick={() => navigate(`/comment-form/${screener.clientId}`)}
                    style={{ cursor: "pointer" }}
                    >
                    <Td>{firstName}</Td>
                    <Td>{lastName}</Td>
                    <Td>{screener.socialWorkerOfficeLocation}</Td>
                    <Td>{screener.cmFirstName} {screener.cmLastName}</Td>
                    <Td>{screener.phoneNumber}</Td>
                    <Td>{screener.email}</Td>
                    <Td>{new Date(screener.date).toLocaleDateString()}</Td>
                    </Tr>
                );
                })}
            </Tbody>
            </Table>
        </TableContainer>
        </Box>
    </VStack>
  );
};
