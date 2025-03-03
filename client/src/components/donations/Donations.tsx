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
  Select,
  StatNumber,
  Input,
  Checkbox,
  Button
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
  const [costcoDonations, setCostcoDonations] = useState<any[]>([]);
  const [allDonations, setAllDonations] = useState<any[]>([]);
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
      try {
        const costcoResponse = await backend.get("/costcoDonations");
        setCostcoDonations(costcoResponse.data);
      } catch (error) {
        console.error("Error fetching Costco donations:", error);
      }
      const updatedFood = donations.map(({ id, date, category, weight, value }) => ({
        id: id,
        date: date,
        donor: category,
        category: "food",
        weight: weight,
        value: value
      }));

      const updatedCostco = costcoDonations.map(({ id, date, amount, category}) => ({
        id: id,
        date: date,
        donor: "costco",
        category: category,
        weight: 0,
        value: amount
      }));

      setAllDonations([...updatedFood, ...updatedCostco]);
    };
    fetchData();
  }, [backend, donations, costcoDonations]);

  

//   const navigate = useNavigate();

  return (
    <HStack w="100vw" h="100vh">
      <VStack w="25vw" h="100%">
        <Heading>Donations</Heading>
        <Text>Last Updated: MM/DD/YYYY HH:MM XX</Text>
        <HStack
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

      <VStack w="75vw" h="100%">
        <HStack bg='white' w='90%' p={3} spacing={4} align='center'>
          <Select placeholder='Select Donor' w='50%'>
            <option value='panera'>panera</option>
            <option value='sprouts'>sprouts</option>
            <option value='copia'>copia</option>
            <option value='mcdonalds'>mcdonalds</option>
            <option value='pantry'>pantry</option>
            <option value='grand_theater'>grand theater</option>
            <option value='costco'>costco</option>
          </Select>

          <Select placeholder='Select Frequency' w='50%'>
            <option value='option1'>Option 1</option>
            <option value='option2'>Option 2</option>
            <option value='option3'>Option 3</option>
          </Select>

          <Input type="date" name="startDate" w='40%'/> {/*value={startDate} onChange={handleDateChange}*/}
          <Input type="date" name="endDate" w='40%'/> {/*value={startDate} onChange={handleDateChange}*/}

          <Button ml='auto'>Delete</Button>
          <DonationsDrawer/>
        </HStack>

        <TableContainer
          width = "95%"
          sx={{
            overflowX: "auto",
            maxWidth: "95%",
            borderRadius: "10px",
            border: "1px solid gray",
            overflow: "hidden"
          }}
        >
          <Table variant="striped"
            sx={{
              borderCollapse: "collapse",
              width: "100%"
              // borderSpacing: "0", // Prevents border gaps
              // borderColor: "gray.300", // Ensures borders are visible
            }}
          >
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Date</Th>
                <Th>Donor</Th>
                <Th>Category</Th>
                <Th>Weight (lb)</Th>
                <Th>Value ($)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allDonations
                ? allDonations.map((donation, index) => (
                  //   <Tr key={client.id} onClick={() => navigate(``)} style={{ cursor: "pointer" }}>
                    <Tr key={index}>
                      <Td>
                        <Checkbox>{donation.id}</Checkbox>
                      </Td>
                      <Td>{donation.date}</Td>
                      <Td>{donation.donor}</Td>
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
