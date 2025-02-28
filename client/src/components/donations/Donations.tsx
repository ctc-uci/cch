import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import DonationsDrawer from "./donationsDrawer";

import {
  Heading,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

import { FaBalanceScale } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";

// import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

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
  const [valueSum, setValueSum] = useState<number | null>(null);
  const [weightSum, setWeightSum] = useState<number | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const foodResponse = await backend.get("/foodDonations");
        setDonations(foodResponse.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      try {
        const valuesResponse = await backend.get("/foodDonations/valueSum");
        setValueSum(valuesResponse.data[0].sum);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      try {
        const weightResponse = await backend.get("/foodDonations/weightSum");
        setWeightSum(weightResponse.data[0].sum);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [backend]);

  

//   const navigate = useNavigate();

  return (
    <HStack w="100vw" h="100vh">
      <VStack w="25%" bg='yellow' h="100%">
        <Heading>Donations</Heading>
        <Text>Last Updated: </Text>
        <HStack
        bg='white'
        border="2px solid #CBD5E0"
        borderRadius="12px"
        p={4}
        w="75%"
        justify="center"
        >
          <Stat>
              <StatNumber fontSize={"3xl"} fontWeight="bold">${valueSum}</StatNumber>
              <StatLabel>
                <HStack spacing={1}>
                  <FaDollarSign color="#4397CD"/>
                  <span>Total Value</span>
                </HStack>
              </StatLabel>
          </Stat>
        </HStack>
        <HStack
        bg='white'
        border="2px solid #CBD5E0"
        borderRadius="12px"
        p={4}
        w="75%"
        justify="center"
        >
          <Stat>
              <StatNumber fontSize={"3xl"} fontWeight="bold">${weightSum}</StatNumber>
              <StatLabel>
                <HStack spacing={1}>
                  <FaBalanceScale color="#4397CD"/>
                  <span>Total Value</span>
                </HStack>
              </StatLabel>
          </Stat>
        </HStack>
      </VStack>
      <VStack w="75%" bg="green" h="100%">
        <DonationsDrawer/>
      </VStack>
    </HStack>

    // <VStack
    //   spacing = {2}
    //   align = "start"
    //   sx={{ maxWidth: "100%", marginX: "auto", padding: "4%" }}
    // >
    //   <Heading paddingBottom = "10px">Donations</Heading>
    //   <Heading size = "md" paddingBottom="40px">Last Updated: {}</Heading>
    //   <TableContainer
    //     width = "100%"
    //     sx={{
    //       overflowX: "auto",
    //       maxWidth: "100%",
    //       border: "1px solid gray"
    //     }}
    //   >
    //     <Table variant="striped">
    //       <Thead>
    //         <Tr>
    //           <Th>Date</Th>
    //           <Th>Category</Th>
    //           <Th>Weight (lb)</Th>
    //           <Th>Value ($)</Th>
    //         </Tr>
    //       </Thead>
    //       <Tbody>
    //         {donations
    //           ? donations.map((donation) => (
    //             //   <Tr key={client.id} onClick={() => navigate(``)} style={{ cursor: "pointer" }}>
    //               <Tr key={donation.id}>
    //                 <Td>{donation.date}</Td>
    //                 <Td>{donation.category}</Td>
    //                 <Td>{donation.weight}</Td>
    //                 <Td>{donation.value}</Td>
    //               </Tr>
    //             ))
    //           : null}
    //       </Tbody>
    //     </Table>
    //   </TableContainer>
    // </VStack>
  );
};
