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

import { Donation, DonationBody } from "./types";


export const Donations = () => {
//   const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();

  const [donor, setDonor] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [deletes, setDeletes] = useState<number[]>([]);

  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [valueSum, setValueSum] = useState<number | null>(null);
  const [weightSum, setWeightSum] = useState<number | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const [toggleRefresh, setToggleRefresh] = useState<boolean>(false);

  const handleRowClick = (donation: Donation) => {
    setSelectedDonation(donation);
    onOpen();
  };

  // const handleUpdateDonation = (updatedDonation: Donation) => {
  //   try {
  //     const donationBody: DonationBody = {
  //       donor: updatedDonation.donor,
  //       date: updatedDonation.date,
  //       weight: updatedDonation.weight,
  //       category: updatedDonation.category,
  //       value: updatedDonation.value,
  //     };
  //     if(!updatedDonation.id) {
  //       backend.post('/donations', donationBody);
  //     } else {
  //      backend.put('/donations/' + updatedDonation.id, donationBody);
  //     }
  //     refreshPage();
  //     setSelectedDonation(null);
  //   }
  //   catch (error) {
  //     console.error("Error updating donation:", error);
  //   }
  // };

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

  const handleCheckboxChange = (id: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
    if (checked) {
      setDeletes([...deletes, id]);
    } else {
      setDeletes(deletes.filter((deleteId) => !(deleteId === id)));
    }
  };

  const deleteClick = async () => {
    try {
      await backend.delete("/donations", {
        data: {
          ids: deletes,
        },
      });
      refreshPage();
    } catch (error) {
      console.error("Error deleting users:", error);
    }
    setDeletes([]);
  };

  const refreshPage = () => {
    setToggleRefresh(!toggleRefresh);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const valuesResponse = (await backend.get(`/donations/valueSum?donor=${donor}&startDate=${startDate ? startDate.toLocaleDateString() : ""}&endDate=${endDate ? endDate.toLocaleDateString() : ""}`)).data[0].sum;
        setValueSum(valuesResponse);
      } catch (error) {
        console.error("Error fetching value sum:", error);
      }
      try {
        const weightResponse = await backend.get(`/donations/weightSum?donor=${donor}&startDate=${startDate ? startDate.toLocaleDateString() : ""}&endDate=${endDate ? endDate.toLocaleDateString() : ""}`);
        setWeightSum(weightResponse.data[0].sum);
      } catch (error) {
        console.error("Error fetching weight sum:", error);
      }

      try {
        const response = await backend.get(`/donations/filter?donor=${donor}&startDate=${startDate ? startDate.toLocaleDateString() : ""}&endDate=${endDate ? endDate.toLocaleDateString() : ""}`);
        setAllDonations(response.data);
      } catch (err) {
        console.error("Error fetching donation data", err);
      }
    };
    fetchData();
  }, [backend, donor, startDate, endDate, allDonations, toggleRefresh]);

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
          <Button ml='auto' onClick={() => {setSelectedDonation(null); onOpen();}}>Add</Button>
          <EditDrawer
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setSelectedDonation(null);
            }}
            onFormSubmitSuccess={refreshPage}
          />
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
                ? allDonations.map((donation, index) => {
                  const dateString = new Date(donation.date).toLocaleDateString();
                  return (
                    <Tr key={index}>
                      <Td>
                        <Checkbox
                        onChange={
                          handleCheckboxChange(donation.id)
                        }
                        isChecked={deletes.some(del => del === donation.id)}
                        >{donation.id}</Checkbox>
                      </Td>
                      <Td onClick={() => handleRowClick(donation)}>{dateString}</Td>
                      <Td onClick={() => handleRowClick(donation)}>{donation.donor}</Td>
                      <Td onClick={() => handleRowClick(donation)}>{donation.category}</Td>
                      <Td onClick={() => handleRowClick(donation)}>{donation.weight}</Td>
                      <Td onClick={() => handleRowClick(donation)}>{donation.value}</Td>
                      <Td onClick={() => handleRowClick(donation)}>{donation.weight * donation.value}</Td>
                    </Tr>
                  );})
                : null}
            </Tbody>
          </Table>
          {selectedDonation && (
            <EditDrawer
              isOpen={isOpen}
              onClose={() => {
                onClose();
                setSelectedDonation(null);
                refreshPage();
              }}
              existingDonation={selectedDonation}
              onFormSubmitSuccess={refreshPage}
            />
          )}
        </TableContainer>

      </VStack>

    </HStack>

  );
};
