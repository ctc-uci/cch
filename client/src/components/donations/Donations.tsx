import { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
// import { useNavigate } from "react-router-dom";
import DonationsDrawer from "./addDonations/donationsDrawer";
import EditDrawer from "./editDonationDrawer";

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

interface Donation {
    id: number,
    donor: string,
    date: Date,
    category: string,
    weight: number,
    value: number,
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  
  const handleRowClick = (donation: Donation) => {
    setSelectedDonation(donation);
    onOpen();
  };

  const handleUpdateDonation = (updatedDonation: Donation) => {
    try {
      if (updatedDonation.donor === "costco") {
        const costcoDonate = {
          id: updatedDonation.id,
          date: updatedDonation.date,
          amount: updatedDonation.value,
          category: updatedDonation.category
        };
        backend.put(`/costcoDonations/${costcoDonate.id}`, costcoDonate);
      }
      else {
        const foodDonate = {
          id: updatedDonation.id,
          date: updatedDonation.date,
          category: updatedDonation.donor,
          weight: updatedDonation.weight,
          value: updatedDonation.value
        };
        backend.put(`/foodDonations/${updatedDonation.id}`, foodDonate);
      }
      setAllDonations(allDonations.map((donation) => {
        if (donation.id === updatedDonation.id) {
          return updatedDonation;
        }
        return donation;
      }
      ));
    }
    catch (error) {
      console.error("Error updating donation:", error);
    }
  };

  const handleDonorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDonor(event.target.value);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setStartDate(dateValue ? new Date(dateValue) : undefined);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setEndDate(dateValue ? new Date(dateValue) : undefined);
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
        const valuesFoodResponse = await backend.get("/foodDonations/valueSum");
        const valuesCostcoResponse = await backend.get("/costcoDonations/valueSum");
        const valuesResponse = Number(valuesFoodResponse.data[0].sum) + Number(valuesCostcoResponse.data[0].sum);
        setValueSum(valuesResponse);
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
          filteredDonations = filteredDonations.filter((donation) => new Date(donation.date) >= new Date(startDate));
        }
        if (endDate) {
          filteredDonations = filteredDonations.filter((donation) => new Date(donation.date) <= new Date(endDate));
        }
        setAllDonations(filteredDonations);
      } catch (err) {
        console.error("Error fetching donation data", err);
      }
    };
    fetchData();
  }, [backend, donor, startDate, endDate, allDonations]);

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
              <StatNumber fontSize={"3xl"} fontWeight="bold">{weightSum}</StatNumber>
              <StatLabel>
                <HStack spacing={1}>
                  <FaBalanceScale color="#4397CD"/>
                  <span>Total Weight (lbs)</span>
                </HStack>
              </StatLabel>
          </Stat>
        </HStack>
      </VStack>

      <VStack w='69vw' h='95vh'>
        <HStack w='90%' spacing={4} align='center'>
          <Select id="donorSelect" placeholder='Select Donor' w='50%' onChange={handleDonorChange}>
            <option value='panera'>Panera</option>
            <option value='sprouts'>Sprouts</option>
            <option value='copia'>Copia</option>
            <option value='mcdonalds'>Mcdonalds</option>
            <option value='pantry'>Pantry</option>
            <option value='grand theater'>Grand Theater</option>
            <option value='costco'>Costco</option>
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
          width = "100%"
          maxHeight="75%"
          sx={{
            overflowX: "auto",
            overflowY: "auto",
            maxWidth: "100%",
          }}
        >
          <Table variant="striped"
            sx={{
              borderCollapse: "collapse",
              border: "1px solid gray",
              width: "100%",
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
                <Th>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allDonations
                ? allDonations.map((donation, index) => (
                    <Tr key={index}>
                      <Td>
                        <Checkbox
                        onChange={
                          handleCheckboxChange(donation.id, donation.donor)
                        }
                        isChecked={deletes.some(del => del[0] === donation.id && del[1] === donation.donor)}
                        >{donation.id}</Checkbox>
                      </Td>
                      <Td onClick={() => handleRowClick(donation)}>{donation.date}</Td>
                      <Td onClick={() => handleRowClick(donation)}>{donation.donor}</Td>
                      <Td onClick={() => handleRowClick(donation)}>{donation.category}</Td>
                      <Td onClick={() => handleRowClick(donation)}>{donation.weight}</Td>
                      <Td onClick={() => handleRowClick(donation)}>{donation.value}</Td>
                      <Td onClick={() => handleRowClick(donation)}>{donation.weight * donation.value}</Td>
                    </Tr>
                  ))
                : null}
            </Tbody>
          </Table>
          <EditDrawer
            isOpen={isOpen}
            onClose={onClose}
            existingDonation={selectedDonation}
            onSubmit={handleUpdateDonation}
          />
        </TableContainer>

      </VStack>

    </HStack>

  );
};
