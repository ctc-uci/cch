import { useEffect, useState, useCallback } from "react";
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
import { set } from "react-hook-form";

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

  const [donor, setDonor] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [deletes, setDeletes] = useState<[string, string][]>([]);

  const [allDonations, setAllDonations] = useState<any[]>([]);
  const [valueSum, setValueSum] = useState<number | null>(null);
  const [weightSum, setWeightSum] = useState<number | null>(null);

  const handleDonorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDonor(event.target.value);
    console.log(donor);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setStartDate(dateValue ? new Date(dateValue) : undefined);
    console.log(startDate);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setEndDate(dateValue ? new Date(dateValue) : undefined);
    console.log(endDate);
  };

  const handleCheckboxChange = (id: string, donor: string) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
    if (checked) {
      setDeletes([...deletes, [id, donor]]);
    } else {
      setDeletes(deletes.filter((deleteId) => !(deleteId[0] === id && deleteId[1] === donor)));
    }
  };

  const deleteClick = async () => {
    try {
      const costco_dels = [];
      const food_dels = [];
      for (const del of deletes) {
        if (del[1] === "costco") {
          costco_dels.push(del[0]);
        } else {
          food_dels.push(del[0]);
        }
      }
      if (costco_dels.length > 0) {
        await backend.delete("/costcoDonations", { data: { ids: costco_dels } });
      }
      if (food_dels.length > 0) {
        await backend.delete("/foodDonations", { data: { ids: food_dels } });
      }
    } catch (error) {
      console.error("Error deleting users:", error);
    }
    setDeletes([]);
  };

  useEffect(() => {
    const fetchData = async () => {
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
        let donationsData = [];
        let costcoData = [];
        
        if (donor === "") {
          const [foodResponse, costcoResponse] = await Promise.all([
            backend.get("/foodDonations"),
            backend.get("/costcoDonations")
          ]);

          donationsData = foodResponse.data.map(({ id, date, category, weight, value }) => ({
            id,
            date,
            donor: category,
            category: "food",
            weight,
            value,
          }));
  
          costcoData = costcoResponse.data.map(({ id, date, amount, category }) => ({
            id,
            date,
            donor: "costco",
            category,
            weight: 0,
            value: amount,
          }));
        } else if (donor === "costco") {
          const costcoResponse = await backend.get("/costcoDonations");
          costcoData = costcoResponse.data.map(({ id, date, amount, category }) => ({
            id,
            date,
            donor: "costco",
            category,
            weight: 0,
            value: amount,
          }));
        } else {
          const foodResponse = await backend.get(`/foodDonations/${donor}`);
          donationsData = foodResponse.data.map(({ id, date, category, weight, value }) => ({
            id,
            date,
            donor: category,
            category: "food",
            weight,
            value,
          }));
        }
        let filteredDonations = ([...donationsData, ...costcoData]);
        if (startDate) {
          console.log("start date");
          console.log(startDate);
          filteredDonations = filteredDonations.filter((donation) => new Date(donation.date) >= new Date(startDate));
        }
        if (endDate) {
          console.log("end date");
          console.log(endDate);
          filteredDonations = filteredDonations.filter((donation) => new Date(donation.date) <= new Date(endDate));
        }
        setAllDonations(filteredDonations);
      } catch (err) {
        console.error("Error fetching donation data", err);
      }
    };
    fetchData();
  }, [backend, donor, startDate, endDate, allDonations]);

  

//   const navigate = useNavigate();

  return (
    <HStack w="100%" h="100%">
      <VStack w="25vw" h="100vh">
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

      <VStack w='69vw' h='100vh'>
        <HStack bg='white' w='90%' p={3} spacing={4} align='center'>
          <Select id="donorSelect" placeholder='Select Donor' w='50%' onChange={handleDonorChange}>
            <option value='panera'>panera</option>
            <option value='sprouts'>sprouts</option>
            <option value='copia'>copia</option>
            <option value='mcdonalds'>mcdonalds</option>
            <option value='pantry'>pantry</option>
            <option value='grand theater'>grand theater</option>
            <option value='costco'>costco</option>
          </Select>

          <Select placeholder='Select Frequency' w='50%'>
            <option value='option1'>Option 1</option>
            <option value='option2'>Option 2</option>
            <option value='option3'>Option 3</option>
          </Select>

          <Text>From:</Text>
          <Input type="date" name="startDate" w='40%' onChange={handleStartDateChange}/>
          <Text>To:</Text>
          <Input type="date" name="endDate" w='40%' onChange={handleEndDateChange}/>

          <Button ml='auto' onClick={deleteClick}>Delete</Button>
          <DonationsDrawer/>
        </HStack>

        <TableContainer
          width = "95%"
          sx={{
            overflowX: "auto",
            overflowY: "auto",
            maxWidth: "100%",
            borderRadius: "10px",
            border: "1px solid gray",
          }}
        >
          <Table variant="striped"
            sx={{
              borderCollapse: "collapse",
              width: "100%", 
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
                        <Checkbox 
                        onChange={handleCheckboxChange(donation.id, donation.donor)}
                        isChecked={deletes.some(del => del[0] === donation.id && del[1] === donation.donor)}
                        >{donation.id}</Checkbox>
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
