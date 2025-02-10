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

// import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { CaseManager } from "../caseManager/CaseManager";

interface Food {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  entranceDate: string;
  exitDate: string;
  dateOfBirth: string;
}

interface Costco {
    id: string;
    locationId: string;
    name: string;
    type: string;
  }


export const Donations = () => {
//   const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();

  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foodResponse = await backend.get("/foodDonations");
        setDonations(foodResponse.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [backend]);

//   const navigate = useNavigate();

  return (
    <VStack
      spacing = {2}
      align = "start"
      sx={{ maxWidth: "100%", marginX: "auto", padding: "4%" }}
    >
      <Heading paddingBottom = "10px">Donations</Heading>
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
              <Th>Date</Th>
              <Th>Category</Th>
              <Th>Weight (lb)</Th>
              <Th>Value ($)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {donations
              ? donations.map((donation) => (
                //   <Tr key={client.id} onClick={() => navigate(``)} style={{ cursor: "pointer" }}>
                  <Tr key={donation.id}>
                    <Td>{donation.date}</Td>
                    <Td>{donation.category}</Td>
                    <Td>{donation.weight}</Td>
                    <Td>{donation.value}</Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};
